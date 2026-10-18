'use client';

import { useEffect, useRef, useState } from 'react';
import { CARDS, RIBBON, TOP, VSL, img, type Option } from './data';

/*
 * The live Welcome hero (Top 1 · Cinematic Scrim), copied from
 * welcome/TopSections.tsx rather than imported, with two changes asked for on
 * this page alone: the VSL is a phone mockup like the Wrong Way vs APEX Way
 * phones, and the three data cards follow the APEX Way timeline rows, the
 * figure where the rows put the time.
 */

const Tick = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

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

/** A figure, its range dash drawn short with room either side (the dash stays in the text, for copying and reading aloud). */
const Fig = ({ fig }: { fig: [string] | [string, string] }) =>
  fig.length === 1 ? (
    <b>{fig[0]}</b>
  ) : (
    <b>
      {fig[0]}
      <span className="hc__dash">–</span>
      {fig[1]}
    </b>
  );

/** One option of the hero; the option's id picks its cards' gradient in style.css. */
export default function Hero({ v }: { v: Option }) {
  return (
    <div className={`top hero hero--${v.id}`}>
      <BgFilm />
      <span className="top__scrim" aria-hidden="true" />
      <div className="wrap top__in">
        <Vsl />
        <div className="top__copy">
          {/* the headline's own lines, set as blocks so the copy column is only as wide as what it holds */}
          <h2 className="top__h">
            {(v.lines ?? TOP.lines).map((l) => (
              <span key={l}>{l} </span>
            ))}
          </h2>
          <ul className="hc">
            {(v.cards ?? CARDS).map((c) => (
              <li key={c.title}>
                <span className="hc__when">
                  <Fig fig={c.fig} />
                </span>
                <span className="hc__txt">
                  <b>{c.title}</b>
                  {typeof c.text === 'string' ? (
                    c.text
                  ) : (
                    // the line set on its two given lines
                    <span className="hc__line">
                      <span>{c.text[0]} </span>
                      <span>{c.text[1]}</span>
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="ribbon ribbon--strip t1__ribbon" aria-label="Integrations">
        {RIBBON.map((r) => (
          <li key={r}>
            <Tick />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
