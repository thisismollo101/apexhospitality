'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * The seven modules, one per rainbow colour, in ROYGBIV order. Every href is an
 * existing product page — these are the real leaf routes, not categories, so a
 * card now lands the reader straight on the module it names.
 *
 * Gradients keep v34's form (160°, mid tone at 55%, dark at both ends). Yellow
 * is the true hue at 53°, a clear step off orange at 27°.
 */
const CARDS = [
  { title: 'Apex International', href: '/products/signature-films/international',
    bg: 'linear-gradient(160deg,#c0392b,#e74c3c 55%,#7d2018)' }, // red
  { title: 'Apex Weddings', href: '/products/specialized-venues/weddings',
    bg: 'linear-gradient(160deg,#c2571a,#ef8f3c 55%,#7d3410)' }, // orange
  { title: 'Apex Welcome', href: '/products/vip-guest-services/welcome',
    bg: 'linear-gradient(160deg,#e8c81a,#f5de3c 55%,#c9a400)' }, // yellow
  { title: 'Apex Dining', href: '/products/billboards/dining',
    bg: 'linear-gradient(160deg,#1f7a4d,#35a86c 55%,#12492e)' }, // green
  { title: 'Apex Accommodation', href: '/products/billboards/accommodation',
    bg: 'linear-gradient(160deg,#1f5fa8,#3d86d8 55%,#123a68)' }, // blue
  { title: 'Apex Flagship', href: '/products/signature-films/flagship',
    bg: 'linear-gradient(160deg,#332f7a,#514bb0 55%,#1d1a4a)' }, // indigo
  { title: 'Apex Corporate', href: '/products/specialized-venues/corporate-events',
    bg: 'linear-gradient(160deg,#6a2a86,#9d4bc4 55%,#401a52)' }, // violet
];

/**
 * Category carousel — geometry ported from Revolut's feature-items carousel.
 *
 * Five slots are visible at once and the rest stage off-screen, so with seven
 * cards two are always waiting to come around. Their exact numbers:
 *
 *   centre   translateX(0 × gap)  translateX(0%)              scale 1
 *   ±1       translateX(±1 × gap) translateX(±95%)            scale 0.9
 *   ±2       translateX(±2 × gap) translateX(±185%)           scale 0.9
 *   staging  translateX(±2 × gap) translateX(±185%)  scale 0.6, opacity 0
 *
 * gap is 16px, becoming 8% of card width at ≥840px. Transition is
 * transform/opacity 350ms ease. Card ratio 720/1016 — their phone ratio.
 *
 * Revolut renders duplicate nodes so a card crossing from the far left to the
 * far right never animates through the middle. We keep one node per category
 * and suppress its transition for the frame in which it wraps, which gets the
 * same result without cloning content.
 *
 * The scroll reveal lives on an inner element rather than this one. Carousel
 * placement is transitioned over 350ms; the reveal is driven per rAF frame from
 * HeroReveal, and sharing a transitioned transform would make it lag the
 * scroll by a third of a second.
 */
const RATIO = 0.7086614173228346;

function slotFor(index: number, active: number, n: number) {
  const half = Math.floor(n / 2);
  let d = ((index - active) % n + n) % n;
  if (d > half) d -= n;
  return d;
}

function placement(d: number) {
  const far = Math.abs(d) > 2;
  const step = Math.sign(d) * (Math.abs(d) === 1 ? 95 : 185);
  const clamped = Math.max(-2, Math.min(2, d));
  return {
    offset: far ? Math.sign(d) * 2 : clamped,
    percent: far ? Math.sign(d) * 185 : d === 0 ? 0 : step,
    scale: far ? 0.6 : d === 0 ? 1 : 0.9,
    hidden: far,
  };
}

export default function CategoryCarousel() {
  const n = CARDS.length;
  const [active, setActive] = useState(0);
  const [instant, setInstant] = useState<number[]>([]);
  const [stepping, setStepping] = useState(false);
  const prev = useRef<number[] | null>(null);
  const first = useRef(true);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  // Marks the placement transition as in flight so the Explore pill does not
  // flicker on a card that is only passing under the cursor. 350ms is the
  // transition; the extra 30ms covers the frame it is scheduled on.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStepping(true);
    const t = setTimeout(() => setStepping(false), 380);
    return () => clearTimeout(t);
  }, [active]);

  // A card that wraps jumps several slots at once. Animating that would drag it
  // across the middle of the carousel, so its transition is dropped for one
  // frame and restored immediately after.
  useLayoutEffect(() => {
    const now = CARDS.map((_, i) => slotFor(i, active, n));
    const before = prev.current;
    prev.current = now;
    if (!before) return;
    const wrapped = now
      .map((d, i) => (Math.abs(d - before[i]) > 1 ? i : -1))
      .filter((i) => i >= 0);
    if (!wrapped.length) return;
    setInstant(wrapped);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setInstant([])));
    return () => cancelAnimationFrame(id);
  }, [active, n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(active + 1);
      if (e.key === 'ArrowLeft') go(active - 1);
    };
    const el = document.getElementById('catcar');
    el?.addEventListener('keydown', onKey as EventListener);
    return () => el?.removeEventListener('keydown', onKey as EventListener);
  }, [active, go]);

  return (
    <div className="hcar" id="catcar">
      <div
        className={`hcarstage${stepping ? ' is-stepping' : ''}`}
        style={{ aspectRatio: String(RATIO) }}
      >
        {CARDS.map((c, i) => {
          const d = slotFor(i, active, n);
          const p = placement(d);
          const isCentre = d === 0;
          // Every title is "Apex <module>", broken after Apex so all seven sit
          // on two lines rather than the short ones riding up onto one.
          const [word, ...rest] = c.title.split(' ');
          const label = (
            <span className="hcardtitle">
              <span className="hcardword">{word}</span>
              <br />
              {rest.join(' ')}
            </span>
          );
          return (
            <div
              key={c.title}
              className={`hcard${p.hidden ? ' is-off' : ''}${instant.includes(i) ? ' is-instant' : ''}`}
              aria-hidden={p.hidden}
              style={{
                transform:
                  `translateX(calc(${p.offset} * var(--hcar-gap))) ` +
                  `translateX(${p.percent}%) scale(${p.scale})`,
                opacity: p.hidden ? 0 : 1,
                zIndex: isCentre ? 2 : 1,
              }}
            >
              <div
                className="hcardrise"
                style={{ ['--t' as string]: `var(--ring-${Math.min(Math.abs(d), 2)}, 1)` } as React.CSSProperties}
              >
                {isCentre ? (
                  <Link className="hcardin" href={c.href} style={{ background: c.bg }}>
                    {label}
                    <span className="hcardgo">Explore</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="hcardin"
                    style={{ background: c.bg }}
                    tabIndex={p.hidden ? -1 : 0}
                    aria-label={
                      Math.abs(d) === 1
                        ? `Show ${c.title}`
                        : d > 0
                          ? 'Next module'
                          : 'Previous module'
                    }
                    /* One slot per click. Sending the outer card straight to the
                       centre skipped a card past the reader without them ever
                       seeing it move through the middle. */
                    onClick={() => go(active + Math.sign(d))}
                  >
                    {label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ul className="px-dots" role="tablist" aria-label="Modules">
        {CARDS.map((c, i) => (
          <li key={c.title}>
            <button
              type="button"
              role="tab"
              aria-current={i === active}
              aria-label={c.title}
              onClick={() => go(i)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
