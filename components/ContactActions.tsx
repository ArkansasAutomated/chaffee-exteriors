'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {bookUrlForPath} from '@/components/BookLink';
import {site} from '@/lib/site.config';
export default function ContactActions(){
 const pathname=usePathname();
 useEffect(()=>{
  const track=(event:MouseEvent)=>{const a=event.target instanceof Element?event.target.closest('a'):null;const href=a?.getAttribute('href');const name=href?.startsWith('tel:')?'call_click':href?.startsWith('mailto:')?'email_click':null;if(!name)return;
   const detail={event:name,link_url:href,page_url:location.href};
   const win=window as typeof window&{dataLayer?:unknown[]};(win.dataLayer??=[]).push(detail);window.dispatchEvent(new CustomEvent(name,{detail}));
  };document.addEventListener('click',track);return()=>document.removeEventListener('click',track);
 },[pathname]);
 return <div className="mobile-bar" aria-label="Quick contact"><a href={site.PHONE_HREF}>Call</a><a href={bookUrlForPath(pathname || '/')} target="_blank" rel="noopener noreferrer">Book</a></div>;
}
