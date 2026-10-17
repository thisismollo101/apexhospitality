'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useId, useRef, useState } from 'react';
import { APEX_WAY, CONTRAST, DATA_POINTS, OLD_WAY, RIBBON, TOP, VSL, img, type DataPoint, type Row } from './data';

/*
 * The pieces every layout is built from. Each option arranges these; none of
 * them restyles the card itself, so the five differ in layout only and the
 * cards stay the live Welcome page's cards throughout.
 */

/** One labelled option: "Top 2 · Glass Panel" plus a one-line note for the reviewer. */
export function Option({ id, label, note, children }: { id: string; label: string; note: string; children: React.ReactNode }) {
  return (
    <section className="opt" id={id} aria-labelledby={`${id}-t`}>
      <header className="opt__head">
        <div className="opt__in">
          <span className="opt__label" id={`${id}-t`}>
            {label}
          </span>
          <p className="opt__note">{note}</p>
        </div>
      </header>
      <div className="opt__demo">{children}</div>
    </section>
  );
}

/** The grey source line. Every uncleared figure carries one. */
export const Src = ({ children }: { children: React.ReactNode }) => (
  <span className="src">
    <span className="ast">*</span>
    {children}
  </span>
);

/** A data point: photo top, cream body, number as a dark pill on the photo. */
export function DataCard({ d, className = '' }: { d: DataPoint; className?: string }) {
  return (
    <article className={`dc ${className}`}>
      <div className="dc__art">
        <img src={img(d.img)} alt="" />
        <span className="tag tag--photo">{d.n}</span>
      </div>
      <div className="dc__body">
        <h3>{d.title}</h3>
        <p>{d.text}</p>
        <Src>{d.src}</Src>
      </div>
    </article>
  );
}

export const DataCards = ({ className = '' }: { className?: string }) => (
  <div className={`dcs ${className}`}>
    {DATA_POINTS.map((d) => (
      <DataCard key={d.n} d={d} />
    ))}
  </div>
);

const Tick = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

/** The integration trust ribbon. */
export const Ribbon = ({ className = '' }: { className?: string }) => (
  <ul className={`ribbon ${className}`} aria-label="Integrations">
    {RIBBON.map((r) => (
      <li key={r}>
        <Tick />
        {r}
      </li>
    ))}
  </ul>
);

/* ---- stage cards ----------------------------------------------------------- */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Panel A's film: a 9:16 card with the play button, the 13-slide progress bar
 * and the caption box. There is no VSL yet, so play runs the progress bar over
 * the poster; it opens paused on the caption's slide so the bar reads.
 */
const PER = VSL.seconds / VSL.slides;

/** The player's clock, shared by the film and the card's own CTA. */
export function usePlayer() {
  const [t, setT] = useState((VSL.activeSlide - 0.5) * PER);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((x) => {
        if (x + 0.25 >= VSL.seconds) {
          setPlaying(false);
          return 0;
        }
        return x + 0.25;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  return { t, playing, toggle: () => setPlaying((p) => !p) };
}

type PlayerState = ReturnType<typeof usePlayer>;

export function PlayerMedia({ t, playing, toggle }: PlayerState) {
  const per = PER;
  const slide = Math.min(VSL.slides, Math.floor(t / per) + 1);

  return (
    <div className={`pl${playing ? ' is-playing' : ''}`}>
      <img className="pl__poster" src={img(VSL.poster)} alt="" />
      <span className="pl__scrim" aria-hidden="true" />
      <span className="tag tag--photo pl__k">{VSL.label}</span>
      <span className="pl__dur">{fmt(VSL.seconds)}</span>

      <button type="button" className="pl__play" onClick={toggle} aria-pressed={playing}>
        <span className="play" aria-hidden="true">
          {playing ? (
            <svg viewBox="0 0 24 24">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M7 4.5l13 7.5-13 7.5z" />
            </svg>
          )}
        </span>
        <span className="pl__cta">{playing ? 'Pause' : VSL.cta}</span>
      </button>

      <div className="pl__cap" aria-live="polite">
        <span className="pl__capk">{VSL.focusKick}</span>
        <span className="pl__capt">{VSL.focus}</span>
      </div>

      <div className="pl__bar">
        <div className="pl__segs" role="progressbar" aria-label="Briefing progress" aria-valuemin={0} aria-valuemax={VSL.seconds} aria-valuenow={Math.round(t)}>
          {Array.from({ length: VSL.slides }, (_, i) => {
            const fill = Math.max(0, Math.min(1, (t - i * per) / per));
            return (
              <span key={i} className={i + 1 === slide ? 'is-on' : undefined}>
                <i style={{ transform: `scaleX(${fill})` }} />
              </span>
            );
          })}
        </div>
        <span className="pl__time">
          {String(slide).padStart(2, '0')}/{VSL.slides} · {fmt(t)} / {fmt(VSL.seconds)}
        </span>
      </div>
    </div>
  );
}

/* ---- Them vs Us -------------------------------------------------------------
   One level row, left to right: Card A's rows, Card A's phone, a gap, Card B's
   phone, Card B's rows. The phones sit in the centre and the two halves mirror
   each other exactly. */

/** Card A's phone: the plain reminder text from Aidan's reference, and nothing else. */
export function SmsPhone() {
  const s = OLD_WAY.sms;
  return (
    <div className="tphone">
      <div className="tphone__screen sms">
        <p className="sms__meta">
          {s.kind}
          <br />
          {s.when}
        </p>
        <p className="sms__bubble">{s.body}</p>
        <div className="sms__input" aria-hidden="true">
          <span>{s.input}</span>
          <svg viewBox="0 0 16 16">
            <path d="M6 3.5l4.5 4.5L6 12.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const SoundIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path className="snd__cone" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    {on ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
  </svg>
);

/**
 * Card B's phone: one film on a continuous loop, and an unmute button. It
 * starts muted (the only way a browser lets it start on its own), played by an
 * observer while it is on screen and paused off it; muted is set as a property,
 * since React does not reliably emit the attribute. Reduced motion leaves the
 * poster up until someone presses play-with-sound.
 */
export function LoopPhone() {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return (
    <div className="tphone">
      <div className="tphone__screen">
        <video ref={ref} className="tphone__film" poster={img(APEX_WAY.poster)} muted loop playsInline preload="auto">
          <source src={img(APEX_WAY.clipHevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
          <source src={img(APEX_WAY.clipWebm)} type="video/webm" />
          <source src={img(APEX_WAY.clip)} type="video/mp4" />
        </video>
        <button type="button" className="snd" onClick={toggle} aria-pressed={sound} aria-label={sound ? 'Mute' : 'Unmute'}>
          <SoundIcon on={sound} />
        </button>
      </div>
    </div>
  );
}

const NeverX = () => (
  <svg className="lg__x" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

/**
 * A side's four rows. Every row is the same fixed height with its title held
 * to two lines, so all eight sit level across both sides. The list is exactly
 * the phone's height with the rows spread across it, so the first row is level
 * with the top of the phone and the last with the bottom; opening a row takes
 * up the space between them, and the list scrolls inside itself only if it
 * must. One open at a time; the source line shows only inside an open row.
 */
export function Ledger({ side }: { side: 'a' | 'b' }) {
  const rows: Row[] = side === 'a' ? OLD_WAY.rows : APEX_WAY.rows;
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLOListElement>(null);
  const id = useId();

  // Mark the rows whose title the two-line clamp actually cuts, so only those
  // repeat the full title when opened. Re-measured whenever the width changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mark = () =>
      el.querySelectorAll<HTMLElement>('.lg__title').forEach((t) => {
        t.closest('li')?.toggleAttribute('data-clamped', t.scrollHeight > t.clientHeight + 1);
      });
    mark();
    document.fonts?.ready.then(mark);
    const ro = new ResizeObserver(mark);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // If the list ever has to scroll, keep the opened row in view once it has grown.
  useEffect(() => {
    const el = ref.current;
    if (!el || open === null) return;
    const t = window.setTimeout(() => {
      const li = el.children[open] as HTMLElement;
      if (li.offsetTop < el.scrollTop) el.scrollTop = li.offsetTop;
      else if (li.offsetTop + li.offsetHeight > el.scrollTop + el.clientHeight) el.scrollTop = li.offsetTop + li.offsetHeight - el.clientHeight;
    }, 320);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <ol className={`lg lg--${side}`} ref={ref}>
      {rows.map((r, n) => {
        const on = open === n;
        return (
          <li key={r.title} className={on ? 'is-open' : undefined}>
            <button type="button" aria-expanded={on} aria-controls={`${id}-${n}`} onClick={() => setOpen(on ? null : n)}>
              <span className="lg__when">
                {r.num ? <b>{r.num}</b> : <NeverX />}
                <small>{r.unit}</small>
              </span>
              <span className="lg__title" title={r.title}>
                {r.title}
              </span>
              <span className="chev" aria-hidden="true" />
            </button>
            <div className="lg__more" id={`${id}-${n}`}>
              <div className="lg__in">
                <div className="lg__pad">
                  <b className="lg__full">{r.title}</b>
                  <p>{r.text}</p>
                  <Src>{r.src}</Src>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The whole block: title, the two headline sentences, then the level row. */
export function ThemUs() {
  return (
    <div className="tu">
      <header className="tu__head">
        <span className="eye">{CONTRAST.label}</span>
        <h2>{CONTRAST.title}</h2>
      </header>
      <div className="tu__row">
        <div className="tu__line tu__line--a">
          <span className="tag tag--old">{OLD_WAY.title}</span>
          <p>{OLD_WAY.headline}</p>
        </div>
        <div className="tu__line tu__line--b">
          <span className="tag tag--apex">{APEX_WAY.title}</span>
          <p>{APEX_WAY.headline}</p>
        </div>
        <div className="tu__info tu__info--a">
          <Ledger side="a" />
        </div>
        <div className="tu__phone tu__phone--a">
          <SmsPhone />
        </div>
        <div className="tu__phone tu__phone--b">
          <LoopPhone />
        </div>
        <div className="tu__info tu__info--b">
          <Ledger side="b" />
        </div>
      </div>
    </div>
  );
}

/** The top's VSL: Panel A's player on its own, as one 9:16 card. */
export function VslCard({ className = '' }: { className?: string }) {
  const player = usePlayer();
  return (
    <div className={`vcard ${className}`}>
      <PlayerMedia {...player} />
    </div>
  );
}

/**
 * The top's background film, full bleed on a muted loop. Never autoplays by
 * attribute: an observer plays it on screen and pauses it off, muted is set as
 * a property, and reduced motion leaves the poster up.
 */
export function BgFilm({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className={`bgfilm ${className}`} poster={img(TOP.poster)} muted loop playsInline preload="metadata" aria-hidden="true">
      <source src={img(TOP.film)} type="video/mp4" />
    </video>
  );
}
