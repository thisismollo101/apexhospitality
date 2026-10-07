'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { VALUE_CARDS, VSL_A, img } from './data';
import { Ast, CloseX, Clip, Option, PlayIcon, Player } from './parts';

/*
 * B · The first VSL block on its own: "Your Revenue Walks Out the Door Before
 * Your Guest Walks In." (Watch · 1:30), with its three stat cards, as on the
 * live page. Every option opens the same full-screen player on tap; what
 * changes is how the film is offered, and how the three cards are shown.
 */

const B = 'B · VSL';
const SRC = 'vsl.mp4';

function usePlayer() {
  const [on, setOn] = useState(false);
  const node = on ? <Player src={SRC} poster={VSL_A.poster} title={VSL_A.headline} onClose={() => setOn(false)} /> : null;
  return { open: () => setOn(true), node };
}

/* ---- the three cards, five ways ------------------------------------------------
   The same three cards in every option (52% / 85–90% / 15–30%, with their
   sources), each option showing them its own way. */

const Src = ({ src }: { src: string }) => (
  <small>
    <Ast />
    {src}
  </small>
);

/** As on the live page: split cards, photo and figure over the copy, in one swipe rail. */
function CardsSplit() {
  return (
    <ul className="rail vc-split">
      {VALUE_CARDS.map((c) => (
        <li key={c.title}>
          <div className="vc-split__art">
            <img src={img(c.img)} alt="" />
            <span>{c.fig}</span>
          </div>
          <div className="vc-split__body">
            <h4>{c.title}</h4>
            <p>{c.text}</p>
            <Src src={c.src} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** MasterClass: square promo cards, directly under the film. */
function CardsPromo() {
  return (
    <ul className="rail ha2__row">
      {VALUE_CARDS.map((c) => (
        <li key={c.title} className="ha2__sq">
          <img src={img(c.img)} alt="" />
          <span className="ha2__fig">{c.fig}</span>
          <div className="ha2__meta">
            <b>{c.title}</b>
            <p>{c.text}</p>
            <Src src={c.src} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Netflix: glowing number rows on the dark banner. */
function CardsGlow() {
  return (
    <div className="vc-glow">
      {VALUE_CARDS.map((c) => (
        <div key={c.title} className="ha1__card">
          <span className="ha1__fig">{c.fig}</span>
          <div>
            <b>{c.title}</b>
            <p>{c.text}</p>
            <Src src={c.src} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** "85–90%" → ["85–90", "%"], so the number can be set big and the unit small. */
const split = (fig: string) => {
  const m = fig.match(/^(.*?)(%?)$/);
  return [m?.[1] ?? fig, m?.[2] ?? ''];
};

/** F1 schedule: big figure blocks, source as the status, chevron opens the row. */
function CardsSchedule() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ol className="ha5__list vc-sched">
      {VALUE_CARDS.map((c, n) => {
        const [num, unit] = split(c.fig);
        return (
          <li key={c.title} className={open === n ? 'is-open' : ''}>
            <button type="button" aria-expanded={open === n} onClick={() => setOpen(open === n ? null : n)}>
              <span className="ha5__block">
                <b>{num}</b>
                <small>{unit}</small>
              </span>
              <span className="ha5__name">
                <b>{c.title}</b>
                <Src src={c.src} />
              </span>
              <span className="chev" aria-hidden="true" />
            </button>
            <p className="ha5__text">{c.text}</p>
          </li>
        );
      })}
    </ol>
  );
}

/** YouTube: square photo cards with the figure as a corner badge; tap to read. */
function CardsBadge() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="ha3__grid">
      {VALUE_CARDS.map((c, n) => (
        <button
          key={c.title}
          type="button"
          className={`ha3__card${n === 0 ? ' ha3__card--big' : ''}${open === n ? ' is-open' : ''}`}
          aria-expanded={open === n}
          onClick={() => setOpen(open === n ? null : n)}
        >
          <span className="ha3__img">
            <img src={img(c.img)} alt="" />
            <span className="ha3__badge">{c.fig}</span>
          </span>
          <span className="ha3__title">{c.title}</span>
          <span className="ha3__src">
            <Ast />
            {c.src}
          </span>
          <span className="ha3__text">{c.text}</span>
        </button>
      ))}
    </div>
  );
}

/* ---- 1 · Story poster ------------------------------------------------------- */
function StoryPoster() {
  const p = usePlayer();
  return (
    <Option block={B} n={1} name="Story poster" note="Bahrain-story style: one full-screen poster, the headline as the giant type, a single white pill to play. The three cards follow as the live page's split cards in a swipe rail.">
      <div className="hb1">
        <img className="hb1__bg" src={img(VSL_A.poster)} alt="" />
        <div className="hb1__in">
          <span className="eye eye--light">{VSL_A.eye}</span>
          <h2>{VSL_A.headline}</h2>
          <button type="button" className="pill pill--white pill--big" onClick={p.open}>
            <PlayIcon size={26} />
            {VSL_A.tag}
          </button>
        </div>
      </div>
      <div className="vc-band vc-band--night">
        <CardsSplit />
      </div>
      {p.node}
    </Option>
  );
}

/* ---- 2 · Captioned film (MasterClass) ----------------------------------------
   The film plays muted in place with the headline burned in as captions, word
   group by word group. Tap for sound: it opens full screen. */
const CAPS = ['Your Revenue', 'Walks Out the Door', 'Before Your Guest', 'Walks In.'];

function Captioned() {
  const p = usePlayer();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % CAPS.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <Option block={B} n={2} name="Captioned film" note="MasterClass style: the film plays muted in place with the headline burned in as big captions (one tap for sound), with the three cards as a square promo row right under it.">
      <div className="hb2">
        <button type="button" className="hb2__film" onClick={p.open} aria-label={`Play with sound: ${VSL_A.headline}`}>
          <Clip src={SRC} poster={VSL_A.poster} />
          <span className="hb2__cap" key={i}>
            {CAPS[i]}
          </span>
          <span className="hb2__sound">🔊 Tap for sound · {VSL_A.tag}</span>
        </button>
        <h2 className="hb2__h">{VSL_A.headline}</h2>
      </div>
      <div className="vc-band vc-band--night vc-band--tight">
        <CardsPromo />
      </div>
      {p.node}
    </Option>
  );
}

/* ---- 3 · Clip banner (Netflix) ------------------------------------------------ */
function ClipBanner() {
  const p = usePlayer();
  return (
    <Option block={B} n={3} name="Clip banner" note="Netflix style: dark banner, the headline in two punchy lines, one white pill, the film playing inside a glowing phone, then the three cards as glowing number rows.">
      <div className="hb3">
        <span className="eye eye--light">{VSL_A.eye}</span>
        <h2>
          Your Revenue Walks Out the Door
          <br />
          Before Your Guest Walks In.
        </h2>
        <button type="button" className="pill pill--white" onClick={p.open}>
          {VSL_A.tag}
        </button>
        <button type="button" className="hb3__phone" onClick={p.open} aria-label="Play the video">
          <span className="hb3__glow" aria-hidden="true" />
          <span className="hb3__screen">
            <Clip src={SRC} poster={VSL_A.poster} />
            <PlayIcon size={52} />
          </span>
        </button>
        <CardsGlow />
      </div>
      {p.node}
    </Option>
  );
}

/* ---- 4 · Floating mini-player (F1 Team Radio) --------------------------------
   The block is a calm dark card; the film lives in a small floating card that
   pops out over it with a live progress line. Tap it to go full screen. */
function MiniPlayer() {
  const p = usePlayer();
  const [docked, setDocked] = useState(true);
  return (
    <Option block={B} n={4} name="Floating mini-player" note="F1 Team-Radio style: the film sits in a small floating card that pops out over the block (tap for full screen); the three cards follow as an F1 schedule list with big figure blocks.">
      <div className="hb4">
        <span className="eye eye--light">{VSL_A.eye}</span>
        <h2>{VSL_A.headline}</h2>
        {docked ? (
          <div className="hb4__card" role="group" aria-label="Mini player">
            <button type="button" className="hb4__open" onClick={p.open} aria-label="Play full screen">
              <span className="hb4__thumb">
                <Clip src={SRC} poster={VSL_A.poster} />
              </span>
              <span className="hb4__meta">
                <b>{VSL_A.tag}</b>
                <span>{VSL_A.headline}</span>
                <span className="hb4__wave" aria-hidden="true">
                  {Array.from({ length: 18 }, (_, n) => (
                    <i key={n} style={{ animationDelay: `${(n % 6) * 0.12}s` }} />
                  ))}
                </span>
              </span>
            </button>
            <CloseX onClick={() => setDocked(false)} light label="Dismiss the player" />
            <span className="hb4__prog" aria-hidden="true" />
          </div>
        ) : (
          <button type="button" className="pill pill--white" onClick={() => setDocked(true)}>
            <PlayIcon size={24} />
            {VSL_A.tag}
          </button>
        )}
      </div>
      <div className="vc-band vc-band--warm">
        <CardsSchedule />
      </div>
      {p.node}
    </Option>
  );
}

/* ---- 5 · Picture-in-picture ---------------------------------------------------
   The film plays in place; scroll past it and it docks into a small floating
   window in the corner that keeps playing until you close it or scroll back. */
function Pip() {
  const p = usePlayer();
  const slot = useRef<HTMLDivElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const [pip, setPip] = useState(false);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const s = slot.current;
    const z = zone.current;
    if (!s || !z) return;
    let slotOut = false;
    let inZone = false;
    const sync = () => setPip(slotOut && inZone);
    const a = new IntersectionObserver(([e]) => {
      slotOut = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    });
    const b = new IntersectionObserver(([e]) => {
      inZone = e.isIntersecting;
      sync();
    });
    a.observe(s);
    b.observe(z);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);
  return (
    <Option block={B} n={5} name="Picture-in-picture" note="The film plays in place; scroll on into the three cards (YouTube-style badge cards) and it docks into a small floating window in the corner that keeps playing. Tap it for full screen, × to dismiss.">
      <div className="hb5" ref={zone}>
        <span className="eye">{VSL_A.eye}</span>
        <h2>{VSL_A.headline}</h2>
        <div className="hb5__slot" ref={slot}>
          <button type="button" className="hb5__film" onClick={p.open} aria-label="Play full screen">
            <Clip src={SRC} poster={VSL_A.poster} />
            <span className="vsl__tag">{VSL_A.tag}</span>
          </button>
        </div>
        <div className="hb5__cards">
          <CardsBadge />
        </div>
        {pip && !closed && (
          <div className="hb5__pip">
            <button type="button" onClick={p.open} aria-label="Play full screen">
              <Clip src={SRC} poster={VSL_A.poster} />
            </button>
            <CloseX onClick={() => setClosed(true)} light label="Close picture-in-picture" />
          </div>
        )}
      </div>
      {p.node}
    </Option>
  );
}

export default function VslOptions() {
  return (
    <>
      <StoryPoster />
      <Captioned />
      <ClipBanner />
      <MiniPlayer />
      <Pip />
    </>
  );
}
