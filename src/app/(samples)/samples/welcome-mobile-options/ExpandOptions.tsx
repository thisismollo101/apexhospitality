'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { MOMENTS, MOMENTS_HEAD, img, type Moment } from './data';
import { Clip, Option } from './parts';

/*
 * Block C2 · Bento Expand. The same 2×2 bento of the four touchpoints in every
 * option; what changes is how one tile opens to reveal its touchpoint.
 */

const B = 'BENTO EXPAND';

/** Locks page scroll and wires Esc while an overlay is open. */
function useOverlay(open: boolean, close: () => void) {
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
}

function Head() {
  return (
    <div className="bhead">
      <span className="eye">{MOMENTS_HEAD.eye}</span>
      <h2>{MOMENTS_HEAD.headline}</h2>
    </div>
  );
}

/** One bento tile: the photo, the timing over it, and a + badge. */
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

/** The touchpoint's own copy, exactly as the live card carries it. */
function Copy({ m, light = false }: { m: Moment; light?: boolean }) {
  return (
    <div className={`ecopy${light ? ' ecopy--light' : ''}`}>
      <span className="kick">{m.kick}</span>
      <h3>{m.title}</h3>
      <p>{m.desc}</p>
    </div>
  );
}

const CloseX = ({ onClick, light = false }: { onClick: () => void; light?: boolean }) => (
  <button type="button" className={`ex-x${light ? ' ex-x--light' : ''}`} aria-label="Close" onClick={onClick}>
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  </button>
);

/* ---- 1 · Bottom sheet -------------------------------------------------------- */
function Sheet() {
  const [i, setI] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const close = () => {
    setShown(false);
    setTimeout(() => setI(null), 320);
  };
  useOverlay(i !== null, close);
  const open = (n: number) => {
    setI(n);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };
  const m = i === null ? null : MOMENTS[i];
  return (
    <Option block={B} n={1} name="Bottom sheet" note="Tap a tile and a sheet slides up from the bottom over the dimmed page, the way Maps opens a place. Pull it down or tap outside to close.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={() => open(n)} open={i === n} />
          ))}
        </div>
      </div>
      {m && (
        <div className={`e1${shown ? ' is-on' : ''}`} role="dialog" aria-modal="true" aria-label={m.title}>
          <button type="button" className="e1__scrim" aria-label="Close" onClick={close} />
          <div className="e1__sheet">
            <button type="button" className="e1__grip" aria-label="Close" onClick={close}>
              <i />
            </button>
            <div className="e1__media">
              <img src={img(m.img)} alt="" />
              <span className="etile__fig">
                {m.fig}
                <small>{m.figSub}</small>
              </span>
            </div>
            <Copy m={m} />
          </div>
        </div>
      )}
    </Option>
  );
}

/* ---- 2 · Inline row reveal ----------------------------------------------------- */
function RowReveal() {
  const [i, setI] = useState<number | null>(null);
  const row = i === null ? -1 : Math.floor(i / 2);
  const cells: React.ReactNode[] = [];
  MOMENTS.forEach((m, n) => {
    cells.push(<Tile key={m.kick} m={m} open={i === n} onOpen={() => setI(i === n ? null : n)} />);
    if (n % 2 === 1 && Math.floor(n / 2) === row && i !== null) {
      const o = MOMENTS[i];
      cells.push(
        <div key="panel" className={`e2__panel e2__panel--${i % 2 ? 'r' : 'l'}`}>
          <div className="e2__media">
            <img src={img(o.img)} alt="" />
          </div>
          <Copy m={o} />
        </div>,
      );
    }
  });
  return (
    <Option block={B} n={2} name="Inline row reveal" note="The touchpoint opens in a full-width panel directly under its row, with a caret pointing at the tile. The other tiles stay put.">
      <div className="ebox">
        <Head />
        <div className="egrid e2">{cells}</div>
      </div>
    </Option>
  );
}

/* ---- 3 · Full-screen takeover with video --------------------------------------
   The tile's own rectangle grows to fill the screen (a clip-path from its bounds
   to the edges), the film plays behind the copy, and closing shrinks it back. */
function Takeover() {
  const [i, setI] = useState<number | null>(null);
  const [rect, setRect] = useState('inset(0)');
  const [full, setFull] = useState(false);
  const fromRef = useRef('inset(0)');
  const close = () => {
    setFull(false);
    setRect(fromRef.current);
    setTimeout(() => setI(null), 460);
  };
  useOverlay(i !== null, close);
  const open = (n: number, el: HTMLButtonElement) => {
    const r = el.getBoundingClientRect();
    const from = `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 16px)`;
    fromRef.current = from;
    setRect(from);
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
    <Option block={B} n={3} name="Full-screen takeover with video" note="The tile grows out of its own spot to fill the screen and its film plays behind the copy. Close and it shrinks back into the grid.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={(el) => open(n, el)} open={i === n} />
          ))}
        </div>
      </div>
      {m && (
        <div className={`e3${full ? ' is-on' : ''}`} style={{ clipPath: rect }} role="dialog" aria-modal="true" aria-label={m.title}>
          <Clip src="vsl.mp4" poster={m.img} className="e3__film" />
          <div className="e3__shade" />
          <CloseX onClick={close} light />
          <div className="e3__copy">
            <span className="e3__when">
              {m.fig} · {m.figSub}
            </span>
            <Copy m={m} light />
          </div>
        </div>
      )}
    </Option>
  );
}

/* ---- 4 · Flip card ------------------------------------------------------------ */
function Flip() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const toggle = (n: number) =>
    setFlipped((s) => {
      const t = new Set(s);
      if (t.has(n)) t.delete(n);
      else t.add(n);
      return t;
    });
  return (
    <Option block={B} n={4} name="Flip card" note="Each tile turns over in place: the photo and timing on the front, the touchpoint's copy on the back. Tap again to turn it back.">
      <div className="ebox">
        <Head />
        <div className="egrid e4">
          {MOMENTS.map((m, n) => (
            <button
              key={m.kick}
              type="button"
              className={`e4__card${flipped.has(n) ? ' is-flipped' : ''}`}
              aria-pressed={flipped.has(n)}
              aria-label={`${m.fig}, ${m.figSub}: ${m.title}`}
              onClick={() => toggle(n)}
            >
              <span className="e4__inner">
                <span className="e4__face e4__front">
                  <img src={img(m.img)} alt="" />
                  <span className="etile__fig">
                    {m.fig}
                    <small>{m.figSub}</small>
                  </span>
                  <span className="etile__ex" aria-hidden="true">
                    ↻
                  </span>
                </span>
                <span className="e4__face e4__back">
                  <span className="e4__when">
                    {m.fig}
                    <small>{m.figSub}</small>
                  </span>
                  <span className="kick">{m.kick}</span>
                  <span className="e4__title">{m.title}</span>
                  <span className="e4__desc">{m.desc}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </Option>
  );
}

/* ---- 5 · Stories tap-through --------------------------------------------------- */
const STORY_MS = 5000;

function StoriesExpand() {
  const [i, setI] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const close = () => setI(null);
  useOverlay(i !== null, close);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    const id = requestAnimationFrame(on);
    mq.addEventListener('change', on);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener('change', on);
    };
  }, []);
  useEffect(() => {
    if (i === null || paused || reduce) return;
    const t = setTimeout(() => setI((n) => (n === null || n >= MOMENTS.length - 1 ? null : n + 1)), STORY_MS);
    return () => clearTimeout(t);
  }, [i, paused, reduce]);
  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const back = e.clientX - r.left < r.width / 3;
    setI((n) => (n === null ? n : back ? Math.max(0, n - 1) : n >= MOMENTS.length - 1 ? null : n + 1));
  };
  const m = i === null ? null : MOMENTS[i];
  return (
    <Option block={B} n={5} name="Stories tap-through" note="Tap any tile and the four touchpoints open full-screen as Stories, starting from that one. Tap to go on, hold to pause, × to leave.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={() => setI(n)} open={i === n} />
          ))}
        </div>
      </div>
      {m && i !== null && (
        <div className="e5" role="dialog" aria-modal="true" aria-label={m.title}>
          <div className="e5__bars" aria-hidden="true">
            {MOMENTS.map((_, n) => (
              <span key={n} className={n < i ? 'is-done' : n === i ? (reduce ? 'is-done' : 'is-on') : ''}>
                <i key={n === i ? `on-${i}` : 'off'} style={{ animationDuration: `${STORY_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
              </span>
            ))}
          </div>
          <CloseX onClick={close} light />
          <div
            className="e5__stage"
            onClick={tap}
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
          >
            <img key={m.img + i} src={img(m.img)} alt="" />
            <div className="e5__copy">
              <span className="e3__when">
                {m.fig} · {m.figSub}
              </span>
              <Copy m={m} light />
            </div>
          </div>
        </div>
      )}
    </Option>
  );
}

export default function ExpandOptions() {
  return (
    <>
      <Sheet />
      <RowReveal />
      <Takeover />
      <Flip />
      <StoriesExpand />
    </>
  );
}
