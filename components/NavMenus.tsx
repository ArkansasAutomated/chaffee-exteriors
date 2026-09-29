'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useId, useRef, useState} from 'react';

const services: [string, string, string][] = [
  ['Gutter Cleaning', '/gutter-cleaning', 'From $149'],
  ['Gutter Guards', '/gutter-guards', 'Micro-mesh, from $599'],
  ['Gutter Repair', '/gutter-repair', '$129 service call'],
  ['Soft Wash', '/soft-wash', 'House & roof'],
  ['For Realtors & Property Managers', '/realtors', 'Pre-listing & turnovers'],
];

/** Close on outside click, Escape, and route change. */
function useDismiss(open: boolean, setOpen: (v: boolean) => void, root: React.RefObject<HTMLElement | null>, trigger: React.RefObject<HTMLElement | null>) {
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname, setOpen]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, setOpen, root, trigger]);
}

export function ServiceMenu({inline = false}: {inline?: boolean}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const pathname = usePathname();
  useDismiss(open, setOpen, root, trigger);
  const active = services.some(([, url]) => pathname === url);
  return (
    <div ref={root} className={'services-menu' + (inline ? ' is-inline' : '')} data-open={open || undefined}>
      <button ref={trigger} type="button" className={'services-trigger' + (active ? ' is-active' : '')} aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
        Services <svg className="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div id={id} className="services-panel" hidden={!open}>
        {services.map(([title, url, note]) => (
          <Link key={url} href={url} aria-current={pathname === url ? 'page' : undefined} onClick={() => setOpen(false)}>
            <span>{title}</span><small>{note}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useDismiss(open, setOpen, root, trigger);
  const close = () => setOpen(false);
  return (
    <div ref={root} className="mobile-menu" data-open={open || undefined}>
      <button ref={trigger} type="button" className="mobile-trigger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
        <span aria-hidden="true">{open ? '✕' : '☰'}</span>
      </button>
      <nav id={id} aria-label="Mobile navigation" hidden={!open}>
        <ServiceMenu inline/>
        <Link href="/membership" onClick={close}>Home protection</Link>
        <Link href="/learn" onClick={close}>Guides</Link>
        <Link href="/about" onClick={close}>Our story</Link>
        <Link href="/contact" onClick={close}>Contact</Link>
      </nav>
    </div>
  );
}
