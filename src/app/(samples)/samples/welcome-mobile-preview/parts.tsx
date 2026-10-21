'use client';

import { useEffect, useRef, useState } from 'react';
import { img, type Film } from './data';

/** The PENDING CHECK tag on a figure that has not been verified yet. */
export const Pending = () => <span className="pend">Pending check</span>;

/**
 * The hero's background film: a muted loop while on screen, paused off it.
 * Nothing downloads until it plays (preload none), and reduced motion or
 * Save-Data leaves the poster up and never calls play().
 */
export function BgFilm({ clip, poster }: { clip: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className="bgfilm" poster={img(poster)} muted loop playsInline preload="none" aria-hidden="true">
      <source src={img(clip)} type="video/mp4" />
    </video>
  );
}

/**
 * A tap-to-play film. Until it is tapped it is only a lazy poster and a play
 * button, so the page carries no video weight; the tap swaps in the player and
 * starts it with sound.
 */
export function FilmCard({ film, className = '', label = true }: { film: Film; className?: string; label?: boolean }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (on) ref.current?.play().catch(() => {});
  }, [on]);

  return (
    <div className={`film ${className}`}>
      {on ? (
        <video key={film.clip} ref={ref} className="film__media" poster={img(film.poster)} controls playsInline preload="auto">
          {film.hevc && <source src={img(film.hevc)} type='video/mp4; codecs="hvc1"' />}
          {film.webm && <source src={img(film.webm)} type="video/webm" />}
          <source src={img(film.clip)} type="video/mp4" />
        </video>
      ) : (
        <button type="button" className="film__btn" onClick={() => setOn(true)} aria-label={`Play: ${film.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- poster sized by CSS, lazy */}
          <img className="film__media" src={img(film.poster)} alt="" loading="lazy" decoding="async" />
          <span className="film__play" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 4.5l13 7.5-13 7.5z" />
            </svg>
          </span>
          {label && (
            <span className="film__cap">
              <span className="film__title">{film.title}</span>
              {film.len && <span className="film__len">{film.len}</span>}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * The hero's data boxes. The server HTML holds the real figures; once the row
 * is on screen each one counts up from zero to its figure, once. Reduced motion
 * leaves the figures as they are.
 */
export function Ticker({ boxes }: { boxes: { to: number; suffix: string; pending: boolean }[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [vals, setVals] = useState(() => boxes.map((b) => b.to));

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1100);
        const e = 1 - Math.pow(1 - k, 3);
        setVals(boxes.map((b) => Math.round(b.to * e)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [boxes]);

  return (
    <ul ref={ref} className="tick">
      {boxes.map((b, i) => (
        <li key={i} className="tick__box">
          <span className="tick__sr">{`${b.to}${b.suffix}`}</span>
          <b className="tick__fig" aria-hidden="true">
            {vals[i]}
            {b.suffix}
          </b>
          {b.pending && <Pending />}
        </li>
      ))}
    </ul>
  );
}
