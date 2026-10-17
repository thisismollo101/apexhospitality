'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useId, useRef, useState } from 'react';
import { APEX_WAY, DATA_POINTS, OLD_WAY, RIBBON, TOP, VSL, img, type DataPoint, type Row } from './data';

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

/** Card A's media: the phone, open on a cold plain-text confirmation email, then nothing. */
export function OldMedia() {
  return (
    <div className="ph ph--old">
      <div className="ph__screen mail">
        <span className="ph__notch" aria-hidden="true" />
        <div className="mail__msg">
          <div className="mail__from" aria-hidden="true">
            <span className="mail__av" />
            <span className="mail__lines">
              <i style={{ width: '64%' }} />
              <i style={{ width: '40%' }} />
            </span>
          </div>
          <b className="mail__subj">{OLD_WAY.subject}</b>
          <span className="mail__text" aria-hidden="true">
            <i />
            <i />
            <i style={{ width: '72%' }} />
          </span>
          <span className="mail__pdf">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 1.5h5.5L13 5v9.5H4z M9.5 1.5V5H13" />
            </svg>
            {OLD_WAY.attachment}
          </span>
          <span className="mail__text" aria-hidden="true">
            <i />
            <i style={{ width: '50%' }} />
          </span>
        </div>
        <div className="mail__quiet">
          <span className="mail__days" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span className="mail__silence">{OLD_WAY.silence}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Card B's media: the phone, one film on a muted loop. Never autoplays by
 * attribute: an observer plays it on screen and pauses it off, muted is set as
 * a property, and reduced motion leaves the poster up.
 */
export function ApexPhone() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className="ph">
      <div className="ph__screen">
        <video ref={ref} className="ph__film" poster={img(APEX_WAY.poster)} muted loop playsInline preload="metadata" aria-hidden="true">
          <source src={img(APEX_WAY.clipHevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
          <source src={img(APEX_WAY.clip)} type="video/mp4" />
        </video>
        <span className="ph__notch" aria-hidden="true" />
      </div>
    </div>
  );
}

const NeverX = () => (
  <svg className="tc__x" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

/**
 * A contrast card's four rows, the What Works list's style: the left value,
 * divider, title and source line, chevron. Card B's left value is the send
 * timing; Card A's is a red X, never sent. One open at a time. The list is
 * fixed at its tallest state (every row closed but the tallest open), so
 * opening a row never moves the card or anything around it; it scrolls inside
 * itself only if it must.
 */
export function Rows({ rows, old = false }: { rows: Row[]; old?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef<HTMLOListElement>(null);
  const id = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let width = -1;
    const fit = () => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      const items = Array.from(el.children) as HTMLElement[];
      const gap = parseFloat(getComputedStyle(el).rowGap) || 0;
      // Each row closed: its whole height, borders included, less its open panel.
      const shut = items.reduce((h, li) => h + li.offsetHeight - (li.querySelector('.tc__more') as HTMLElement).offsetHeight, 0) + gap * (items.length - 1);
      const most = Math.max(...items.map((li) => (li.querySelector('.tc__in') as HTMLElement).scrollHeight));
      // +2 covers sub-pixel rounding in the rows' heights.
      el.style.height = `${Math.ceil(shut + most) + 2}px`;
    };
    fit();
    // Web fonts change the rows' heights without changing the width: measure again once they land.
    document.fonts?.ready.then(() => {
      width = -1;
      fit();
    });
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Belt and braces: if the list ever has to scroll, keep the opened row in view once it has grown.
  useEffect(() => {
    const el = ref.current;
    if (!el || open === null) return;
    const t = window.setTimeout(() => {
      const li = el.children[open] as HTMLElement;
      const top = li.offsetTop;
      if (top < el.scrollTop) el.scrollTop = top;
      else if (top + li.offsetHeight > el.scrollTop + el.clientHeight) el.scrollTop = top + li.offsetHeight - el.clientHeight;
    }, 320);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <ol className={`tc${old ? ' tc--old' : ''}`} ref={ref}>
      {rows.map((r, n) => {
        const on = open === n;
        return (
          <li key={r.title} className={on ? 'is-open' : undefined}>
            <button type="button" aria-expanded={on} aria-controls={`${id}-${n}`} onClick={() => setOpen(on ? null : n)}>
              <span className="tc__when">
                {r.num ? <b>{r.num}</b> : <NeverX />}
                <small>{r.unit}</small>
              </span>
              <span className="tc__name">
                <b>{r.title}</b>
                <small className="src">
                  <span className="ast">*</span>
                  {r.src}
                </small>
              </span>
              <span className="chev" aria-hidden="true" />
            </button>
            <div className="tc__more" id={`${id}-${n}`}>
              <div className="tc__in">
                <div className="tc__pad">
                  <p>{r.text}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* The three stage cards. Each is media / head / body, the same three rows, so a
   parent grid can line them up across a row with subgrid: that is what makes
   the player and the Them-vs-Us cards mirror each other. */

export function PlayerCard({ className = '' }: { className?: string }) {
  const player = usePlayer();
  return (
    <article className={`sc sc--player ${className}`}>
      <div className="sc__media">
        <PlayerMedia {...player} />
      </div>
      <header className="sc__head">
        <span className="tag">Panel A</span>
        <h3>{VSL.label}</h3>
      </header>
      <div className="sc__body">
        <button type="button" className="cta" onClick={player.toggle} aria-pressed={player.playing}>
          <span className="play play--sm" aria-hidden="true">
            <svg viewBox="0 0 24 24">{player.playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M7 4.5l13 7.5-13 7.5z" />}</svg>
          </span>
          {player.playing ? 'Pause' : VSL.cta}
        </button>
        <Src>90-second VSL · Fladlien 13-slide objection script</Src>
      </div>
    </article>
  );
}

export function OldCard({ className = '' }: { className?: string }) {
  return (
    <article className={`sc sc--old ${className}`}>
      <div className="sc__media">
        <OldMedia />
      </div>
      <header className="sc__head">
        <span className="tag tag--old">{OLD_WAY.kick}</span>
        <h3>{OLD_WAY.headline}</h3>
      </header>
      <div className="sc__body">
        <Rows rows={OLD_WAY.rows} old />
      </div>
    </article>
  );
}

export function ApexCard({ className = '' }: { className?: string }) {
  return (
    <article className={`sc sc--apex ${className}`}>
      <div className="sc__media">
        <ApexPhone />
      </div>
      {/* No heading for now, so the pill and the list share one cell spanning the
          head and body rows: the list starts under the pill, not under Card A's headline. */}
      <div className="sc__body sc__body--span">
        <span className="tag tag--apex">{APEX_WAY.kick}</span>
        <Rows rows={APEX_WAY.rows} />
      </div>
    </article>
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
