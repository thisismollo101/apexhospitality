'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FILM, OPTIONS, SECTIONS, img, type Film } from './data';

/**
 * The hero film, shared by all three options. It starts muted (the only way a
 * browser lets it start on its own) and an observer plays it while it is on
 * screen and pauses it off; nothing downloads before then (preload none).
 * Muted is set as a property, since React does not reliably emit the
 * attribute, and reduced motion leaves the poster up until someone unmutes.
 * `progress` (0–1) is there for the options that draw a scrub bar.
 */
export function useFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const tick = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener('timeupdate', tick);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => v.removeEventListener('timeupdate', tick);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener('timeupdate', tick);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return { ref, sound, toggle, progress };
}

export function Film({ videoRef, className }: { videoRef: React.RefObject<HTMLVideoElement | null>; className: string }) {
  return (
    <video ref={videoRef} className={className} poster={img(FILM.poster)} muted loop playsInline preload="none">
      <source src={img(FILM.hevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
      <source src={img(FILM.webm)} type="video/webm" />
      <source src={img(FILM.clip)} type="video/mp4" />
    </video>
  );
}

export const SoundIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="ico">
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
    {on ? (
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ) : (
      <path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    )}
  </svg>
);

export const Chevron = ({ className = 'ico' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path d="M9 5.5l6.5 6.5L9 18.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The Apex lockup: the mark at the pack's opacities in currentColor, "Apex" heavy, HOSPITALITY at .74em. */
export const Lockup = ({ className = '' }: { className?: string }) => (
  <span className={`lockup ${className}`} role="img" aria-label="Apex Hospitality">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,11 9,85 50,63" fill="currentColor" opacity=".45" />
      <polygon points="50,11 91,85 50,63" fill="currentColor" />
      <polygon points="9,85 91,85 50,63" fill="currentColor" opacity=".22" />
    </svg>
    <span className="lockup__apex">Apex</span>
    <span className="lockup__hosp">Hospitality</span>
  </span>
);

/** The hamburger: a 44px target, like the live header's. */
export const Burger = ({ className = '' }: { className?: string }) => (
  <button type="button" className={`burger ${className}`} aria-label="Menu">
    <span />
    <span />
    <span />
  </button>
);

/**
 * Review chrome over every page: the section index (the current section
 * active) and the A / B / C switcher for it. Both keep the other choice: a
 * section link stays on the current letter, a letter stays on the section.
 * Plain links inside the one route group.
 */
export function ReviewBar() {
  const path = usePathname() ?? '';
  const m = path.match(/\/(hero|why|what1|what2)-([abc])$/);
  const sec = m?.[1] ?? 'hero';
  const opt = m?.[2] ?? 'a';
  return (
    <header className="rv">
      <nav className="rv__idx" aria-label="Sections">
        {SECTIONS.map((s) => {
          const on = s.key === sec;
          return (
            <Link key={s.key} href={`/samples/welcome-mobile-v3/${s.key}-${opt}`} className={on ? 'is-on' : undefined} aria-current={on ? 'page' : undefined}>
              <b>{s.n}</b> {s.label}
            </Link>
          );
        })}
      </nav>
      <nav className="rv__opts" aria-label="Options">
        {OPTIONS.map((o) => {
          const on = o.key === opt;
          return (
            <Link key={o.key} href={`/samples/welcome-mobile-v3/${sec}-${o.key}`} className={on ? 'is-on' : undefined} aria-current={on ? 'page' : undefined}>
              <b>{o.letter}</b> {o.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

/**
 * A tap-to-play film for Sections 1–3. Until it is tapped it is only its
 * poster (lazy) under whatever overlay the option draws (`children`), so the
 * page carries no video weight; a tap swaps in the player and starts it with
 * sound. Changing `film` while it plays switches to the new one. Starting one
 * film pauses any other on the page.
 */
export function Player({
  film,
  className,
  children,
  label,
  on: onProp,
  onStart,
}: {
  film: Film;
  className: string;
  children?: React.ReactNode;
  label?: string;
  /** controlled: whether the player is live (an option that picks films from a list starts it from outside) */
  on?: boolean;
  onStart?: () => void;
}) {
  const [own, setOwn] = useState(false);
  const on = onProp ?? own;
  const start = onStart ?? (() => setOwn(true));
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!on || !v) return;
    const solo = () => document.querySelectorAll('video').forEach((o) => o !== v && o.pause());
    v.addEventListener('play', solo);
    v.play().catch(() => {});
    return () => v.removeEventListener('play', solo);
  }, [on, film.clip]);

  return (
    <div className={`player ${className}`}>
      {on ? (
        <video key={film.clip} ref={ref} className="player__media" poster={img(film.poster)} controls playsInline preload="auto">
          {film.hevc && <source src={img(film.hevc)} type='video/mp4; codecs="hvc1"' />}
          {film.webm && <source src={img(film.webm)} type="video/webm" />}
          <source src={img(film.clip)} type="video/mp4" />
        </video>
      ) : (
        <button type="button" className="player__btn" onClick={start} aria-label={`Play: ${label ?? film.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- poster sized by CSS, lazy */}
          <img className="player__media" src={img(film.poster)} alt="" loading="lazy" decoding="async" />
          {children}
        </button>
      )}
    </div>
  );
}

export const PlayIcon = ({ className = 'ico' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path d="M7 4.5l13 7.5-13 7.5z" fill="currentColor" />
  </svg>
);
