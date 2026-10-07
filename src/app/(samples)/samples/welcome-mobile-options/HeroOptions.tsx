'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { HERO, VALUE_CARDS, VSL_A, img } from './data';
import { Ast, Clip, HeroLines, Option, PlayIcon, Vsl } from './parts';

const B = 'HERO';

/* ---- 1 · Reel cover ---------------------------------------------------------
   The hero is a full-height vertical film with the copy laid over its foot,
   like the cover of a Reel. Cards follow as tight number-led rows. */
function ReelCover() {
  return (
    <Option block={B} n={1} name="Reel cover" note="Full-height vertical film with the headline over it; the three stats follow as compact number-first rows.">
      <div className="a1">
        <div className="a1__film">
          <Clip src={HERO.clip} />
          <div className="a1__copy">
            <h2>{HERO.headline}</h2>
            <HeroLines className="hl hl--light" />
          </div>
        </div>
        <div className="a1__vsl">
          <span className="eye">{VSL_A.eye}</span>
          <h3>{VSL_A.headline}</h3>
          <Vsl poster={VSL_A.poster} tag={VSL_A.tag} className="vsl--wide" />
        </div>
        <ul className="a1__rows">
          {VALUE_CARDS.map((c) => (
            <li key={c.title}>
              <span className="a1__fig">{c.fig}</span>
              <span className="a1__txt">
                <b>{c.title}</b>
                {c.text}
                <small>
                  <Ast />
                  {c.src}
                </small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Option>
  );
}

/* ---- 2 · Peek carousel ------------------------------------------------------
   Copy stays put on the night ground; the VSL and the three cards become one
   swipeable rail, the next card always peeking in from the right. */
function PeekCarousel() {
  const rail = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  const count = VALUE_CARDS.length + 1;
  const onScroll = () => {
    const r = rail.current;
    if (!r) return;
    const w = (r.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
    setI(Math.min(count - 1, Math.round(r.scrollLeft / (w + 12))));
  };
  const go = (n: number) => {
    const r = rail.current;
    const el = r?.children[n] as HTMLElement | undefined;
    if (r && el) r.scrollTo({ left: el.offsetLeft - r.offsetLeft - 20, behavior: 'smooth' });
  };
  return (
    <Option block={B} n={2} name="Peek carousel" note="Headline holds still; the VSL and all three stat cards share one swipe rail with the next card peeking and dots below.">
      <div className="a2">
        <div className="a2__top">
          <h2>{HERO.headline}</h2>
          <HeroLines className="hl hl--light" />
          <span className="eye">{VSL_A.eye}</span>
          <h3>{VSL_A.headline}</h3>
        </div>
        <ul className="rail a2__rail" ref={rail} onScroll={onScroll}>
          <li className="a2__card a2__card--vsl">
            <Vsl poster={VSL_A.poster} tag={VSL_A.tag} className="vsl--fill" />
          </li>
          {VALUE_CARDS.map((c) => (
            <li key={c.title} className="a2__card">
              <div className="a2__art">
                <img src={img(c.img)} alt="" />
                <span className="a2__fig">{c.fig}</span>
              </div>
              <div className="a2__body">
                <h4>{c.title}</h4>
                <p>{c.text}</p>
                <small>
                  <Ast />
                  {c.src}
                </small>
              </div>
            </li>
          ))}
        </ul>
        <div className="dots" role="tablist" aria-label="Cards">
          {Array.from({ length: count }, (_, n) => (
            <button key={n} type="button" role="tab" aria-label={`Card ${n + 1}`} aria-selected={n === i} onClick={() => go(n)} />
          ))}
        </div>
      </div>
    </Option>
  );
}

/* ---- 3 · Stories ------------------------------------------------------------
   Five full-screen panels with progress bars along the top. Tap the right of a
   panel to advance, the left to go back. Advances itself unless reduced motion. */
const STORY_MS = 5000;

function Stories() {
  const panels = 2 + VALUE_CARDS.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % panels), STORY_MS);
    return () => clearTimeout(t);
  }, [i, paused, reduce, panels]);
  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const back = e.clientX - r.left < r.width / 3;
    setI((n) => (back ? Math.max(0, n - 1) : (n + 1) % panels));
  };
  return (
    <Option block={B} n={3} name="Stories" note="Instagram-style tap-through: headline, VSL, then one stat per panel, with progress bars across the top.">
      <div
        className="a3"
        onClick={tap}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        role="group"
        aria-roledescription="stories"
        aria-label={`Panel ${i + 1} of ${panels}`}
      >
        <div className="a3__bars" aria-hidden="true">
          {Array.from({ length: panels }, (_, n) => (
            <span key={n} className={n < i ? 'is-done' : n === i ? (reduce ? 'is-done' : 'is-on') : ''}>
              <i key={n === i ? `on-${i}` : 'off'} style={{ animationDuration: `${STORY_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
            </span>
          ))}
        </div>

        <section className={`a3__p a3__p--hero${i === 0 ? ' is-on' : ''}`}>
          <Clip src={HERO.clip} className="a3__bg" />
          <div className="a3__copy">
            <h2>{HERO.headline}</h2>
            <HeroLines className="hl hl--light" />
          </div>
        </section>
        <section className={`a3__p a3__p--vsl${i === 1 ? ' is-on' : ''}`}>
          <img className="a3__bg" src={img(VSL_A.poster)} alt="" />
          <div className="a3__copy">
            <span className="eye">{VSL_A.eye}</span>
            <h2>{VSL_A.headline}</h2>
          </div>
          <PlayIcon size={68} />
          <span className="a3__tag">{VSL_A.tag}</span>
        </section>
        {VALUE_CARDS.map((c, n) => (
          <section key={c.title} className={`a3__p a3__p--stat${i === n + 2 ? ' is-on' : ''}`}>
            <img className="a3__bg" src={img(c.img)} alt="" />
            <div className="a3__copy">
              <span className="a3__fig">{c.fig}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <small>
                <Ast />
                {c.src}
              </small>
            </div>
          </section>
        ))}
        <span className="a3__hint">Tap to advance · hold to pause</span>
      </div>
    </Option>
  );
}

/* ---- 4 · Pinned film --------------------------------------------------------
   The hero film pins to the screen and the VSL and stat cards slide up over it
   as you scroll, so the property never leaves the background. */
function PinnedFilm() {
  return (
    <Option block={B} n={4} name="Pinned film" note="Scroll-driven: the film pins behind the copy and each card slides up over it, so the property never leaves the screen.">
      <div className="a4">
        <div className="a4__pin">
          <Clip src={HERO.clip} />
          <div className="a4__scrim" />
        </div>
        <div className="a4__over">
          <div className="a4__intro">
            <h2>{HERO.headline}</h2>
            <HeroLines className="hl hl--light" />
          </div>
          <div className="a4__sheet">
            <span className="eye">{VSL_A.eye}</span>
            <h3>{VSL_A.headline}</h3>
            <Vsl poster={VSL_A.poster} tag={VSL_A.tag} className="vsl--wide" />
          </div>
          {VALUE_CARDS.map((c) => (
            <div key={c.title} className="a4__sheet a4__stat">
              <span className="a4__fig">{c.fig}</span>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
              <small>
                <Ast />
                {c.src}
              </small>
            </div>
          ))}
          <div className="a4__tail" />
        </div>
      </div>
    </Option>
  );
}

/* ---- 5 · Number ticker ------------------------------------------------------
   Type-only hero, then the three figures as one big tappable ticker row. Tap a
   number and its card opens beneath. The VSL shrinks to a slim player bar. */
function Ticker() {
  const [open, setOpen] = useState(0);
  const c = VALUE_CARDS[open];
  return (
    <Option block={B} n={5} name="Number ticker" note="Type-only hero; the three figures sit in one big tappable row and the tapped one opens its card. The VSL is a slim player bar.">
      <div className="a5">
        <h2>{HERO.headline}</h2>
        <HeroLines className="hl hl--dark" />
        <button className="vbar" type="button" aria-label={`Play: ${VSL_A.headline}`}>
          <img src={img(VSL_A.poster)} alt="" />
          <PlayIcon size={38} />
          <span>
            <b>{VSL_A.tag}</b>
            <span>{VSL_A.headline}</span>
          </span>
        </button>
        <div className="a5__row" role="tablist" aria-label="The three figures">
          {VALUE_CARDS.map((v, n) => (
            <button key={v.title} type="button" role="tab" aria-selected={n === open} onClick={() => setOpen(n)}>
              <span className="a5__fig">{v.fig}</span>
              <span className="a5__lab">{v.title}</span>
            </button>
          ))}
        </div>
        <div className="a5__detail" key={open} role="tabpanel">
          <img src={img(c.img)} alt="" />
          <div>
            <h4>{c.title}</h4>
            <p>{c.text}</p>
            <small>
              <Ast />
              {c.src}
            </small>
          </div>
        </div>
      </div>
    </Option>
  );
}

export default function HeroOptions() {
  return (
    <>
      <ReelCover />
      <PeekCarousel />
      <Stories />
      <PinnedFilm />
      <Ticker />
    </>
  );
}
