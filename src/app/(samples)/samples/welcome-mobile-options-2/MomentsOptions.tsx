'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { MOMENTS, MOMENTS_HEAD, img } from './data';
import { Option, Sources } from './parts';

/*
 * D · Four Moments. Bento Expanders is kept from round 1 (the only one that
 * expands); the highlight reel is new.
 */

const B = 'D · FOUR MOMENTS';

function Head({ light = false }: { light?: boolean }) {
  return (
    <div className={`bhead${light ? ' bhead--light' : ''}`}>
      <span className="eye">{MOMENTS_HEAD.eye}</span>
      <h2>{MOMENTS_HEAD.headline}</h2>
    </div>
  );
}

/* ---- 1 · Bento expanders (kept from round 1) ------------------------------------ */
function Bento() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Option block={B} n={1} name="Bento expanders (kept)" note="Round 1's favourite, unchanged: a 2×2 grid of photo tiles showing only the timing. Tap one and it expands to full width with its copy.">
      <div className="c3">
        <Head light />
        <ul className="c3__grid">
          {MOMENTS.map((m, n) => (
            <li key={m.kick} className={open === n ? 'is-open' : ''}>
              <button type="button" aria-expanded={open === n} onClick={() => setOpen(open === n ? null : n)}>
                <img src={img(m.img)} alt="" />
                <span className="c3__fig">
                  {m.fig}
                  <small>{m.figSub}</small>
                </span>
                <span className="c3__ex" aria-hidden="true">
                  {open === n ? '−' : '+'}
                </span>
              </button>
              <div className="c3__body">
                <span className="kick">{m.kick}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Option>
  );
}

/* ---- 2 · Highlight reel (new) ----------------------------------------------------
   Welcome Page Two's Latest-posts reel, in the live "What Guests Expect" style:
   the four films as 9:16 cards drifting sideways on their own. Cards are larger
   than that sample's (190px against 160px on mobile) and the drift is 20% slower
   (about 20 px/s against its 25). One observer plays the strip on screen and
   parks it off screen; reduced motion leaves it still and swipeable. */
const CARD = 190;
const GAP = 14;
// Welcome Page Two on mobile: 7 cards × (160 + 14) px in 47.8 s ≈ 25.5 px/s. 20% slower ≈ 20.4 px/s.
const SPEED = ((7 * (160 + 14)) / 47.8) * 0.8;
const DURATION = (MOMENTS.length * (CARD + GAP)) / SPEED;

function HighlightReel() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const vids = Array.from(r.querySelectorAll('video'));
    vids.forEach((v) => {
      v.muted = true;
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        r.classList.toggle('is-live', e.isIntersecting);
        vids.forEach((v) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
      },
      { threshold: 0.15 },
    );
    io.observe(r);
    return () => io.disconnect();
  }, []);
  // The set four times: two halves of two sets each, so one half is wider than a phone and the -50% wrap never shows a gap.
  const reel = [...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS];
  return (
    <Option block={B} n={2} name="Highlight reel" note="New: the four films as 9:16 cards drifting sideways on their own, like Welcome Page Two's reel in the live 'What Guests Expect' style. Bigger cards, 20% slower drift; touch to hold.">
      <div className="hd2">
        <Head />
        <div className="hd2__mq" ref={root}>
          <div className="hd2__track" style={{ animationDuration: `${(DURATION * 2).toFixed(1)}s` }}>
            {reel.map((m, n) => (
              <div key={n} className="hd2__card" aria-hidden={n >= MOMENTS.length || undefined} style={{ flexBasis: CARD, marginRight: GAP }}>
                <video poster={img(m.poster)} muted loop playsInline preload="metadata">
                  <Sources name={m.clip} />
                </video>
                <span className="hd2__when">
                  {m.fig}
                  <small>{m.figSub}</small>
                </span>
                <span className="hd2__title">{m.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Option>
  );
}

export default function MomentsOptions() {
  return (
    <>
      <Bento />
      <HighlightReel />
    </>
  );
}
