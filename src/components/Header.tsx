'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const dropdowns = nav.header.dropdowns as NavDropdown[];
const auth = nav.header.auth as { label: string; href: string; style: string }[];

function Caret() {
  return (
    <svg className="car" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ColumnLinks({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul>
      {items.map((i) => (
        <li key={i.href}><Link href={i.href}>{i.label}</Link></li>
      ))}
    </ul>
  );
}

export default function Header() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accordions, setAccordions] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLElement>(null);
  const shutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const returningFocus = useRef(false);

  const closeAll = useCallback(() => setOpenId(null), []);

  const open = useCallback((id: string) => {
    if (shutTimer.current) clearTimeout(shutTimer.current);
    setOpenId(id);
  }, []);

  // Grace period for a diagonal cursor path from trigger to panel.
  const scheduleClose = useCallback(() => {
    if (shutTimer.current) clearTimeout(shutTimer.current);
    shutTimer.current = setTimeout(closeAll, 150);
  }, [closeAll]);

  const cancelClose = useCallback(() => {
    if (shutTimer.current) clearTimeout(shutTimer.current);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menuOpen) return setMenuOpen(false);
      if (!openId) return;
      const trig = trigRefs.current[openId];
      closeAll();
      // focus() would otherwise re-open the panel Escape just closed.
      returningFocus.current = true;
      trig?.focus();
      returningFocus.current = false;
    };
    const onAway = (e: Event) => {
      if (openId && navRef.current && !navRef.current.contains(e.target as Node)) closeAll();
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onAway);
    document.addEventListener('focusin', onAway);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onAway);
      document.removeEventListener('focusin', onAway);
      window.removeEventListener('resize', onResize);
    };
  }, [openId, menuOpen, closeAll]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className="sales">
        80% of travelers now watch a video before making a booking decision.
        <Link href="/library">See the trends</Link>
      </div>

      <nav id="nav" ref={navRef} aria-label="Primary" className={menuOpen ? 'menu-open' : undefined}>
        <Link className="brand" href="/" aria-label="Apex Hospitality — home">
          Apex <em>Hospitality</em>
        </Link>

        <div className="navlinks">
          {dropdowns.map((d) => (
            <button
              key={d.id}
              type="button"
              className="navtrig"
              id={`trig-${d.id}`}
              ref={(el) => { trigRefs.current[d.id] = el; }}
              aria-expanded={openId === d.id}
              aria-controls={`panel-${d.id}`}
              onMouseEnter={() => { if (matchMedia('(hover:hover)').matches) open(d.id); }}
              onFocus={() => { if (!returningFocus.current) open(d.id); }}
              onClick={(e) => { e.preventDefault(); setOpenId(openId === d.id ? null : d.id); }}
              onMouseLeave={scheduleClose}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="navcta">
          {auth.map((a) => (
            <Link
              key={a.href}
              className={a.style === 'button' ? 'btn btn-solid' : 'navlogin'}
              href={a.href}
            >
              {a.label}
            </Link>
          ))}
        </div>

        <button
          className="burger"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobsheet"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {dropdowns.map((d) => (
          <div
            key={d.id}
            className={`panel ${d.panelWidth === 'full' ? 'full' : 'content'}${openId === d.id ? ' open' : ''}`}
            id={`panel-${d.id}`}
            role="region"
            aria-labelledby={`trig-${d.id}`}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="pinner">
              {(d.columns ?? []).map((c: NavColumn) => (
                <div className="pcol" key={c.heading}>
                  <h3>{c.href ? <Link href={c.href}>{c.heading}</Link> : c.heading}</h3>
                  <ColumnLinks items={c.items} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mobsheet" id="mobsheet" hidden={!menuOpen}>
        <div className="maccs">
          {dropdowns.map((d) => (
            <div className="macc" key={d.id}>
              <button
                className="macch"
                type="button"
                aria-expanded={!!accordions[d.id]}
                aria-controls={`macc-${d.id}`}
                onClick={() => setAccordions((a) => ({ ...a, [d.id]: !a[d.id] }))}
              >
                {d.label}
                <Caret />
              </button>
              <div className={`maccb${accordions[d.id] ? ' open' : ''}`} id={`macc-${d.id}`}>
                {(d.columns ?? []).map((c: NavColumn) => (
                  <div key={c.heading}>
                    <h3>{c.heading}</h3>
                    <ColumnLinks items={c.items} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mauth">
          {auth.map((a) => (
            <Link
              key={a.href}
              className={a.style === 'button' ? 'btn btn-solid' : 'btn btn-ghost'}
              href={a.href}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
