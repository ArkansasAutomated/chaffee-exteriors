import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import './globals.css';
import ContactActions from '@/components/ContactActions';
import {site} from '@/lib/site.config';
export const metadata: Metadata = { metadataBase: new URL('https://chaffeeexteriors.com'), title: 'Chaffee Exteriors | Fort Smith Gutter & Exterior Care', alternates:{canonical:'/'}, description: 'Gutter cleaning, guards, repairs and soft washing in Fort Smith. Straightforward pricing. Thoughtful exterior care. Get an instant estimate.', openGraph: {title:'Chaffee Exteriors — Precision from the roofline down',description:'Local exterior care for Fort Smith and the River Valley.',type:'website'}, twitter:{card:'summary_large_image'} };
export const viewport: Viewport = { themeColor: '#172D35' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}<ContactActions/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:site.name,url:site.url,areaServed:site.SERVICE_AREAS,telephone:site.PHONE_SCHEMA,email:site.EMAIL,logo:site.url+"/brand/png/chaffee-logo-stacked.png",image:site.url+"/brand/png/chaffee-og.png",priceRange:"$$",address:{"@type":"PostalAddress",addressLocality:"Fort Smith",addressRegion:"AR",addressCountry:"US"},...(site.OPENING_HOURS.length?{openingHours:site.OPENING_HOURS}:{})})}}/></body></html> }
