'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { APEX_WAY, DATA_POINTS, OLD_WAY, RIBBON, SPINE, VSL, img, type DataPoint, type Stat } from './data';

/*
 * The pieces every layout is built from. Each option arranges these; none of
 * them restyles the card itself, so the five differ in layout only and the
 * cards stay the live Welcome page's cards throughout.
 */

/** One labelled layout: "Option 3 · Bento" plus a one-line note for the reviewer. */
export function Option({ n, name, note, children }: { n: number; name: string; note: string; children: React.ReactNode }) {
  return (
    <section className="opt" id={`option-${n}`} aria-labelledby={`option-${n}-t`}>
      <header className="opt__head">
        <div className="opt__in">
          <span className="opt__label" id={`option-${n}-t`}>
            Option {n} · {name}
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

export const Spine = ({ className = '' }: { className?: string }) => (
  <h2 className={`spine ${className}`}>{SPINE.headline}</h2>
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

/** Card A's media: the cold plain-text confirmation email, then nothing. */
export function OldMedia() {
  return (
    <div className="om">
      <div className="om__mail">
        <div className="om__row">
          <span className="om__av" aria-hidden="true" />
          <span className="om__lines">
            <i style={{ width: '62%' }} />
            <i style={{ width: '38%' }} />
          </span>
        </div>
        <span className="om__subj" aria-hidden="true" />
        <span className="om__text" aria-hidden="true">
          <i />
          <i />
          <i />
          <i style={{ width: '70%' }} />
        </span>
        <span className="om__pdf">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 1.5h5.5L13 5v9.5H4z M9.5 1.5V5H13" />
          </svg>
          {OLD_WAY.attachment}
        </span>
        <span className="om__text" aria-hidden="true">
          <i />
          <i style={{ width: '55%' }} />
        </span>
      </div>
      <div className="om__quiet">
        <span className="om__days" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
        <span className="om__silence">{OLD_WAY.silence}</span>
      </div>
    </div>
  );
}

/**
 * Card B's media: the phone, playing the four personalised streams in turn
 * while it is on screen. Tapping a thumbnail picks one. Reduced motion stays on
 * the first and never advances.
 */
export function ApexPhone() {
  const [on, setOn] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const n = APEX_WAY.streams.length;

  useEffect(() => {
    const el = ref.current;
    if (!el || !auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (e.isIntersecting) id = window.setInterval(() => setOn((x) => (x + 1) % n), 3200);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [auto, n]);

  const s = APEX_WAY.streams[on];
  return (
    <div className="ph" ref={ref}>
      <div className="ph__screen">
        {APEX_WAY.streams.map((x, i) => (
          <img key={x.img} className={`ph__still${i === on ? ' is-on' : ''}`} src={img(x.img)} alt="" />
        ))}
        <span className="ph__scrim" aria-hidden="true" />
        <span className="ph__notch" aria-hidden="true" />
        <span className={`ph__segs${auto ? ' is-auto' : ''}`} aria-hidden="true">
          {APEX_WAY.streams.map((x, i) => (
            <span key={x.img} className={i < on ? 'is-done' : i === on ? 'is-on' : undefined}>
              <i key={i === on ? `on-${on}` : 'off'} />
            </span>
          ))}
        </span>
        <span className="ph__now" aria-live="polite">
          <span className="play play--sm" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 4.5l13 7.5-13 7.5z" />
            </svg>
          </span>
          {s.title}
        </span>
        <ul className="ph__thumbs">
          {APEX_WAY.streams.map((x, i) => (
            <li key={x.img}>
              <button
                type="button"
                className={i === on ? 'is-on' : undefined}
                aria-pressed={i === on}
                aria-label={x.title}
                onClick={() => {
                  setAuto(false);
                  setOn(i);
                }}
              >
                <img src={img(x.img)} alt="" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** A result badge: each figure, its label and its source line. */
export function Result({ stats, className = '' }: { stats: Stat[]; className?: string }) {
  return (
    <ul className={`res ${className}`}>
      {stats.map((s) => (
        <li key={s.text}>
          <b>{s.fig}</b>
          <span className="res__t">{s.text}</span>
          <Src>{s.src}</Src>
        </li>
      ))}
    </ul>
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
        <h3>{OLD_WAY.title}</h3>
      </header>
      <div className="sc__body">
        <Result stats={OLD_WAY.result} />
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
      <header className="sc__head">
        <span className="tag tag--apex">{APEX_WAY.kick}</span>
        <h3>
          {APEX_WAY.title}, <span>{APEX_WAY.sub}</span>
        </h3>
      </header>
      <div className="sc__body">
        <Result stats={APEX_WAY.result} className="res--apex" />
      </div>
    </article>
  );
}
