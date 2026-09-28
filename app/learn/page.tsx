import type {Metadata} from 'next';
import Link from 'next/link';
import {Header, Footer} from '@/components/SiteChrome';
import {allGuides} from '@/lib/learn';

export const metadata: Metadata = {
  title: 'Home Exterior Guides for Fort Smith | Chaffee Exteriors',
  description: 'Straight answers on gutters, guards, soft washing, clay soil and foundations, written for Fort Smith and River Valley homeowners and sellers.',
  alternates: {canonical: '/learn'},
};

export default function Learn() {
  const guides = allGuides();
  const [lead, ...rest] = guides;
  return <>
    <Header/>
    <main id="main">
      <section className="page-hero"><div className="container">
        <span className="eyebrow">GUIDES / FORT SMITH & THE RIVER VALLEY</span>
        <h1>Straight answers.<br/><em className="accent">Before you spend a dime.</em></h1>
        <p>How rain, clay soil and gutters actually interact here, what to ask before you buy, and what things should cost. Written by a local crew, for local homes.</p>
      </div></section>
      <section className="container section">
        {lead && <Link href={`/learn/${lead.slug}`} className="guide-lead">
          <div><span className="eyebrow">{lead.eyebrow}</span><h2>{lead.title}</h2><p>{lead.quickAnswer}</p><span className="text-link">Read the guide ↗</span></div>
        </Link>}
        <div className="guide-grid">{rest.map(g => <Link key={g.slug} href={`/learn/${g.slug}`} className="guide-card"><span className="eyebrow">{g.eyebrow}</span><h3>{g.title}</h3><p>{g.quickAnswer.slice(0, 150).replace(/\s\S*$/, '')}…</p><span className="text-link">Read the guide ↗</span></Link>)}</div>
      </section>
    </main>
    <Footer/>
  </>;
}
