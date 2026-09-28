# 00 — README: Chaffee Exteriors Launch Kit

Prepared for Dre. Everything in this folder is a **draft** — nothing has been published, posted, sent, submitted, or spent. Folder: `~/Documents/Chaffee-Exteriors/launch-kit/`

| File | What it is |
|---|---|
| 01-pricing-check.md | Market pricing research + recommended final prices (18 cited sources) |
| 02-google-business-profile.md | Categories, 745-char description, services, 10 posts, 10 Q&As, 20-shot photo list |
| 03-ads/meta-ads.md | Meta ad copy: 3 campaigns × (5 hooks, 3 texts, 3 headlines, 15s + 30s scripts), targeting, $20/day budget, kill/scale rules — all links UTM-tagged |
| 03-ads/google-search.csv | Search keywords, RSA assets (limit-verified), negative keyword block — all links UTM-tagged |
| 04-video-content-30-days.md | 30 phone-shot short-form scripts + posting calendar |
| 05-realtor-outreach/targets.csv | 40 researched brokerages / PMs / inspectors with public contacts + source URLs |
| 05-realtor-outreach/sequence.md | 3-touch email + text sequence with reply decision tree |
| 05-realtor-outreach/one-pager.md | Agent offer one-sheet copy |
| 06-print.md | Door hanger, 18×24 yard sign, truck magnet — copy + brand specs |
| 07-blog/*.mdx | 6 articles, 903–971 words each, verified quick-answer/meta limits — **canonical versions now live at /learn; do not edit these further** |
| 08-first-10-customers.md | 14-day plan to 10 paid jobs, $0–$300: Chaffee Crossing door-hang route, group posts, network texts, daily targets, tracking |
| 09-receptionist-script.md | Arkansas Automated call script: intake, approved-sheet pricing only, $1,999+ routing rule, hard questions, confirmations |
| 10-job-ops.md | Pre-job checklist, estimate script + ≤$1,999 scope decision tree, photo protocol, report card, honest review ask, 3-sentence membership pitch |

---

## This week's action order (updated)

1. **Confirm the approved price sheet is live everywhere** — owner-supplied sheet (matches the website estimator) applied across all files; 08/09/10 were written to it directly. *(15 min to re-read 01)*
2. **Load the receptionist script (09) into Arkansas Automated** — including the >$1,999 routing rule and the licensed/insured deflection. *(30 min)*
3. **Start the 14-day plan (08) on the next weekday** — order hangers, send the 15 network texts, join and read rules of the 6 groups. *(Day 1 = 2 hours)*
4. **Set up the 10-job-ops (10) job card + photo protocol** — the photo flow feeds the 04 video calendar, so the first jobs double as content shoots. *(45 min)*
5. **GBP live using 02** — categories (Gutter cleaning service + Pressure washing service only), paste the description, add the 7 services; shots #1–5 the same afternoon. *(90 min)*

*Realtor outreach (05), ads (03), and print (06) start after the first 2–3 jobs exist — real before/after photos make every one of them work better. 07-blog is frozen; /learn on the site is canonical.*

## Needs Dre's approval or real-world input

- **Final price sign-off** (all public numbers trace to 01)
- **Ad account decisions:** Meta pixel/CAPI setup, budget start date, who manages weekly kill/scale reviews
- **Landing pages: confirmed live** — /lp/gutter-cleaning, /lp/gutter-guards, /lp/chaffee-new-home all exist on the site; every link, QR, and ad destination in 03–06 points at them with UTM tags (see scheme below)
- **Brand assets:** final logo files for print (06 assumes logo top-left on everything)
- **Realtor outreach:** send emails/texts yourself, one at a time, from your own address/number — kit never bulk-sends
- **Print production:** vendor quotes for hangers (die-cut), coroplast signs, 30-mil magnets
- **Blog publishing:** the 6 MDX files need the site's MDX pipeline (or conversion to the site's format) — meta fields are ready to paste
- **Photos:** every photo/video idea in 02 and 04 needs Dre (or a crew member) to actually shoot them
- **Reviews:** [REVIEW PLACEHOLDER] stays until real customers leave real reviews — do not pre-fill

## Rule checks run on the full kit

- ✅ **Rule 1 ($1,999 cap / no installs):** every public price audited; guard language capped at "$599–$1,999"; roof language at "$399–$749 (1–2 story), 3-story by quote"; negative keyword block suppresses seamless-install searches; 02 categories fixed (no "Gutter installer")
- ✅ **Rule 2 (no prohibited claims):** grep sweep for licensed / insured / bonded / certified / veteran-owned / #1 / best-in-Fort-Smith — clean (the one "today only" hit is an explicit disclaimer *against* the tactic)
- ✅ **Rule 3 (no fake proof):** no invented reviews, ratings, counts, or names; [REVIEW PLACEHOLDER] used wherever proof would eventually go
- ✅ **Rule 4 (no competitor names):** sweep for major national brand names — clean; copy says "national gutter-guard companies" / "franchise systems"
- ✅ **Rule 5 (no fake urgency):** no countdowns, expiring offers, or "limited spots"; cadence-based outreach only
- ✅ **Rule 6 (single CTA):** every public piece ends with site or phone, not both competing — the only two-CTA pieces (magnet, Q&A links) present them as one lockup block
- ✅ **Rule 7 (research cited):** 01 carries the full source table with URLs; the rain stat ("about 47 inches a year") ties to NWS data (47.34" annual normal); every researched fact in 05 targets.csv has a source URL

## UTM tagging scheme (all links across 03–06)

Every clickable destination carries `utm_campaign=launch`. Spoken voiceover lines, end-card display text, and on-screen script text keep the clean URL (display is not a link). `utm_source`/`utm_medium` by channel:

| Channel | utm_source | utm_medium |
|---|---|---|
| Meta ads (meta-ads.md) | facebook | paid_social |
| Google Search (google-search.csv) | google | cpc |
| Organic video captions (04) | social (swap to instagram / facebook / tiktok per platform) | organic_social |
| Realtor emails (sequence.md) | email | email |
| Agent one-pager (one-pager.md) | print | print |
| Door hanger QR (06) | qrcode | print |
| Door hanger back URL (06) | doorknocker | print |
| Truck magnet URL (06) | truck | vehicle |

Yard sign carries phone only — no URL to tag. Verify tagged links resolve (the site should ignore/accept query params) before the first ad spend.

## Consistency pass log (vs approved price sheet, this session)

Applied the owner-approved sheet across every file. What changed:

1. **Cleaning prices** — all "most homes $149–$275" variants (11 occurrences across 01, 02, 03, 04, 05, 07) replaced with the story tiers: **1-story $149–$229, 2-story $199–$299, 3-story $299–$399 (+$20–$60 larger homes)**. Ads/headlines use short form "From $149". Google RSA headlines "Most Homes $149-$275" ×2 replaced.
2. **House soft wash** — all "$299–$699" → **$299–$749** (6 files).
3. **Roof soft wash** — all "$399–$1,099" → **"most one- and two-story roofs $399–$749; 3-story by quote"** (7 occurrences). $1,099 no longer appears anywhere; 01's Rule 1 flag rewritten so 3-story/large roofs route to "by quote."
4. **Repair pricing** — removed "usually well under $500" (chaffee-new-home article); $129 service call + written quote after diagnosis is now the only repair pricing anywhere.
5. **Rainfall** — every "48 inches" / "nearly 48" → **"about 47 inches a year"** (14 occurrences across 01, 02, 03, 04, 07); the two U.S.-average comparisons deleted; GBP description re-verified at 741 chars after the change.
6. **Competitor price claims** — removed "National gutter-guard companies will quote you $4,000+" (meta-ads hook, replaced with a process-contrast hook) and the "$15 to $45 per linear foot / several thousand dollars" claims (gutter-guards article); process contrast (no long presentation, price in writing) kept without competitor numbers. 01's sourced market-research table (HomeAdvisor/Bob Vila bands) intentionally retained as internal research with citations — not public copy.
7. **First-person experience claims** — removed/reframed 12 instances ("we've seen," "we regularly find," "we pulled," "we cleaned," "one year ago we cleaned," "this house was going on the market," "the homeowner had," etc.) since the company is new. Day 1, 9, 10, 15, 16, 21, 25, 30 video scripts and two blog passages reframed as demonstrations or general practice.
8. **Annotation hygiene** — meta-ads primary-text character annotations recomputed (lengths now include UTM URLs); two Google RSA descriptions that exceeded 90 chars because of tagged URLs were shortened (URLs removed from description copy — the ads' destination URLs already carry the UTM tags).
9. **README + 01 aligned** — top-5 action #1 and the rule-check log now reference the owner-approved sheet; 01's public-language section updated to the new ranges.

Re-verified after all edits: zero leftover forbidden strings outside 01's cited market data; all 6 blog articles still 901–973 words with quick answers 40–60 words and meta limits intact; Google RSA 0 violations; GBP description 741 chars.

## Verification log (mechanical checks)

- GBP description: 745 characters (limit 750) — verified by script
- GBP service descriptions: all ≤ 300 characters — verified by script
- Google RSA headlines ≤ 30 chars, descriptions ≤ 90 chars — verified by script, 0 violations
- Blog: all 6 articles 903–971 words (spec 900–1,200); quick answers 53–59 words (spec 40–60); meta titles 41–57 chars (limit 60); meta descriptions 122–155 chars (limit 155)
- Yard sign: 4 words + phone (spec ≤ 6 words)
- UTM sweep: 26 links tagged across 03–06; grep confirmed zero untagged clickable links (only display/spoken mentions stay clean)
- Budget math: $9 + $6 + $5 = $20/day; scale ceiling $14/day per campaign with $4 floor — internally consistent
