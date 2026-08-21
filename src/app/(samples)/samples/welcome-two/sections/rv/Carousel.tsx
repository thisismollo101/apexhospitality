'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/**
 * Revolut's feature-items carousel, both variants of it.
 *
 * Five slots are on stage; anything beyond stages off at 0.6 scale and zero
 * opacity. Their numbers, read off the rendered transforms:
 *
 *   centre   translateX(0 × gap)  translateX(0%)     scale 1
 *   ±1       translateX(±1 × gap) translateX(±95%)   scale 0.9
 *   ±2       translateX(±2 × gap) translateX(±185%)  scale 0.9
 *   staged   translateX(±2 × gap) translateX(±185%)  scale 0.6, opacity 0
 *
 * gap is 16px, becoming 8% of card width at 840px. Transition 350ms ease.
 *
 * The one subtlety is how far a card is allowed to sit behind the centre. With
 * five cards the deck is symmetric, −2…+2. With three it is not: their page
 * renders the active card leftmost and the other two trailing off to the right,
 * because there are not enough cards to fill the left-hand slots. So the
 * backward reach is (n − 3), capped at 2 — which gives 0 for three cards and 2
 * for five, matching both decks on the page.
 *
 * Revolut clones nodes so a card crossing the deck never animates through the
 * middle. We keep one node per card and instead suppress its transition for the
 * single frame in which it wraps.
 */
type Item = { key: string; node: React.ReactNode; label: string };

function slotFor(index: number, active: number, n: number) {
  const back = Math.min(2, Math.max(0, n - 3));
  let d = (((index - active) % n) + n) % n;
  if (d > n - 1 - back) d -= n;
  return d;
}

function placement(d: number) {
  const far = Math.abs(d) > 2;
  return {
    offset: far ? Math.sign(d) * 2 : d,
    percent: far ? Math.sign(d) * 185 : d === 0 ? 0 : Math.sign(d) * (Math.abs(d) === 1 ? 95 : 185),
    scale: far ? 0.6 : d === 0 ? 1 : 0.9,
    hidden: far,
  };
}

export default function Carousel({
  items,
  ratio,
  label,
}: {
  items: Item[];
  /** Card aspect ratio: 0.7086614173228346 for the cards, 0.5625 for phones. */
  ratio: number;
  label: string;
}) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [instant, setInstant] = useState<number[]>([]);
  const prev = useRef<number[] | null>(null);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  useLayoutEffect(() => {
    const now = items.map((_, i) => slotFor(i, active, n));
    const before = prev.current;
    prev.current = now;
    if (!before) return;
    const wrapped = now.map((d, i) => (Math.abs(d - before[i]) > 1 ? i : -1)).filter((i) => i >= 0);
    if (!wrapped.length) return;
    setInstant(wrapped);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setInstant([])));
    return () => cancelAnimationFrame(id);
  }, [active, n, items]);

  return (
    <div className="car" style={{ aspectRatio: String(ratio) }} aria-roledescription="carousel" aria-label={label}>
      {items.map((it, i) => {
        const d = slotFor(i, active, n);
        const p = placement(d);
        return (
          <div
            key={it.key}
            className={[
              'caritem',
              d === 0 ? 'is-centre' : '',
              instant.includes(i) ? 'is-instant' : '',
            ].filter(Boolean).join(' ')}
            aria-hidden={p.hidden}
            style={{
              aspectRatio: String(ratio),
              transform:
                `translateX(calc(${p.offset} * var(--gap))) ` +
                `translateX(${p.percent}%) scale(${p.scale})`,
              opacity: p.hidden ? 0 : 1,
            }}
          >
            <button
              type="button"
              className="carbtn"
              tabIndex={p.hidden ? -1 : 0}
              aria-label={d === 0 ? it.label : `Show ${it.label}`}
              // One slot per click, so a card on the far edge never skips past
              // the reader on its way to the middle.
              onClick={() => d !== 0 && go(active + Math.sign(d))}
            >
              {it.node}
            </button>
          </div>
        );
      })}

      <ul className="dots" role="tablist" aria-label={label}>
        {items.map((it, i) => (
          <li key={it.key}>
            <button
              type="button"
              role="tab"
              aria-current={i === active}
              aria-label={i === active ? `Current page, page ${i + 1}` : `Page ${i + 1}`}
              onClick={() => go(i)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
