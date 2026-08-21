'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Feature } from './data';

/**
 * Section 4 — the four product cards, each of which expands in place.
 *
 * The panel is a fixed layer that starts life exactly over the card and grows
 * out of it, so the card appears to expand rather than to be replaced by a
 * modal that happens to be somewhere else on screen.
 *
 * The reference animated only top and height, holding the card's left and width
 * for the whole move. That works there because its card is a full-width banner
 * — the panel was already 1266px across and the dialog inside it had room. Ours
 * is a four-up grid, so a card is about 280px wide and holding that width puts
 * the dialog in a column too narrow to read: the lede wraps to one word a line.
 * So width and left are animated too, out to a centred readable measure. The
 * growing-from-the-card read survives; the unreadable column does not.
 *
 * Two departures from the reference implementation:
 *
 *  - It cloned the card's face into the panel with cloneNode. Here the face is
 *    one component rendered twice, which is the same picture without a second
 *    copy of the DOM that React does not know about.
 *  - The layer is position:fixed, and fixed positioning is relative to the
 *    nearest transformed ancestor rather than the viewport. Section 4 sits
 *    below a section that transforms, so the layer is portalled to <body> to
 *    put it out of reach of anything that could capture it.
 */

/** Gap left above and below the opened panel, in px. Matches the reference. */
const PANEL_INSET = 36;
/** Widest the opened panel gets. Roughly .pwrap, so it sits in the page's measure. */
const PANEL_MAX_W = 1100;

/** Where an opened panel sits: centred, inset, and never wider than the viewport. */
function openGeometry() {
  const width = Math.min(PANEL_MAX_W, window.innerWidth - PANEL_INSET * 2);
  return {
    left: Math.round((window.innerWidth - width) / 2),
    width,
    top: PANEL_INSET,
    height: window.innerHeight - PANEL_INSET * 2,
    radius: 16,
  };
}
/** Geometry transition, in ms. Kept in step with --w2exp-geo in style.css. */
const DUR_GEO = 260;
/** The panel is gone before this elapses; it only gates focus going home. */
const DUR_CLOSE = 280;

type Geo = { left: number; width: number; top: number; height: number; radius: number };

function Arrow() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M.5 5.5h7" />
      <path d="M4.5 1.5l4 4-4 4" />
    </svg>
  );
}

/** The resting card, and the same picture inside the panel while it opens. */
function CardFace({ feature }: { feature: Feature }) {
  return (
    <span className="w2feat-face">
      <span className="w2feat-media">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder kit, sized by CSS; next/image would re-crop it */}
        <img src={feature.image} alt="" loading="lazy" />
      </span>
      <span className="w2feat-body">
        <span className="w2feat-tier">{feature.tier}</span>
        <span className="w2feat-title">{feature.label}</span>
        <span className="w2feat-cta">Explore</span>
      </span>
      <span className="w2feat-entry" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.6 2.5h3.9v3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
          <path d="M6.4 13.5H2.5V9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
        </svg>
      </span>
    </span>
  );
}

export default function FeatureCards({ features }: { features: Feature[] }) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** Latched across an open or close so a double click cannot interleave them. */
  const busy = useRef(false);
  /** Which card to hand focus back to once the panel has actually unmounted. */
  const returnFocusTo = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [geo, setGeo] = useState<Geo>({ left: 0, width: 0, top: 0, height: 0, radius: 12 });

  useEffect(() => setMounted(true), []);

  /* ---- the staggered lift on scroll ------------------------------------- */
  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLButtonElement => c !== null);
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // Stagger across a row, not across the whole grid: at the 2- and
          // 1-column breakpoints the row is still four apart in source order.
          el.style.transitionDelay = `${(cards.indexOf(entry.target as HTMLButtonElement) % 4) * 90}ms`;
          el.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [features]);

  /* ---- open -------------------------------------------------------------- */
  const openCard = useCallback(
    (i: number) => {
      if (busy.current || openIdx !== null) return;
      const card = cardRefs.current[i];
      if (!card) return;
      busy.current = true;
      const r = card.getBoundingClientRect();
      // Mount the layer exactly over the card. It grows on the next frame.
      setGeo({ left: r.left, width: r.width, top: r.top, height: r.height, radius: 12 });
      setOpenIdx(i);
    },
    [openIdx],
  );

  /* Scroll lock plus the frame-after-mount that starts the geometry moving.
     Both belong to the same lifetime, so they unwind together. */
  useEffect(() => {
    if (openIdx === null) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Padding stands in for the scrollbar the lock removes, or the page shifts.
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.paddingRight = `${gutter}px`;
    document.body.classList.add('w2exp-locked');

    let outer = 0;
    let inner = 0;
    // Two frames: one for the layer to exist at the card's size, one for the
    // change to be a transition rather than the value it mounted with.
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setExpanded(true);
        setGeo(openGeometry());
      });
    });

    const settle = window.setTimeout(
      () => {
        busy.current = false;
        closeRef.current?.focus();
      },
      reduced ? 0 : DUR_GEO + 40,
    );

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(settle);
      document.body.classList.remove('w2exp-locked');
      document.body.style.paddingRight = previousPadding;
    };
  }, [openIdx]);

  /* ---- close ------------------------------------------------------------- */
  const closeCard = useCallback(() => {
    if (busy.current || openIdx === null) return;
    busy.current = true;
    const card = cardRefs.current[openIdx];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setExpanded(false);
    if (card) {
      const r = card.getBoundingClientRect();
      setGeo({ left: r.left, width: r.width, top: r.top, height: r.height, radius: 12 });
    }

    window.setTimeout(
      () => {
        // Not card.focus() here: the card is still visibility:hidden until the
        // aria-expanded flip has been committed, and focusing a hidden element
        // is a no-op that drops focus to <body>. Hand it off to the effect
        // below, which runs after that commit.
        returnFocusTo.current = openIdx;
        setOpenIdx(null);
        busy.current = false;
      },
      reduced ? 0 : DUR_CLOSE,
    );
  }, [openIdx]);

  useEffect(() => {
    if (openIdx !== null) return;
    const i = returnFocusTo.current;
    if (i === null) return;
    returnFocusTo.current = null;
    cardRefs.current[i]?.focus();
  }, [openIdx]);

  /* ---- keyboard and resize while open ------------------------------------ */
  useEffect(() => {
    if (openIdx === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCard();
        return;
      }
      if (e.key !== 'Tab') return;

      // aria-modal promises the rest of the page is unreachable; nothing
      // enforces that on its own, so the cycle is closed by hand.
      const root = panelRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onResize = () => {
      if (busy.current) return;
      setGeo(openGeometry());
    };

    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [openIdx, closeCard]);

  const open = openIdx === null ? null : features[openIdx];
  const others = openIdx === null ? [] : features.filter((_, i) => i !== openIdx);

  return (
    <>
      <div className="w2feat-grid">
        {features.map((f, i) => (
          <button
            key={f.href}
            type="button"
            className="w2feat-card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            aria-haspopup="dialog"
            aria-expanded={openIdx === i}
            onClick={() => openCard(i)}
          >
            <CardFace feature={f} />
          </button>
        ))}
      </div>

      {mounted && open
        ? createPortal(
            <>
              <div
                className={`w2exp-scrim${expanded ? ' is-on' : ''}`}
                onMouseDown={closeCard}
                aria-hidden="true"
              />

              <div
                className={`w2exp-morph${expanded ? ' is-open' : ''}`}
                style={{
                  left: geo.left,
                  width: geo.width,
                  top: geo.top,
                  height: geo.height,
                  borderRadius: geo.radius,
                }}
              >
                {/* The card's own face, held until the panel has finished growing. */}
                <div className="w2exp-face" aria-hidden="true">
                  <CardFace feature={open} />
                </div>

                <div className="w2exp-body">
                  <button type="button" className="w2exp-close" ref={closeRef} onClick={closeCard} aria-label="Close">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M1.5 1.5l12 12M13.5 1.5l-12 12" />
                    </svg>
                  </button>

                  <div
                    className="w2exp-dlg"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="w2exp-title"
                    ref={panelRef}
                  >
                    <div className="w2exp-head">
                      <div>
                        <p className="w2exp-tier">{open.tier}</p>
                        <h2 id="w2exp-title">{open.label}</h2>
                        <p className="w2exp-lede">{open.concept}</p>
                        <div className="w2exp-btns">
                          {/* Plain anchors: /products sits under the other root
                              layout, and a client push would keep this
                              stylesheet alive underneath it. */}
                          <a className="btn btn-solid" href={open.href}>
                            Explore {open.label} <Arrow />
                          </a>
                          <a className="btn btn-ghost" href="/contact-sales">
                            Contact sales
                          </a>
                        </div>
                      </div>

                      <figure className="w2exp-gfx">
                        {/* eslint-disable-next-line @next/next/no-img-element -- as the card face */}
                        <img src={open.image} alt="" />
                      </figure>
                    </div>

                    <div className="w2exp-math">
                      <h3>Why it pays</h3>
                      <p>{open.math}</p>
                    </div>

                    <hr className="w2exp-rule" />

                    <h3 className="w2exp-sect">More to discover</h3>
                    <div className="w2exp-more">
                      {others.map((o) => (
                        <div className="w2exp-mcard" key={o.href}>
                          <div className="w2exp-mpic">
                            {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
                            <img src={o.image} alt="" loading="lazy" />
                          </div>
                          <p>{o.quote}</p>
                          <a className="w2exp-mlink" href={o.href}>
                            {o.label} <Arrow />
                          </a>
                        </div>
                      ))}
                    </div>

                    <hr className="w2exp-rule" />

                    <blockquote className="w2exp-quote">{open.quote}</blockquote>

                    <div className="w2exp-final">
                      <h3>Put {open.label} in front of your owner</h3>
                      <div className="w2exp-btns">
                        <a className="btn btn-solid" href="/contact-sales">
                          Start now <Arrow />
                        </a>
                        <a className="btn btn-ghost" href={open.href}>
                          Read the full brief
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
