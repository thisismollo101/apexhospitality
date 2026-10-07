'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { HERO, VALUE_CARDS, img } from './data';
import { Ast, Clip, HeroLines, Option } from './parts';

/*
 * A · The hero on its own: headline, three lines, three value cards. No VSL.
 * Each option's real difference is how the three cards are shown.
 */

const B = 'A · HERO';

/** "85–90%" → ["85–90", "%"], so the number can be set big and the unit small. */
const split = (fig: string) => {
  const m = fig.match(/^(.*?)(%?)$/);
  return [m?.[1] ?? fig, m?.[2] ?? ''];
};

/* ---- 1 · Netflix banner --------------------------------------------------------
   Dark banner, two-line headline, the three lines as the subline, one white pill,
   and the hero film inside a glowing phone. The cards follow as glowing rows. */
function Banner() {
  const cards = useRef<HTMLDivElement>(null);
  return (
    <Option block={B} n={1} name="Netflix banner" note="Dark banner with the headline, the three lines and one white pill; the hero film plays inside a glowing phone. The pill drops you onto the three numbers.">
      <div className="ha1">
        <h2>{HERO.headline}</h2>
        <HeroLines className="hl hl--light" />
        <button type="button" className="pill pill--white" onClick={() => cards.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
          See the numbers ↓
        </button>
        <div className="ha1__phone">
          <div className="ha1__glow" aria-hidden="true" />
          <div className="ha1__screen">
            <Clip src={HERO.clip} />
          </div>
        </div>
        <div className="ha1__cards" ref={cards}>
          {VALUE_CARDS.map((c) => (
            <div key={c.title} className="ha1__card">
              <span className="ha1__fig">{c.fig}</span>
              <div>
                <b>{c.title}</b>
                <p>{c.text}</p>
                <small>
                  <Ast />
                  {c.src}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Option>
  );
}

/* ---- 2 · Captioned film + promo row (MasterClass) ------------------------------
   The film carries the hero as big burned-in captions, one line at a time, and the
   three cards sit directly under it as a swipe row of square promo cards. */
function Captioned() {
  const lines = [HERO.headline, ...HERO.lines.map((l) => `${l.pre}${l.bold}${l.post}`)];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % lines.length), 3200);
    return () => clearInterval(t);
  }, [lines.length]);
  return (
    <Option block={B} n={2} name="Captioned film + promo row" note="MasterClass style: the hero film speaks the headline and lines as big burned-in captions, with the three cards as a square swipe row right under it.">
      <div className="ha2">
        <div className="ha2__film">
          <Clip src={HERO.clip} />
          <p className="ha2__cap" key={i} aria-live="polite">
            {i === 0 ? (
              lines[0]
            ) : (
              <>
                {HERO.lines[i - 1].pre}
                <mark>{HERO.lines[i - 1].bold}</mark>
                {HERO.lines[i - 1].post}
                {HERO.lines[i - 1].ast && <Ast />}
              </>
            )}
          </p>
          <div className="ha2__ticks" aria-hidden="true">
            {lines.map((_, n) => (
              <i key={n} className={n === i ? 'is-on' : ''} />
            ))}
          </div>
        </div>
        <ul className="rail ha2__row">
          {VALUE_CARDS.map((c) => (
            <li key={c.title} className="ha2__sq">
              <img src={img(c.img)} alt="" />
              <span className="ha2__fig">{c.fig}</span>
              <div className="ha2__meta">
                <b>{c.title}</b>
                <p>{c.text}</p>
                <small>
                  <Ast />
                  {c.src}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Option>
  );
}

/* ---- 3 · Badge cards (YouTube) -------------------------------------------------
   Light and calm. The cards are square image cards, the figure riding in a small
   badge on the corner, with short meta lines under each — one feature card and
   two halves. Tap a card to read its line. */
function Badges() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Option block={B} n={3} name="Badge cards" note="YouTube style: square photo cards with the figure as a small corner badge and short meta lines under each. One feature card, two halves; tap any card to read its line.">
      <div className="ha3">
        <h2>{HERO.headline}</h2>
        <HeroLines className="hl hl--dark" />
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
      </div>
    </Option>
  );
}

/* ---- 4 · Poster stack (Bahrain story) ------------------------------------------
   Four full-screen posters in a snap stack: the hero, then one per card with the
   figure as the giant headline and the source as the single pill. */
function Posters() {
  return (
    <Option block={B} n={4} name="Poster stack" note="Instagram-story posters, snapping one per swipe up: the hero first, then each card as its own poster with the figure as a giant headline and the source as the one pill.">
      <div className="ha4">
        <section className="ha4__p ha4__p--hero">
          <Clip src={HERO.clip} className="ha4__bg" />
          <div className="ha4__in">
            <h2>{HERO.headline}</h2>
            <HeroLines className="hl hl--light" />
            <span className="ha4__hint">Swipe up ↑</span>
          </div>
        </section>
        {VALUE_CARDS.map((c) => {
          const [num, unit] = split(c.fig);
          return (
            <section key={c.title} className="ha4__p">
              <img className="ha4__bg" src={img(c.img)} alt="" />
              <div className="ha4__in">
                <span className="ha4__big">
                  {num}
                  <small>{unit}</small>
                </span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="pill pill--white">
                  <Ast />
                  {c.src}
                </span>
              </div>
            </section>
          );
        })}
      </div>
    </Option>
  );
}

/* ---- 5 · Schedule list (F1) ----------------------------------------------------
   A photo header carrying the headline, then a clean light list: the figure as a
   big date-style block on the left, the card name, its source as the status, and
   a chevron that opens the row. */
function Schedule() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Option block={B} n={5} name="Schedule list" note="F1-app style: the headline over a full-bleed photo header, then a light list with each figure as a big date-style block, its source as the status, and a chevron that opens the row.">
      <div className="ha5">
        <div className="ha5__head">
          <Clip src={HERO.clip} />
          <div className="ha5__in">
            <h2>{HERO.headline}</h2>
          </div>
        </div>
        <div className="ha5__body">
          <HeroLines className="hl hl--dark" />
          <ol className="ha5__list">
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
                      <small>
                        <Ast />
                        {c.src}
                      </small>
                    </span>
                    <span className="chev" aria-hidden="true" />
                  </button>
                  <p className="ha5__text">{c.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Option>
  );
}

export default function HeroAlone() {
  return (
    <>
      <Banner />
      <Captioned />
      <Badges />
      <Posters />
      <Schedule />
    </>
  );
}
