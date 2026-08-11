'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import CategoryCarousel from '@/components/home/CategoryCarousel';


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
 *   ring-0   s(0.10,0.38)      centre card rises
 *   ring-1   s(0.18,0.48)      its neighbours follow
 *   ring-2   s(0.26,0.60)      the outer pair last
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
    const bars = salesH + navH;

    // Centre copy and deck together in the space the fixed bars leave, rather
    // than pinning the heading just under them. Falls back to the old 18px
    // offset when the pair is taller than the space, so nothing is ever pushed
    // up behind the nav.
    const gap = Math.max(24, window.innerHeight * 0.045);
    const block = c.offsetHeight + gap + d.offsetHeight;
    const top = bars + Math.max(18, (window.innerHeight - bars - block) / 2);
    c.style.top = `${top}px`;
    d.style.top = `${top + c.offsetHeight + gap}px`;
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

      // The cards arrive in rings rather than as one block: centre first, then
      // its neighbours, then the outer pair. The windows overlap and run to
      // 0.60, so the deck is still assembling while the sheet is still rising
      // instead of being fully in by 0.24 and waiting on an empty screen.
      if (deck.current) {
        const ds = deck.current.style;
        ds.setProperty('--ring-0', smooth(0.10, 0.38, v).toFixed(4));
        ds.setProperty('--ring-1', smooth(0.18, 0.48, v).toFixed(4));
        ds.setProperty('--ring-2', smooth(0.26, 0.60, v).toFixed(4));
        ds.opacity = '1';
        ds.pointerEvents = smooth(0.10, 0.38, v) > 0.6 ? 'auto' : 'none';
      }

      // Section snapping is enabled only after the reveal has finished
      // scrubbing. Turning it on earlier would let the browser snap away from
      // the middle of the 220vh travel, which is the failure v34's stylesheet
      // warns about. The two thresholds are deliberately apart so scrolling
      // across the boundary cannot flip the class on and off repeatedly.
      const root = document.documentElement;
      if (v >= 0.995) root.classList.add('snap-on');
      else if (v <= 0.9) root.classList.remove('snap-on');

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
      document.documentElement.classList.remove('snap-on');
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
          {/* TODO(copy): the first half of this heading was cut off in the
              brief — only "& Stop Revenue Leakage." came through. The opening
              clause below is a stand-in; swap it for the real one. */}
          <h2>Convert Attention Into Bookings &amp; Stop Revenue Leakage.</h2>
          <p>
            Seven visual conversion modules engineered specifically for luxury
            hospitality. From high yield suite sales to automated pre-arrival
            upsells!
          </p>
        </div>

        <div className="deck" ref={deck}>
          <CategoryCarousel />
        </div>

        <div className="hint" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
