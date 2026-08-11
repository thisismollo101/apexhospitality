'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const products = (nav.header.dropdowns as NavDropdown[]).find((d) => d.id === 'products');

/**
 * One card per rainbow colour — seven. The six product categories come from the
 * nav verbatim; Plans is the seventh, and is a real top-level route rather than
 * a duplicated or invented category, so every card still goes somewhere.
 */
const categories: NavColumn[] = [
  ...((products?.columns ?? []) as NavColumn[]),
  { heading: 'Plans', href: '/plans', items: [] } as unknown as NavColumn,
];

/**
 * ROYGBIV, in v34's gradient form (160°, mid tone at 55%, dark at both ends).
 *
 * Yellow is the true hue rather than the gold it started as — at 53° it sits a
 * clear step off orange at 27°, where the previous 45° did not. A yellow that
 * reads as yellow is necessarily light, so that one card flips to dark ink;
 * `lit` carries that through to the CSS.
 */
const SKINS: { bg: string; lit?: boolean }[] = [
  { bg: 'linear-gradient(160deg,#c0392b,#e74c3c 55%,#7d2018)' }, // red
  { bg: 'linear-gradient(160deg,#c2571a,#ef8f3c 55%,#7d3410)' }, // orange
  { bg: 'linear-gradient(160deg,#e8c81a,#f5de3c 55%,#c9a400)', lit: true }, // yellow
  { bg: 'linear-gradient(160deg,#1f7a4d,#35a86c 55%,#12492e)' }, // green
  { bg: 'linear-gradient(160deg,#1f5fa8,#3d86d8 55%,#123a68)' }, // blue
  { bg: 'linear-gradient(160deg,#332f7a,#514bb0 55%,#1d1a4a)' }, // indigo
  { bg: 'linear-gradient(160deg,#6a2a86,#9d4bc4 55%,#401a52)' }, // violet
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
  const n = categories.length;
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
    const now = categories.map((_, i) => slotFor(i, active, n));
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
        {categories.map((c, i) => {
          const d = slotFor(i, active, n);
          const p = placement(d);
          const isCentre = d === 0;
          const skin = SKINS[i % SKINS.length];
          return (
            <div
              key={c.heading}
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
                  <Link
                    className={`hcardin${skin.lit ? ' is-lit' : ''}`}
                    href={c.href}
                    style={{ background: skin.bg }}
                  >
                    <span className="hcardtitle">{c.heading}</span>
                    <span className="hcardgo">Explore</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`hcardin${skin.lit ? ' is-lit' : ''}`}
                    style={{ background: skin.bg }}
                    tabIndex={p.hidden ? -1 : 0}
                    aria-label={`Show ${c.heading}`}
                    onClick={() => go(i)}
                  >
                    <span className="hcardtitle">{c.heading}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ul className="px-dots" role="tablist" aria-label="Categories">
        {categories.map((c, i) => (
          <li key={c.heading}>
            <button
              type="button"
              role="tab"
              aria-current={i === active}
              aria-label={c.heading}
              onClick={() => go(i)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
