import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {marked} from 'marked';

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  quickAnswer: string;
  html: string;
  faqs: [string, string][];
  words: number;
  related: {href: string; label: string};
  eyebrow: string;
};

const DIR = join(process.cwd(), 'content', 'learn');

// Where each guide sends a ready-to-act reader.
const RELATED: Record<string, {href: string; label: string; eyebrow: string}> = {
  'clay-soil-foundations-fort-smith': {href: '/gutter-cleaning', label: 'Gutter cleaning', eyebrow: 'FOUNDATIONS / CLAY SOIL'},
  'when-to-clean-gutters-river-valley': {href: '/gutter-cleaning', label: 'Gutter cleaning', eyebrow: 'MAINTENANCE / TIMING'},
  'gutter-guards-questions-to-ask': {href: '/gutter-guards', label: 'Gutter guards', eyebrow: 'GUTTER GUARDS / BUYING'},
  'new-chaffee-crossing-homes-gutters': {href: '/lp/chaffee-new-home', label: 'Free new-home gutter check', eyebrow: 'CHAFFEE CROSSING / NEW HOMES'},
  'soft-wash-vs-pressure-wash': {href: '/soft-wash', label: 'House & roof soft wash', eyebrow: 'SOFT WASH / METHODS'},
  'pre-listing-exterior-checklist': {href: '/realtors', label: 'Pre-listing exterior service', eyebrow: 'SELLERS & AGENTS / CHECKLIST'},
};

// Order on the /learn index.
export const GUIDE_ORDER = [
  'clay-soil-foundations-fort-smith',
  'new-chaffee-crossing-homes-gutters',
  'gutter-guards-questions-to-ask',
  'when-to-clean-gutters-river-valley',
  'soft-wash-vs-pressure-wash',
  'pre-listing-exterior-checklist',
];

function frontmatter(src: string): [Record<string, string>, string] {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return [{}, src];
  const data: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
  }
  return [data, src.slice(m[0].length)];
}

function section(body: string, heading: RegExp): {text: string; rest: string} {
  const lines = body.split('\n');
  const start = lines.findIndex(l => heading.test(l));
  if (start < 0) return {text: '', rest: body};
  let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  if (end < 0) end = lines.length;
  return {text: lines.slice(start + 1, end).join('\n').trim(), rest: [...lines.slice(0, start), ...lines.slice(end)].join('\n')};
}

export const strip = (md: string) => md.replace(/\*\*|__|\[([^\]]+)\]\([^)]+\)/g, (_m, t) => t ?? '').replace(/\s+/g, ' ').trim();

export function getGuide(slug: string): Guide | null {
  let src: string;
  try { src = readFileSync(join(DIR, `${slug}.mdx`), 'utf8'); } catch { return null; }
  const [fm, raw] = frontmatter(src);
  const qa = section(raw, /^##\s+Quick answer/i);
  const faq = section(qa.rest, /^##\s+(FAQ|Frequently asked)/i);
  const faqs: [string, string][] = [];
  const re = /\*\*(.+?\?)\*\*\s*\n([\s\S]*?)(?=\n\s*\n\*\*|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(faq.text))) faqs.push([m[1].trim(), m[2].trim()]);
  // Body keeps the FAQ (rendered as a list below) out; the closing CTA after the last --- stays.
  const body = faq.rest.replace(/^#\s.*$/m, '').trim();
  const r = RELATED[slug] ?? {href: '/#estimate', label: 'Get an instant price', eyebrow: 'GUIDES'};
  return {
    slug,
    title: fm.title ?? slug,
    metaTitle: fm.metaTitle ?? fm.title ?? slug,
    metaDescription: fm.metaDescription ?? strip(qa.text).slice(0, 155),
    quickAnswer: strip(qa.text),
    html: marked.parse(body, {async: false, gfm: true}) as string,
    faqs,
    words: src.split(/\s+/).length,
    related: {href: r.href, label: r.label},
    eyebrow: r.eyebrow,
  };
}

export function allGuides(): Guide[] {
  const found = readdirSync(DIR).filter(f => f.endsWith('.mdx')).map(f => f.replace(/\.mdx$/, ''));
  const ordered = [...GUIDE_ORDER.filter(s => found.includes(s)), ...found.filter(s => !GUIDE_ORDER.includes(s))];
  return ordered.map(getGuide).filter((g): g is Guide => g !== null);
}

export const inline = (md: string) => marked.parseInline(md, {async: false, gfm: true}) as string;
