import type {MetadataRoute} from 'next';
import {site} from '@/lib/site.config';
import {pages} from '@/content/pages';
import {allGuides} from '@/lib/learn';
export default function sitemap():MetadataRoute.Sitemap{
 const core=['',...Object.keys(pages).filter(s=>site.LICENSED||s!=='gutter-installation')].map(slug=>({url:site.url+(slug?'/'+slug:''),changeFrequency:'monthly' as const,priority:slug?0.7:1}));
 const guides=[{url:site.url+'/learn',changeFrequency:'weekly' as const,priority:0.6},...allGuides().map(g=>({url:`${site.url}/learn/${g.slug}`,changeFrequency:'monthly' as const,priority:0.6}))];
 return [...core,...guides];
}
