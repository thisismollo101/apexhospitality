'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const products = (nav.header.dropdowns as NavDropdown[]).find((d) => d.id === 'products');
const categories = (products?.columns ?? []) as NavColumn[];

/** v34's own card gradients, from the CARDS array in script 1. */
const SKINS = [
  'linear-gradient(160deg,#8a6b52,#c8a07a 55%,#5c4634)',
  'linear-gradient(160deg,#4b86c7,#2f6bb0 60%,#1f4f8c)',
  'linear-gradient(160deg,#233a2a,#3f6b49 55%,#16241a)',
  'linear-gradient(160deg,#3a2f57,#6d5aa3 55%,#241d38)',
  'linear-gradient(160deg,#57323a,#a35a6d 55%,#381d24)',
  'linear-gradient(160deg,#2f4a57,#5a92a3 55%,#1d2f38)',
];

/**
 * Category carousel — geometry ported from Revolut's feature-items carousel.
 *
 * Five slots are visible at once and the rest stage off-screen, so with six
 * categories one is always waiting to come around. Their exact numbers:
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
  const prev = useRef<number[] | null>(null);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

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
      <div className="hcarstage" style={{ aspectRatio: String(RATIO) }}>
        {categories.map((c, i) => {
          const d = slotFor(i, active, n);
          const p = placement(d);
          const isCentre = d === 0;
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
                  <Link className="hcardin" href={c.href} style={{ background: SKINS[i % SKINS.length] }}>
                    <span className="hcardtitle">{c.heading}</span>
                    <span className="hcardgo">Explore →</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="hcardin"
                    style={{ background: SKINS[i % SKINS.length] }}
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
