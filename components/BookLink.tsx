'use client';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {site} from '@/lib/site.config';
import type {Service} from '@/lib/pricing';

const byPath: Record<string, string> = {
  '/gutter-cleaning': site.BOOKING_BY_SERVICE.cleaning,
  '/gutter-guards': site.BOOKING_BY_SERVICE.guards,
  '/gutter-repair': site.BOOKING_BY_SERVICE.repair,
  '/soft-wash': site.BOOKING_BY_SERVICE.house,
  '/holiday-lights': site.BOOKING_BY_SERVICE.lights,
  '/porch-decorating': site.BOOKING_BY_SERVICE.porch,
  '/lp/gutter-cleaning': site.BOOKING_BY_SERVICE.cleaning,
  '/lp/gutter-guards': site.BOOKING_BY_SERVICE.guards,
  '/lp/chaffee-new-home': site.BOOKING_BY_SERVICE.cleaning,
};

export function bookUrlForPath(pathname: string) {
  return byPath[pathname] || site.BOOKING_URL;
}

export function bookUrlForService(service: Service) {
  if (service === 'roof') return null;
  return site.BOOKING_BY_SERVICE[service];
}

export function BookLink({className = 'button', children}: {className?: string; children?: ReactNode}) {
  const pathname = usePathname() || '/';
  return <a className={className} href={bookUrlForPath(pathname)} target="_blank" rel="noopener noreferrer">{children ?? <>Book a visit <span>↗</span></>}</a>;
}
