import type {MetadataRoute} from 'next';
import {site} from '@/lib/site.config';
import {pages} from '@/content/pages';
export default function sitemap():MetadataRoute.Sitemap{return ['',...Object.keys(pages).filter(s=>site.LICENSED||s!=='gutter-installation')].map(slug=>({url:site.url+(slug?'/'+slug:''),changeFrequency:'monthly',priority:slug?0.7:1}))}
