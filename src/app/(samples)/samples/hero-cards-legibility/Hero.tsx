'use client';

import { useEffect, useRef, useState } from 'react';
import { CARDS, TOP, VSL, img, type Card, type Option } from './data';
import WorksAlongside from './WorksAlongside';

/*
 * The live Welcome hero (Gradient 1 · Cobalt Sweep, with the Works alongside
 * bar at its foot), copied rather than imported: the film, the phone VSL and
 * the headline as live. Only the three cards' boxes change, per option.
 */

/**
 * Plays a muted loop while it is on screen and pauses it off; muted is set as
 * a property, since React does not reliably emit the attribute, and reduced
 * motion leaves the poster up.
 */
function useLoop(threshold: number) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold });
    io.observe(v);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

function BgFilm() {
  const ref = useLoop(0.1);
  return (
    <video ref={ref} className="bgfilm" poster={img(TOP.poster)} muted loop playsInline preload="metadata" aria-hidden="true">
      <source src={img(TOP.film)} type="video/mp4" />
    </video>
  );
}

/**
 * The VSL as a phone (thin bezel, notch), the film on a muted loop on its
 * screen, a play button centred on it and the label under the button. There
 * is no cut of the briefing yet, so play starts this film from the top with
 * its sound, and pressing again returns it to the silent loop.
 */
function Vsl() {
  const ref = useLoop(0.2);
  const [sound, setSound] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.muted) {
      v.currentTime = 0;
      v.muted = false;
    } else v.muted = true;
    setSound(!v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <div className="vsl top__vsl">
      <div className="vsl__screen">
        <video ref={ref} className="vsl__film" poster={img(VSL.poster)} muted loop playsInline preload="metadata">
          <source src={img(VSL.clipHevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
          <source src={img(VSL.clipWebm)} type="video/webm" />
          <source src={img(VSL.clip)} type="video/mp4" />
        </video>
        <button type="button" className="vsl__play" onClick={toggle} aria-pressed={sound}>
          <span className="play" aria-hidden="true">
            {sound ? (
              <svg viewBox="0 0 24 24">
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M7 4.5l13 7.5-13 7.5z" />
              </svg>
            )}
          </span>
          <span className="vsl__cta">{VSL.cta}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The line with its key phrase kept on one line, so a range never breaks, and
 * set in bold unless `plain` (the words themselves untouched).
 */
function Line({ c, plain = false }: { c: Card; plain?: boolean }) {
  const i = c.text.indexOf(c.key);
  const key = plain ? <span className="nb">{c.key}</span> : <strong className="nb">{c.key}</strong>;
  return (
    <>
      {c.text.slice(0, i)}
      {key}
      {c.text.slice(i + c.key.length)}
    </>
  );
}

/** Option 1 · Ticker: title static above, figure anchored left, the line running right to left. */
const Ticker = ({ c }: { c: Card }) => (
  <div className="cl tk">
    <b className="cl__fig">{c.fig}</b>
    <span className="tk__body">
      <span className="cl__title">{c.title}</span>
      <span className="tk__run">
        <span className="tk__track">
          <span className="tk__copy">{c.text}</span>
          <span className="tk__copy tk__dup" aria-hidden="true">
            {c.text}
          </span>
        </span>
      </span>
    </span>
  </div>
);

/** Option 2 · Statement: big figure left, the line as a large statement with its key phrase in bold. */
const Statement = ({ c }: { c: Card }) => (
  <div className="cl st">
    <b className="cl__fig">{c.fig}</b>
    <span className="st__body">
      <span className="cl__title">{c.title}</span>
      <span className="st__line">
        <Line c={c} />
      </span>
    </span>
  </div>
);

/** Option 3 · Poster: very large figure with the title beside it, the line large across the card underneath. */
const Poster = ({ c }: { c: Card }) => (
  <div className="cl ps">
    <span className="ps__top">
      <b className="cl__fig">{c.fig}</b>
      <span className="cl__title">{c.title}</span>
    </span>
    <span className="ps__line">
      <Line c={c} plain />
    </span>
  </div>
);

const CARD = { o1: Ticker, o2: Statement, o3: Poster };

/** One option of the hero: the live hero, with the cards drawn by the option's card. */
export default function Hero({ v }: { v: Option }) {
  const C = CARD[v.id];
  return (
    <div className={`top hero hero--g1 hero--${v.id}`}>
      <BgFilm />
      <span className="top__scrim" aria-hidden="true" />
      <div className="wrap top__in">
        <Vsl />
        <div className="top__copy">
          <h2 className="top__h">
            {TOP.lines.map((l) => (
              <span key={l}>{l} </span>
            ))}
          </h2>
          <ul className="hc">
            {CARDS.map((c) => (
              <li key={c.title}>
                <C c={c} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <WorksAlongside />
    </div>
  );
}
