'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const products = (nav.header.dropdowns as NavDropdown[]).find((d) => d.id === 'products');
const categories = (products?.columns ?? []) as NavColumn[];

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const map = (x: number, a: number, b: number) => clamp((x - a) / (b - a));
const smooth = (a: number, b: number, x: number) => {
  const t = map(x, a, b);
  return t * t * (3 - 2 * t);
};

/**
 * The scroll-driven hero reveal, ported from v34 script 1.
 *
 * `.scroller` is 320vh with `.stage` sticky at 100vh inside it, so there is
 * 220vh of travel. Progress is the scroller's own displacement, eased per frame,
 * and every frame writes six custom properties that the extracted v34 CSS
 * already consumes — the maths lives here, none of the styling does.
 *
 *   --sky    p^0.92            backdrop lifts and scales
 *   --hero   1 - s(0.00,0.30)  headline fades out
 *   --sheet  s(0.28,0.86)      the white panel rises: this is the reveal
 *   --txt    s(0.50,0.96)      section copy fades in
 *   --dot    s(0.62,1.00)      dots fade in
 *   deck     s(0.05,0.24)      the six cards fade up
 */
export default function HeroReveal() {
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  const target = useRef(0);
  const p = useRef(0);
  const raf = useRef<number | null>(null);

  // v34 sets the section copy below the fixed bars by hand, because the stage is
  // full-viewport and cannot rely on flow. The deck then hangs off its bottom.
  const measure = useCallback(() => {
    const c = copy.current;
    const d = deck.current;
    if (!c || !d) return;
    const root = getComputedStyle(document.documentElement);
    const navH = parseFloat(root.getPropertyValue('--nav-h')) || 72;
    const salesH = parseFloat(root.getPropertyValue('--sales-h')) || 54;
    const top = salesH + navH + 18;
    c.style.top = `${top}px`;
    d.style.top = `${top + c.offsetHeight + Math.max(24, window.innerHeight * 0.045)}px`;
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const readTarget = () => {
      const el = scroller.current;
      const st = stage.current;
      if (!el || !st) return;
      const travel = el.offsetHeight - st.offsetHeight;
      target.current = travel > 0 ? clamp(-el.getBoundingClientRect().top / travel) : 0;
    };

    const frame = () => {
      const st = stage.current;
      if (!st) return;
      const k = reduce ? 1 : 0.12;
      p.current += (target.current - p.current) * k;
      if (Math.abs(target.current - p.current) < 0.0006) p.current = target.current;
      const v = p.current;

      const sky = reduce ? target.current * 0.4 : Math.pow(v, 0.92);
      const s = st.style;
      s.setProperty('--sky', sky.toFixed(4));
      s.setProperty('--sheet', smooth(0.28, 0.86, v).toFixed(4));
      s.setProperty('--hero', (1 - smooth(0.0, 0.3, v)).toFixed(4));
      s.setProperty('--txt', smooth(0.5, 0.96, v).toFixed(4));
      s.setProperty('--dot', smooth(0.62, 1.0, v).toFixed(4));
      document.documentElement.style.setProperty('--navbg', smooth(0.01, 0.12, v).toFixed(4));

      const cards = smooth(0.05, 0.24, v);
      if (deck.current) {
        deck.current.style.opacity = cards.toFixed(4);
        deck.current.style.pointerEvents = cards > 0.6 ? 'auto' : 'none';
      }

      raf.current = Math.abs(target.current - p.current) > 0.0002
        ? requestAnimationFrame(frame)
        : null;
    };

    const kick = () => {
      readTarget();
      if (!raf.current) raf.current = requestAnimationFrame(frame);
    };
    const onResize = () => { measure(); kick(); };

    measure();
    readTarget();
    p.current = target.current;
    frame();

    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', onResize);
    return () => {
      removeEventListener('scroll', kick);
      removeEventListener('resize', onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [measure]);

  return (
    <div className="scroller" ref={scroller}>
      <div className="snapmark" aria-hidden="true" />
      <div className="stage" ref={stage}>
        <div className="sky" />

        <div className="hero-copy">
          <h1>Turn Your Property Into A Digital Booking Machine.</h1>
          <p>
            Deliver the immersive, short-form video content that modern travelers expect,
            without the logistical headaches of a traditional film crew.
          </p>
          <Link className="btn btn-solid" href="/library">View the Gallery</Link>
        </div>

        <div className="sheet" />

        <div className="salary-copy" ref={copy}>
          <h2>Six things we build, running all year.</h2>
          <p>Each one holds three. Open any of them.</p>
        </div>

        <div className="deck hdeck" ref={deck}>
          {categories.map((c, i) => (
            <Link className="fcard" key={c.heading} href={c.href}>
              <span className="fmedia" aria-hidden="true" />
              <span className="fbody">
                <span className="fkick">{String(i + 1).padStart(2, '0')}</span>
                <span className="ftitle">{c.heading}</span>
                <span className="fprods">
                  {c.items.map((it) => <span key={it.href}>{it.label}</span>)}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="hint" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
