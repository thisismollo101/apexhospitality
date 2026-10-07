'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { MOMENTS, MOMENTS_HEAD, WORKS, img, type Moment } from './data';
import { CloseX, Option, PlayIcon, useOverlay } from './parts';

/*
 * E · Bento Expand. One small element, so three options: the refined takeover,
 * the refined bottom sheet, and a new floating "team radio" card.
 */

const B = 'E · BENTO EXPAND';

function Head() {
  return (
    <div className="bhead">
      <span className="eye">{MOMENTS_HEAD.eye}</span>
      <h2>{MOMENTS_HEAD.headline}</h2>
    </div>
  );
}

function Tile({ m, onOpen, open = false }: { m: Moment; onOpen: (el: HTMLButtonElement) => void; open?: boolean }) {
  return (
    <button
      type="button"
      className={`etile${open ? ' is-open' : ''}`}
      aria-expanded={open}
      aria-label={`${m.fig}, ${m.figSub}: ${m.title}`}
      onClick={(e) => onOpen(e.currentTarget)}
    >
      <img src={img(m.img)} alt="" />
      <span className="etile__fig">
        {m.fig}
        <small>{m.figSub}</small>
      </span>
      <span className="etile__ex" aria-hidden="true">
        {open ? '−' : '+'}
      </span>
    </button>
  );
}

/** A film that plays muted the moment it mounts (it only mounts after a tap). */
function Film({ m, className = '' }: { m: Moment; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
  }, [m.clip]);
  return <video ref={ref} className={className} src={img(m.clip)} poster={img(m.poster)} muted loop playsInline preload="auto" />;
}

/* ---- 1 · Full-screen takeover (refined) --------------------------------------------
   Tap a tile and its vertical film takes the whole screen: a fixed inset-0 layer
   above everything, 100vw × 100dvh, object-fit cover, running under the status
   bar and notch (the page sets viewport-fit=cover; safe-area insets only pad the
   text). Nothing sits on the film but the timing (top centre), the blue
   touchpoint pill (centred) and a down arrow.

   Scroll down, swipe up, press ↓ or tap the arrow, and the film flicks off: it
   shrinks straight back into its own tile, and the touchpoint's points open in
   a card directly under the grid. The points are live Welcome copy, as
   placeholders for Aidan to reword. */

/** Placeholder points per touchpoint, all live copy: the card line, the sheet's lede, and the journey footer. */
const points = (m: Moment) => [m.desc, m.lede, WORKS.foot];

type Phase = 'off' | 'opening' | 'full' | 'closing';

function Takeover() {
  const [i, setI] = useState<number | null>(null); // the touchpoint on screen
  const [shown, setShown] = useState<number | null>(null); // the touchpoint whose points are open
  const [phase, setPhase] = useState<Phase>('off');
  const [clip, setClip] = useState('inset(0px)');
  const box = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const busy = useRef(false);

  /** The clip-path that crops the full screen down to tile n, where it sits right now. */
  const tileClip = (n: number) => {
    const el = tiles.current[n];
    if (!el) return 'inset(50% 50% 50% 50%)';
    const r = el.getBoundingClientRect();
    return `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 16px)`;
  };

  const open = (n: number) => {
    if (busy.current) return;
    busy.current = true;
    setClip(tileClip(n));
    setI(n);
    setPhase('opening');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setClip('inset(0px 0px 0px 0px round 0px)');
        setPhase('full');
        setTimeout(() => {
          busy.current = false;
        }, 480);
      }),
    );
  };

  /** Flick the film off: park the page on the grid (hidden under the film), open the points, then shrink into the tile. */
  const flickOff = () => {
    if (i === null || busy.current) return;
    busy.current = true;
    const n = i;
    const b = box.current;
    if (b) {
      const top = b.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
    }
    setShown(n);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setClip(tileClip(n));
        setPhase('closing');
        setTimeout(() => {
          setI(null);
          setPhase('off');
          busy.current = false;
        }, 480);
      }),
    );
  };

  useOverlay(i !== null, flickOff);

  // Any downward intent while the film is up flicks it off: wheel, a swipe up, or the keys.
  const touchY = useRef<number | null>(null);
  useEffect(() => {
    if (i === null) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 6) flickOff();
    };
    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchY.current !== null && touchY.current - e.touches[0].clientY > 24) {
        touchY.current = null;
        flickOff();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        flickOff();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  });

  const m = i === null ? null : MOMENTS[i];
  const p = shown === null ? null : MOMENTS[shown];
  return (
    <Option block={B} n={1} name="Full-screen takeover (refined)" note="Tap a tile: its vertical film fills the entire screen, edge to edge and under the notch, with only the timing and the touchpoint pill centred on it. Scroll down and the film flicks back into its tile, with that touchpoint's points in a card underneath.">
      <div className="ebox" ref={box}>
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <button
              key={mm.kick}
              ref={(el) => {
                tiles.current[n] = el;
              }}
              type="button"
              className={`etile${shown === n ? ' is-open' : ''}`}
              aria-label={`Play full screen: ${mm.fig}, ${mm.figSub}: ${mm.title}`}
              onClick={() => open(n)}
            >
              <img src={img(mm.img)} alt="" />
              <span className="etile__fig">
                {mm.fig}
                <small>{mm.figSub}</small>
              </span>
              <span className="etile__ex" aria-hidden="true">
                ▶
              </span>
            </button>
          ))}
        </div>
        {p && shown !== null && (
          <div className="tk-points" key={shown} aria-live="polite">
            <div className="tk-points__head">
              <span className="tk-points__pill">
                {p.kick} · {p.title}
              </span>
              <span className="tk-points__when">
                {p.fig} · {p.figSub}
              </span>
            </div>
            <ul>
              {points(p).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <button type="button" className="tk-points__again" onClick={() => open(shown)}>
              <PlayIcon size={22} /> Watch again
            </button>
          </div>
        )}
      </div>
      {m && i !== null && (
        <div className={`tk tk--${phase}`} style={{ clipPath: clip }} role="dialog" aria-modal="true" aria-label={`${m.kick} · ${m.title}`}>
          <Film m={m} className="tk__film" />
          <div className="tk__shade" aria-hidden="true" />
          <span className="tk__when">
            {m.fig} · {m.figSub}
          </span>
          <span className="tk__pill">
            {m.kick} · {m.title}
          </span>
          <button type="button" className="tk__down" onClick={flickOff} aria-label="Scroll down to this touchpoint">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <button type="button" className="tk__x" onClick={flickOff} aria-label="Close">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
      )}
    </Option>
  );
}

/* ---- 2 · Tall bottom sheet (refined) -------------------------------------------------
   The sheet now rises to almost the full page, with the film playing in its top
   and the touchpoint's copy beneath. Pull it down or tap the sliver above to close. */
function TallSheet() {
  const [i, setI] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const close = () => {
    setShown(false);
    setTimeout(() => setI(null), 340);
  };
  useOverlay(i !== null, close);
  const open = (n: number) => {
    setI(n);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };
  const m = i === null ? null : MOMENTS[i];
  return (
    <Option block={B} n={2} name="Tall bottom sheet (refined)" note="Refined: the sheet rises to almost a full page, with the film playing in its top and the touchpoint's copy below. Pull it down or tap above it to close.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={() => open(n)} open={i === n} />
          ))}
        </div>
      </div>
      {m && (
        <div className={`he2${shown ? ' is-on' : ''}`} role="dialog" aria-modal="true" aria-label={m.title}>
          <button type="button" className="he2__scrim" aria-label="Close" onClick={close} />
          <div className="he2__sheet">
            <button type="button" className="he2__grip" aria-label="Close" onClick={close}>
              <i />
            </button>
            <div className="he2__film">
              <Film m={m} />
              <span className="he2__when">
                {m.fig} · {m.figSub}
              </span>
            </div>
            <div className="he2__copy">
              <span className="kick">{m.kick}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
            <div className="he2__nav">
              {MOMENTS.map((o, n) => (
                <button key={o.kick} type="button" aria-pressed={n === i} onClick={() => setI(n)}>
                  {o.fig}
                  <small>{o.figSub}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Option>
  );
}

/* ---- 3 · Team-radio card (new) ----------------------------------------------------
   From F1 Live Timing: tap a tile and a small floating card pops out over the grid,
   playing that touchpoint's film with a live progress line and its copy beside
   it. Tap another tile to swap; × to put it away. The page stays usable. */
function Radio() {
  const [i, setI] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);
  const [prog, setProg] = useState(0);
  const m = i === null ? null : MOMENTS[i];
  useEffect(() => {
    const v = vid.current;
    if (!v || !m) return;
    v.muted = true;
    v.currentTime = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) v.play().catch(() => {});
    const onTime = () => setProg(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [m]);
  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };
  return (
    <Option block={B} n={3} name="Team-radio card" note="New, from F1 Live Timing: tap a tile and a small floating card pops out over the grid, playing that film with a live progress line and its copy beside it. Tap another tile to swap.">
      <div className="ebox he3">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={() => { setI(n); setPaused(false); }} open={i === n} />
          ))}
        </div>
        {m && (
          <div className="he3__card" role="region" aria-label={`Now playing: ${m.title}`} key={m.kick}>
            <button type="button" className="he3__vid" onClick={toggle} aria-label={paused ? 'Play' : 'Pause'}>
              <video ref={vid} src={img(m.clip)} poster={img(m.poster)} muted loop playsInline preload="auto" />
              <span className="he3__pp" aria-hidden="true">
                {paused ? <PlayIcon size={26} /> : <span className="he3__pause" />}
              </span>
            </button>
            <div className="he3__txt">
              <span className="he3__live">
                <i aria-hidden="true" /> {m.fig} · {m.figSub}
              </span>
              <b>{m.title}</b>
              <p>{m.desc}</p>
            </div>
            <CloseX onClick={() => setI(null)} light label="Put the card away" />
            <span className="he3__prog" aria-hidden="true">
              <span style={{ width: `${Math.round(prog * 100)}%` }} />
            </span>
          </div>
        )}
      </div>
    </Option>
  );
}

export default function BentoOptions() {
  return (
    <>
      <Takeover />
      <TallSheet />
      <Radio />
    </>
  );
}
