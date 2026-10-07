'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useRef, useState } from 'react';
import { MOMENTS, MOMENTS_HEAD, img } from './data';
import { Option, PlayIcon } from './parts';

const B = 'FOUR MOMENTS';

function Head({ light = false }: { light?: boolean }) {
  return (
    <div className={`bhead${light ? ' bhead--light' : ''}`}>
      <span className="eye">{MOMENTS_HEAD.eye}</span>
      <h2>{MOMENTS_HEAD.headline}</h2>
    </div>
  );
}

/* ---- 1 · Swipe deck ---------------------------------------------------------
   The four films as a stacked deck. Drag the top card away (or tap Next) and it
   goes to the back; the deck never runs out. */
function Deck() {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState(0);
  const start = useRef<number | null>(null);
  const [drag, setDrag] = useState(false);
  const next = (dir = -1) => {
    setLeaving(dir);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(0);
      setDx(0);
    }, 260);
  };
  const up = () => {
    if (start.current === null) return;
    start.current = null;
    setDrag(false);
    if (Math.abs(dx) > 80) next(dx > 0 ? 1 : -1);
    else setDx(0);
  };
  return (
    <Option block={B} n={1} name="Swipe deck" note="Tinder-style: the four films stacked as a deck. Swipe the top card away and the next one is underneath.">
      <div className="c1">
        <Head />
        <div className="c1__deck">
          {order
            .map((mi, depth) => ({ m: MOMENTS[mi], depth, mi }))
            .reverse()
            .map(({ m, depth, mi }) => {
              const top = depth === 0;
              const x = top ? (leaving ? leaving * 480 : dx) : 0;
              const style = {
                transform: `translate(${x}px, ${depth * 12}px) rotate(${top ? x / 20 : 0}deg) scale(${1 - depth * 0.05})`,
                zIndex: 10 - depth,
                opacity: depth > 2 ? 0 : 1,
                transition: top && drag ? 'none' : undefined,
              } as React.CSSProperties;
              return (
                <div
                  key={mi}
                  className="c1__card"
                  style={style}
                  onPointerDown={
                    top
                      ? (e) => {
                          start.current = e.clientX;
                          setDrag(true);
                          e.currentTarget.setPointerCapture(e.pointerId);
                        }
                      : undefined
                  }
                  onPointerMove={top ? (e) => start.current !== null && setDx(e.clientX - start.current) : undefined}
                  onPointerUp={top ? up : undefined}
                  onPointerCancel={top ? up : undefined}
                  aria-hidden={!top}
                >
                  <img src={img(m.img)} alt="" draggable={false} />
                  <div className="c1__fig">
                    {m.fig}
                    <small>{m.figSub}</small>
                  </div>
                  <div className="c1__body">
                    <span className="kick">{m.kick}</span>
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="c1__ctl">
          <span>
            {MOMENTS[order[0]].fig} · {MOMENTS[order[0]].figSub}
          </span>
          <button type="button" onClick={() => next(-1)}>
            Next card →
          </button>
        </div>
      </div>
    </Option>
  );
}

/* ---- 2 · Snap carousel ------------------------------------------------------
   The live page's cards, one per swipe, tall 4:5 media with the timing over it
   and the next card peeking. */
function Carousel() {
  const rail = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  const onScroll = () => {
    const r = rail.current;
    if (!r) return;
    const w = (r.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
    setI(Math.min(MOMENTS.length - 1, Math.round(r.scrollLeft / (w + 12))));
  };
  return (
    <Option block={B} n={2} name="Snap carousel" note="The live card design, one per swipe: tall photo with the timing over it, copy beneath, next card peeking, progress line below.">
      <div className="c2">
        <Head />
        <ul className="rail c2__rail" ref={rail} onScroll={onScroll}>
          {MOMENTS.map((m) => (
            <li key={m.kick} className="c2__card">
              <div className="c2__media">
                <img src={img(m.img)} alt="" />
                <span className="c2__fig">
                  {m.fig}
                  <small>{m.figSub}</small>
                </span>
              </div>
              <div className="c2__body">
                <span className="kick">{m.kick}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="c2__prog" aria-hidden="true">
          <span style={{ width: `${((i + 1) / MOMENTS.length) * 100}%` }} />
        </div>
      </div>
    </Option>
  );
}

/* ---- 3 · Bento expanders ----------------------------------------------------
   A 2×2 grid of square tiles. Tap one and it grows to the full width and opens
   its copy; the others step down beneath it. */
function Bento() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Option block={B} n={3} name="Bento expanders" note="A 2×2 grid of photo tiles showing only the timing. Tap one and it expands to full width with its copy.">
      <div className="c3">
        <Head />
        <ul className="c3__grid">
          {MOMENTS.map((m, n) => (
            <li key={m.kick} className={open === n ? 'is-open' : ''}>
              <button type="button" aria-expanded={open === n} onClick={() => setOpen(open === n ? null : n)}>
                <img src={img(m.img)} alt="" />
                <span className="c3__fig">
                  {m.fig}
                  <small>{m.figSub}</small>
                </span>
                <span className="c3__ex" aria-hidden="true">
                  {open === n ? '−' : '+'}
                </span>
              </button>
              <div className="c3__body">
                <span className="kick">{m.kick}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Option>
  );
}

/* ---- 4 · Reels feed ---------------------------------------------------------
   A vertical full-screen feed inside the page: each film is one 9:16 panel and
   swiping up snaps to the next, exactly like the feed the guest scrolls. */
function Feed() {
  return (
    <Option block={B} n={4} name="Reels feed" note="A vertical full-screen feed: each film is one 9:16 panel with its copy overlaid, and swiping up snaps to the next.">
      <div className="c4">
        <Head light />
        <ul className="c4__feed">
          {MOMENTS.map((m) => (
            <li key={m.kick}>
              <img src={img(m.img)} alt="" />
              <PlayIcon size={60} />
              <div className="c4__side" aria-hidden="true">
                <span>♥</span>
                <span>↗</span>
              </div>
              <div className="c4__copy">
                <span className="c4__when">
                  {m.fig} · {m.figSub}
                </span>
                <span className="kick">{m.kick}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="c4__hint">Swipe up inside the frame</p>
      </div>
    </Option>
  );
}

/* ---- 5 · Big-type list ------------------------------------------------------
   No cards at all. The timing set huge down the left like a schedule, the copy
   to its right, and a round still that rolls in as each row is tapped. */
function BigType() {
  const [i, setI] = useState(0);
  return (
    <Option block={B} n={5} name="Big-type schedule" note="Editorial and card-free: the timings set huge like a departures board; tap a row to bring its still and copy forward.">
      <div className="c5">
        <Head />
        <ol className="c5__list">
          {MOMENTS.map((m, n) => (
            <li key={m.kick} className={n === i ? 'is-on' : ''}>
              <button type="button" aria-expanded={n === i} onClick={() => setI(n)}>
                <span className="c5__fig">{m.fig}</span>
                <span className="c5__sub">{m.figSub}</span>
              </button>
              <div className="c5__body">
                <img src={img(m.img)} alt="" />
                <div>
                  <span className="kick">{m.kick}</span>
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Option>
  );
}

export default function MomentsOptions() {
  return (
    <>
      <Deck />
      <Carousel />
      <Bento />
      <Feed />
      <BigType />
    </>
  );
}
