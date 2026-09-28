"""Chaffee Exteriors brand asset generator.

Builds every logo file from one geometry + real Archivo/JetBrains Mono outlines,
so all lockups stay pixel-consistent. Run: python3 brand/build.py
"""
import math, os, sys, json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "node_modules")
OUT = os.path.join(ROOT, "public", "brand")
os.makedirs(OUT, exist_ok=True)

# ---------------- palette ----------------
INK = "#172D35"      # Storm Slate
RIVER = "#42695B"    # River Green
ACTION = "#BF4824"   # Chaffee Ember
WATER = "#4FA3B6"    # Runoff Blue
PAPER = "#F7F6EF"    # Paper
SKY = "#E9EEE5"      # Mist
WHITE = "#FFFFFF"

# ---------------- type → paths ----------------
_cache = {}
def font(kind, **axes):
    key = (kind, tuple(sorted(axes.items())))
    if key in _cache: return _cache[key]
    path = {
        "archivo": f"{FONTS}/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
        "mono": f"{FONTS}/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2",
    }[kind]
    f = TTFont(path)
    if "fvar" in f and axes:
        f = instancer.instantiateVariableFont(f, axes)
    _cache[key] = f
    return f

def text_path(txt, f, size, x=0, y=0, tracking=0.0):
    """Return (svg path d, width) for txt set at baseline y. tracking in em."""
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    s = size / upm
    hmtx = f["hmtx"]
    ds, cx = [], x
    for i, ch in enumerate(txt):
        g = cmap.get(ord(ch))
        if g is None: continue
        pen = SVGPathPen(gs)
        tp = TransformPen(pen, (s, 0, 0, -s, cx, y))
        gs[g].draw(tp)
        ds.append(pen.getCommands())
        adv = hmtx[g][0] * s
        cx += adv + (tracking * size if i < len(txt) - 1 else 0)
    return " ".join(ds), cx - x

def cap_height(f, size):
    upm = f["head"].unitsPerEm
    os2 = f["OS/2"]
    return os2.sCapHeight * size / upm

# ---------------- the mark ----------------
# 240 x 240 grid. Roof chevron w/ swept delta tips, gutter rail, downspout that
# kicks water away, and an ember droplet sheltered under the peak.
K = 92 / 112  # chevron arm slope

def mark_parts(roof=INK, rail=RIVER, drop=ACTION):
    """240 x 280 grid. Upper chevron = roof ridge / delta nose.
    Lower chevron = gutter line; its right arm drops into a downspout.
    Ember drop = water released AWAY from the house."""
    roof_d = "M120 14 L232 106 L232 142 L120 50 L8 142 L8 106 Z"
    ro = 78 + 112 * K          # lower chevron outer, at x=232
    ri = 114 + 86 * K          # lower chevron inner, at x=206
    lower_d = (f"M120 78 L232 {ro:.1f} L232 222 L206 210 L206 {ri:.1f} "
               f"L120 114 L8 206 L8 170 Z")
    drop_d = ("M221 230 C221 230 238 250 238 261 C238 270.5 230.4 278 221 278 "
              "C211.6 278 204 270.5 204 261 C204 250 221 230 221 230 Z")
    return [("roof", roof_d, roof), ("rail", lower_d, rail), ("drop", drop_d, drop)]

def mark_svg_group(x=0, y=0, scale=1.0, colors=None, highlight=True):
    colors = colors or {}
    parts = mark_parts(**colors)
    inner = "".join(f'<path d="{d}" fill="{c}"/>' for _, d, c in parts)
    return f'<g transform="translate({x} {y}) scale({scale})">{inner}</g>'

def svg(w, h, body, bg=None, title="Chaffee Exteriors"):
    bgr = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img">'
            f'<title>{title}</title>{bgr}{body}</svg>')

def write(name, content):
    with open(os.path.join(OUT, name), "w") as fh: fh.write(content)

# ---------------- wordmark ----------------
def display_font(): return font("archivo", wght=800, wdth=125)
def sub_font(): return font("archivo", wght=600, wdth=125)
def mono_font(): return font("mono")

def wordmark(x, y, cap, color_main=INK, color_sub=RIVER, align="left", sub=True):
    """CHAFFEE over EXTERIORS. y = top of CHAFFEE caps. Returns (svg, width, height)."""
    fd, fs = display_font(), sub_font()
    size = cap / (fd["OS/2"].sCapHeight / fd["head"].unitsPerEm)
    main_d, main_w = text_path("CHAFFEE", fd, size, 0, 0, tracking=-0.01)
    # EXTERIORS sized so it spans the same width as CHAFFEE
    sub_cap = cap * 0.34
    sub_size = sub_cap / (fs["OS/2"].sCapHeight / fs["head"].unitsPerEm)
    raw_d, raw_w = text_path("EXTERIORS", fs, sub_size, 0, 0, 0)
    n = len("EXTERIORS") - 1
    tracking = (main_w - raw_w) / n / sub_size
    sub_d, sub_w = text_path("EXTERIORS", fs, sub_size, 0, 0, tracking)
    gap = cap * 0.30
    h = cap + gap + sub_cap
    ox = x - (main_w / 2 if align == "center" else 0)
    out = f'<path transform="translate({ox:.2f} {y + cap:.2f})" d="{main_d}" fill="{color_main}"/>'
    if sub:
        out += f'<path transform="translate({ox:.2f} {y + cap + gap + sub_cap:.2f})" d="{sub_d}" fill="{color_sub}"/>'
    else:
        h = cap
    return out, main_w, h

def mark_box(h):  # mark geometry is 240x280 (content 8..238 x 14..278)
    sc = h / 264
    return sc, 240 * sc

def horizontal(bg=None, dark=False, H=120, pad=0):
    roof, rail, sub, main = (PAPER, "#8FC1A9", "#8FC1A9", PAPER) if dark else (INK, RIVER, RIVER, INK)
    sc, mw = mark_box(H)
    m = mark_svg_group(pad - 8 * sc, pad - 14 * sc, sc, dict(roof=roof, rail=rail))
    cap = H * 0.46
    wm, ww, wh = wordmark(pad + mw + H * 0.26, pad + (H * 0.94 - (cap * 1.64)) / 2, cap, main, sub)
    W = pad * 2 + mw + H * 0.26 + ww
    return svg(round(W), round(H + pad * 2), m + wm, bg=bg)

def stacked(bg=None, dark=False, H=150, pad=0):
    roof, rail, sub, main = (PAPER, "#8FC1A9", "#8FC1A9", PAPER) if dark else (INK, RIVER, RIVER, INK)
    sc, mw = mark_box(H)
    cap = H * 0.36
    _, ww, wh = wordmark(0, 0, cap)
    W = max(ww, mw) + pad * 2
    cx = W / 2
    m = mark_svg_group(cx - 123 * sc, pad - 14 * sc, sc, dict(roof=roof, rail=rail))
    wm, _, wh = wordmark(cx, pad + H + H * 0.16, cap, main, sub, align="center")
    return svg(round(W), round(pad * 2 + H + H * 0.16 + wh), m + wm, bg=bg)

def wordmark_only(dark=False, cap=60):
    main, sub = (PAPER, "#8FC1A9") if dark else (INK, RIVER)
    wm, ww, wh = wordmark(0, 0, cap, main, sub)
    return svg(round(ww), round(wh), wm)

def mark_only(bg=None, dark=False, size=240, pad=0):
    roof, rail = (PAPER, "#8FC1A9") if dark else (INK, RIVER)
    sc = (size - 2 * pad) / 264
    body = mark_svg_group(pad + ((size - 2 * pad) - 230 * sc) / 2 - 8 * sc, pad - 14 * sc, sc, dict(roof=roof, rail=rail))
    return svg(size, size, body, bg=bg)

def mono(color):
    return mark_svg_group(-8, -14, 1, dict(roof=color, rail=color, drop=color))

def app_icon(size=512, radius=None):
    r = size * 0.22 if radius is None else radius
    sc = size * 0.62 / 264
    mw = 230 * sc
    body = (f'<rect width="{size}" height="{size}" rx="{r:.1f}" fill="{INK}"/>'
            + mark_svg_group((size - mw) / 2 - 8 * sc, size * 0.19 - 14 * sc, sc, dict(roof=PAPER, rail="#8FC1A9")))
    return svg(size, size, body)

def favicon():
    # hand-tuned for 16-32px: heavier chevrons, drop kept inside the tile
    body = (f'<rect width="32" height="32" rx="7" fill="{INK}"/>'
            f'<path d="M15 3 L27 12.6 V17 L15 7.4 L3 17 V12.6 Z" fill="{PAPER}"/>'
            f'<path d="M15 10.2 L27 19.8 V24.5 H23 V21.5 L15 15 L3 24.4 V19.9 Z" fill="#8FC1A9"/>'
            f'<path d="M24.6 24.4 C24.6 24.4 27.4 27.2 27.4 28.7 C27.4 30.1 26.2 30.8 24.6 30.8 C23 30.8 21.8 30.1 21.8 28.7 C21.8 27.2 24.6 24.4 24.6 24.4 Z" fill="{ACTION}"/>')
    return svg(32, 32, body)

def arc_text(txt, f, size, cx, cy, r, start_deg, tracking=0.2, bottom=False, color=INK):
    """Glyphs placed along a circle. start_deg = angle of text center (0 = top)."""
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm; s = size / upm
    advs = [f["hmtx"][cmap[ord(c)]][0] * s + tracking * size for c in txt]
    total = sum(advs) - tracking * size
    ang_total = total / r
    a = math.radians(start_deg) + (ang_total / 2 if bottom else -ang_total / 2)
    out = []
    for c, adv in zip(txt, advs):
        g = cmap[ord(c)]; w = f["hmtx"][g][0] * s
        mid = a + ((-1 if bottom else 1) * (w / 2) / r)
        px = cx + r * math.sin(mid); py = cy - r * math.cos(mid)
        rot = math.degrees(mid) + (180 if bottom else 0)
        pen = SVGPathPen(gs)
        base = (size * 0.36) if not bottom else -(size * 0.36) + size * 0.72
        tp = TransformPen(pen, (s, 0, 0, -s, -w / 2, (f["OS/2"].sCapHeight * s) / 2))
        gs[g].draw(tp)
        out.append(f'<path transform="translate({px:.2f} {py:.2f}) rotate({rot:.2f})" d="{pen.getCommands()}" fill="{color}"/>')
        a += (-1 if bottom else 1) * adv / r
    return "".join(out)

def badge(size=600, dark=False):
    bg, fg, ring, sub = (INK, PAPER, "#8FC1A9", "#8FC1A9") if dark else (PAPER, INK, RIVER, RIVER)
    c = size / 2
    fd = font("archivo", wght=800, wdth=125); fs = mono_font()
    body = [f'<circle cx="{c}" cy="{c}" r="{c - 4}" fill="{bg}" stroke="{fg}" stroke-width="{size*0.018:.1f}"/>',
            f'<circle cx="{c}" cy="{c}" r="{c*0.66:.1f}" fill="none" stroke="{ring}" stroke-width="{size*0.006:.1f}"/>']
    body.append(arc_text("CHAFFEE EXTERIORS", fd, size * 0.066, c, c, c * 0.8, 0, tracking=0.1, color=fg))
    body.append(arc_text("FORT SMITH · ARKANSAS", fs, size * 0.048, c, c, c * 0.8, 180, tracking=0.28, bottom=True, color=sub))
    for side in (-1, 1):
        body.append(f'<circle cx="{c + side * c * 0.8:.1f}" cy="{c:.1f}" r="{size*0.014:.1f}" fill="{ACTION}"/>')
    sc = size * 0.36 / 264
    body.append(mark_svg_group(c - 123 * sc, c - 146 * sc, sc, dict(roof=fg, rail=ring)))
    return svg(size, size, "".join(body))

def og_image():
    W, H = 1200, 630
    fd = display_font(); fs = mono_font()
    sc = 280 / 264
    parts = [f'<rect width="{W}" height="{H}" fill="{INK}"/>',
             f'<rect x="0" y="{H-14}" width="{W}" height="14" fill="{ACTION}"/>',
             mark_svg_group(96, 160, sc, dict(roof=PAPER, rail="#8FC1A9"))]
    wm, ww, wh = wordmark(430, 190, 70, PAPER, "#8FC1A9")
    parts.append(wm)
    line_d, _ = text_path("GUTTERS · GUARDS · SOFT WASH", fs, 26, 0, 0, 0.12)
    parts.append(f'<path transform="translate(432 382)" d="{line_d}" fill="{PAPER}" fill-opacity=".85"/>')
    ph_d, _ = text_path("(479) 492-4232  ·  CHAFFEEEXTERIORS.COM", fs, 22, 0, 0, 0.08)
    parts.append(f'<path transform="translate(432 428)" d="{ph_d}" fill="#8FC1A9"/>')
    return svg(W, H, "".join(parts))

if __name__ == "__main__":
    files = {
        "chaffee-logo-horizontal.svg": horizontal(),
        "chaffee-logo-horizontal-reverse.svg": horizontal(dark=True),
        "chaffee-logo-stacked.svg": stacked(),
        "chaffee-logo-stacked-reverse.svg": stacked(dark=True),
        "chaffee-wordmark.svg": wordmark_only(),
        "chaffee-wordmark-reverse.svg": wordmark_only(dark=True),
        "chaffee-mark.svg": mark_only(),
        "chaffee-mark-reverse.svg": mark_only(dark=True),
        "chaffee-mark-black.svg": svg(240, 280, mono("#000000")),
        "chaffee-mark-white.svg": svg(240, 280, mono("#FFFFFF")),
        "chaffee-app-icon.svg": app_icon(),
        "chaffee-favicon.svg": favicon(),
        "chaffee-badge.svg": badge(),
        "chaffee-badge-reverse.svg": badge(dark=True),
        "chaffee-og.svg": og_image(),
    }
    for k, v in files.items(): write(k, v)
    # inline paths for the website (lib/brand-paths.ts)
    fd, fs = display_font(), sub_font()
    cap = 100
    size = cap / (fd["OS/2"].sCapHeight / fd["head"].unitsPerEm)
    main_d, main_w = text_path("CHAFFEE", fd, size, 0, cap, tracking=-0.01)
    sub_cap = cap * 0.34
    sub_size = sub_cap / (fs["OS/2"].sCapHeight / fs["head"].unitsPerEm)
    _, raw_w = text_path("EXTERIORS", fs, sub_size, 0, 0, 0)
    tr = (main_w - raw_w) / 8 / sub_size
    gap = cap * 0.30
    sub_d, _ = text_path("EXTERIORS", fs, sub_size, 0, cap + gap + sub_cap, tr)
    parts = {k: d for k, d, _ in mark_parts()}
    ts = ("// Generated by brand/build.py. Do not edit by hand.\n"
          f"export const MARK_VIEWBOX = '8 14 230 264';\n"
          f"export const MARK = {json.dumps(parts)} as const;\n"
          f"export const WORDMARK_VIEWBOX = '0 0 {main_w:.1f} {cap + gap + sub_cap + 1:.1f}';\n"
          f"export const WORDMARK_MAIN = {json.dumps(main_d)};\n"
          f"export const WORDMARK_SUB = {json.dumps(sub_d)};\n")
    open(os.path.join(ROOT, "lib", "brand-paths.ts"), "w").write(ts)
    if os.path.exists(os.path.join(OUT, "_mark-test.svg")): os.remove(os.path.join(OUT, "_mark-test.svg"))
    print("\n".join(files))
