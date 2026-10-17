'use client';

/* eslint-disable @next/next/no-img-element -- the VSL poster is sized by CSS, as in the sample */

import { useEffect, useId, useRef, useState } from 'react';
import { APEX_WAY, DATA_POINTS, JOINED_ROWS, OLD_WAY, RIBBON, TOP, VSL, img } from './data';

/*
 * The top of the page: the hero ("Top 1 · Cinematic Scrim") and the Joined
 * Cards ("Bottom 1 · Joined Cards"), both from /samples/desktop-design-samples-2.
 * Copied rather than imported, per CLAUDE.md, so tuning the sample cannot move
 * the live page. The markup is the sample's; official.css scopes its styles
 * under .wx and sets the live sizes (the VSL card and data points at 75%, the
 * joined cards at 85%).
 */

/** The grey source line. Every uncleared figure carries one. */
const Src = ({ children }: { children: React.ReactNode }) => (
  <span className="src">
    <span className="ast">*</span>
    {children}
  </span>
);

const Tick = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

/** The integration trust ribbon. */
const Ribbon = ({ className = '' }: { className?: string }) => (
  <ul className={`ribbon ${className}`} aria-label="Integrations">
    {RIBBON.map((r) => (
      <li key={r}>
        <Tick />
        {r}
      </li>
    ))}
  </ul>
);

/* ---- the VSL card -------------------------------------------------------------- */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Panel A's film: a 9:16 card with the play button, the 13-slide progress bar
 * and the caption box. There is no VSL yet, so play runs the progress bar over
 * the poster; it opens paused on the caption's slide so the bar reads.
 */
const PER = VSL.seconds / VSL.slides;

function usePlayer() {
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

function PlayerMedia({ t, playing, toggle }: PlayerState) {
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

/** The top's VSL: Panel A's player on its own, as one 9:16 card. */
function VslCard({ className = '' }: { className?: string }) {
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
function BgFilm({ className = '' }: { className?: string }) {
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

/* ---- the hero: Top 1 · Cinematic Scrim ------------------------------------------ */

/** A left-weighted scrim like the old hero; data points as glass rows, ribbon as a strip along the foot. */
export function HeroTop() {
  return (
    <section className="wx top t1 snap" id="s1">
      <BgFilm />
      <span className="top__scrim" aria-hidden="true" />
      <div className="wrap top__in">
        <VslCard className="top__vsl" />
        <div className="top__copy">
          <h1 className="top__h">{TOP.headline}</h1>
          <ul className="t1__pts">
            {DATA_POINTS.map((d) => (
              <li key={d.n}>
                <span className="tag tag--glass">{d.n}</span>
                <span className="t1__txt">
                  <b>{d.title}</b>
                  {d.text}
                  <Src>{d.src}</Src>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Ribbon className="ribbon--strip t1__ribbon" />
    </section>
  );
}

/* ---- Joined Cards: the two phones -------------------------------------------------- */

/** Card A's phone: the plain reminder text from Aidan's reference, and nothing else. */
function SmsPhone() {
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
 * Card B's phone: the APEX Way film (994 × 1920, with sound) on a continuous
 * loop, and the white unmute pill. It starts muted (the only way a browser lets
 * it start on its own), played by an observer while it is on screen and paused
 * off it; muted is set as a property, since React does not reliably emit the
 * attribute. Reduced motion leaves the poster up until someone presses unmute.
 */
function LoopPhone() {
  const ref = useRef<HTMLVideoElement>(null);
  const film = APEX_WAY.joined;
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
        <video ref={ref} className="tphone__film" poster={img(film.poster)} muted loop playsInline preload="auto">
          <source src={img(film.clipHevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
          <source src={img(film.clipWebm)} type="video/webm" />
          <source src={img(film.clip)} type="video/mp4" />
        </video>
        <button type="button" className="snd-pill" onClick={toggle} aria-pressed={sound}>
          <SoundIcon on={sound} />
          <span>{sound ? 'Mute' : 'Unmute'}</span>
        </button>
      </div>
    </div>
  );
}

const DAY = 86400000;

/** Card A's calendar: the bar holds only "Booking to check-in", its letters spread edge to edge. */
function QuietMonth() {
  const c = OLD_WAY.calendar;
  const lead = (new Date(c.start).getUTCDay() + 6) % 7;
  const days = Array.from({ length: c.days }, (_, n) => new Date(c.start + n * DAY).getUTCDate());
  return (
    <div className="cal cal--quiet">
      <div className="cal__bar">
        <span className="sr-only">{c.kick}</span>
        <span className="cal__spread" aria-hidden="true">
          {Array.from(c.kick.toUpperCase()).map((ch, i) => (
            <span key={i} className={ch === ' ' ? 'cal__sp' : undefined}>
              {ch === ' ' ? '' : ch}
            </span>
          ))}
        </span>
      </div>
      <div className="cal__dow" aria-hidden="true">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <ol
        className="cal__grid"
        aria-label={`${c.kick}: ${c.days} days, nothing sent`}
        style={{ gridTemplateRows: `repeat(${Math.ceil((lead + c.days) / 7)}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: lead }, (_, i) => (
          <li key={`pad-${i}`} className="cal__pad" aria-hidden="true" />
        ))}
        {days.map((dom, n) => (
          <li key={n} className="cal__d">
            {dom}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Card B's rows: everything in a row left-aligned (timing, then title, chevron
 * at the far right), every row the same height when closed, stacked with small
 * even gaps and centred on the phone. One open at a time; while one is open the
 * others tighten to a single line, and the source line shows only inside an
 * open row.
 */
function CompactRows() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLOListElement>(null);
  const id = useId();

  // Mark the rows whose title the two-line clamp actually cuts, so only those repeat it in full when open.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mark = () =>
      el.querySelectorAll<HTMLElement>('.cr__title').forEach((t) => {
        t.closest('li')?.toggleAttribute('data-clamped', t.scrollHeight > t.clientHeight + 1);
      });
    mark();
    document.fonts?.ready.then(mark);
    const ro = new ResizeObserver(mark);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // If the list has to scroll, keep the opened row in view once it has grown.
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
    <ol className={`cr${open !== null ? ' has-open' : ''}`} ref={ref}>
      {JOINED_ROWS.map((r, n) => {
        const on = open === n;
        return (
          <li key={r.title} className={on ? 'is-open' : undefined}>
            <button type="button" aria-expanded={on} aria-controls={`${id}-${n}`} onClick={() => setOpen(on ? null : n)}>
              <span className="cr__when">
                <b>{r.num}</b>
                <small>{r.unit}</small>
              </span>
              <span className="cr__title" title={r.title}>
                {r.title}
              </span>
              <span className="chev" aria-hidden="true" />
            </button>
            <div className="cr__more" id={`${id}-${n}`}>
              <div className="cr__in">
                <div className="cr__pad">
                  <b className="cr__full">{r.title}</b>
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

/* ---- Joined Cards: Bottom 1 ----------------------------------------------------------
   Two cards, each an info panel and a phone panel, joined side by side so they
   read as one, and mirrored so the phones meet in the centre round the VS
   circle: [A info] [A phone] [B phone] [B info]. */

function JoinedCards() {
  return (
    <div className="jc">
      <span className="jc__vs" aria-hidden="true">
        vs
      </span>
      <article className="jc__card jc__card--a" aria-label={OLD_WAY.title}>
        {/* The calendar group alone, centred both ways in its column. */}
        <div className="jc__info jc__info--a">
          <QuietMonth />
        </div>
        <div className="jc__media jc__media--a">
          <span className="tag tag--old jc__pill">{OLD_WAY.pill}</span>
          <SmsPhone />
        </div>
      </article>
      <article className="jc__card jc__card--b" aria-label={APEX_WAY.title}>
        <div className="jc__media jc__media--b">
          <span className="tag tag--apex jc__pill">{APEX_WAY.pill}</span>
          <LoopPhone />
        </div>
        {/* The four rows alone, in a frame exactly the phone's height, level with it. */}
        <div className="jc__info">
          <div className="jc__fit">
            <CompactRows />
          </div>
        </div>
      </article>
    </div>
  );
}

/** The Joined Cards section, on night, directly under the hero; its own section-lock frame. */
export function JoinedSection() {
  return (
    <section className="wx bot bj snap" id="s1j" aria-label={`${OLD_WAY.pill} vs ${APEX_WAY.pill}`}>
      <div className="wrap wrap--wide">
        <div className="jc-scale">
          <JoinedCards />
        </div>
      </div>
    </section>
  );
}
