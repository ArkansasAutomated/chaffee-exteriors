import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Header, Footer, CallLine} from '@/components/SiteChrome';
import {allGuides, getGuide, inline, strip} from '@/lib/learn';
import {site} from '@/lib/site.config';

export function generateStaticParams() {
  return allGuides().map(g => ({slug: g.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const title = g.metaTitle.includes('Chaffee Exteriors') ? {absolute: g.metaTitle} : g.metaTitle + ' | Chaffee Exteriors';
  return {title, description: g.metaDescription, alternates: {canonical: `/learn/${slug}`}, openGraph: {type: 'article', title: g.title, description: g.metaDescription}};
}

export default async function GuidePage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const others = allGuides().filter(o => o.slug !== slug).slice(0, 3);
  const minutes = Math.max(3, Math.round(g.words / 230));
  const ld = [
    {'@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.metaDescription, mainEntityOfPage: `${site.url}/learn/${slug}`,
      author: {'@type': 'Organization', name: site.name, url: site.url}, publisher: {'@type': 'Organization', name: site.name, logo: {'@type': 'ImageObject', url: `${site.url}/brand/png/chaffee-logo-stacked.png`}}, image: `${site.url}/brand/png/chaffee-og.png`},
    ...(g.faqs.length ? [{'@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: g.faqs.map(([q, a]) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: strip(a)}}))}] : []),
    {'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: site.url},
      {'@type': 'ListItem', position: 2, name: 'Guides', item: `${site.url}/learn`},
      {'@type': 'ListItem', position: 3, name: g.title, item: `${site.url}/learn/${slug}`}]},
  ];
  return <>
    <Header/>
    <main id="main">
      <section className="page-hero guide-hero"><div className="container">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <Link href="/learn">Guides</Link></nav>
        <span className="eyebrow">{g.eyebrow} · {minutes} MIN READ</span>
        <h1>{g.title}</h1>
      </div></section>
      <div className="container guide-layout">
        <article className="guide">
          <aside className="answer-box" aria-label="Quick answer">
            <span className="eyebrow">THE SHORT ANSWER</span>
            <p>{g.quickAnswer}</p>
          </aside>
          <div className="prose" dangerouslySetInnerHTML={{__html: g.html}}/>
          {g.faqs.length > 0 && <section className="guide-faq">
            <span className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</span>
            <h2>Frequently asked.</h2>
            <div className="faq-list">{g.faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p dangerouslySetInnerHTML={{__html: inline(a)}}/></details>)}</div>
          </section>}
        </article>
        <aside className="guide-rail">
          <div className="rail-card">
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <h3>{g.related.label}.</h3>
            <p>Starting prices online. Final price confirmed on site before any work begins.</p>
            <Link className="button" href={g.related.href}>See pricing <span>↗</span></Link>
            <CallLine/>
          </div>
        </aside>
      </div>
      <section className="container section guide-more">
        <span className="eyebrow">KEEP READING</span>
        <div className="guide-grid">{others.map(o => <Link key={o.slug} href={`/learn/${o.slug}`} className="guide-card"><span className="eyebrow">{o.eyebrow}</span><h3>{o.title}</h3><span className="text-link">Read the guide ↗</span></Link>)}</div>
      </section>
    </main>
    <Footer/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}}/>
  </>;
}
