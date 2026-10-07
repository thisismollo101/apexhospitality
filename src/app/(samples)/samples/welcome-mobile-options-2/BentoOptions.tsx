'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { MOMENTS, MOMENTS_HEAD, img, type Moment } from './data';
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
   True edge to edge: a fixed inset-0 layer above everything, sized to the dynamic
   viewport and running under the status bar and notch (the page sets
   viewport-fit=cover). The film fills the first screen with only the timing
   centred at the top and the blue pill bottom-left. Scroll down and the film
   gives way to the rest of the touchpoint. */
function Takeover() {
  const [i, setI] = useState<number | null>(null);
  const [rect, setRect] = useState('inset(0)');
  const [full, setFull] = useState(false);
  const from = useRef('inset(0)');
  const close = () => {
    setFull(false);
    setRect(from.current);
    setTimeout(() => setI(null), 460);
  };
  useOverlay(i !== null, close);
  const open = (n: number, el: HTMLButtonElement) => {
    const r = el.getBoundingClientRect();
    from.current = `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 16px)`;
    setRect(from.current);
    setI(n);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setRect('inset(0px 0px 0px 0px round 0px)');
        setFull(true);
      }),
    );
  };
  const m = i === null ? null : MOMENTS[i];
  return (
    <Option block={B} n={1} name="Full-screen takeover (refined)" note="Liked, refined: truly edge to edge, under the status bar and notch. Only the timing (top centre) and the blue touchpoint pill (bottom left) sit on the film; scroll down out of it into the rest of the touchpoint.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={(el) => open(n, el)} open={i === n} />
          ))}
        </div>
      </div>
      {m && i !== null && (
        <div className={`he1${full ? ' is-on' : ''}`} style={{ clipPath: rect }} role="dialog" aria-modal="true" aria-label={m.title}>
          <section className="he1__screen">
            <Film m={m} className="he1__film" />
            <div className="he1__shade" aria-hidden="true" />
            <span className="he1__when">
              {m.fig} · {m.figSub}
            </span>
            <span className="he1__pill">
              {m.kick} · {m.title}
            </span>
            <span className="he1__cue" aria-hidden="true">
              ⌄
            </span>
          </section>
          <section className="he1__more">
            <span className="kick">{m.kick}</span>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <div className="he1__meta">
              <b>{m.fig}</b>
              <span>{m.figSub}</span>
            </div>
            <span className="tl__kick he1__othersh">The four films</span>
            <ul className="he1__others">
              {MOMENTS.map((o, n) =>
                n === i ? null : (
                  <li key={o.kick}>
                    <button type="button" onClick={() => setI(n)}>
                      <img src={img(o.img)} alt="" />
                      <span>
                        <b>{o.fig}</b>
                        {o.title}
                      </span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </section>
          <CloseX onClick={close} light />
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
