'use client';

import { useEffect, useState } from 'react';
import { HERO } from './data';
import { Ast, Clip, HeroLines, Option } from './parts';

/*
 * A · The hero on its own. "The hero is the hero": exactly what the live
 * Welcome hero carries, which is the headline, the three lines and the
 * background film. Nothing else. The three stat cards belong to the VSL block
 * (section B), as on the live page.
 *
 * Every option shows that same content; what changes is how it is staged.
 */

const B = 'A · HERO';

/** One hero line, exactly as the live page sets it: bold figure, footnote star. */
function Line({ n }: { n: number }) {
  const l = HERO.lines[n];
  return (
    <>
      {l.pre}
      <b>{l.bold}</b>
      {l.post}
      {l.ast && <Ast />}
    </>
  );
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 1 · Netflix banner --------------------------------------------------------
   A dark banner: the headline as two punchy lines, the three lines beneath, and
   the hero film playing inside a glowing phone. No CTA; the film is the visual. */
function Banner() {
  return (
    <Option block={B} n={1} name="Netflix banner" note="Dark banner: the headline, the three lines, and the hero film playing inside a glowing phone beneath them.">
      <div className="hx1">
        <h2>{HERO.headline}</h2>
        <HeroLines className="hl hl--light" />
        <div className="hx1__phone">
          <div className="hx1__glow" aria-hidden="true" />
          <div className="hx1__screen">
            <Clip src={HERO.clip} />
          </div>
        </div>
      </div>
    </Option>
  );
}

/* ---- 2 · Captioned film + promo row (MasterClass) --------------------------------
   The film full height with the headline burned in as a caption, and the three
   lines directly under it as a swipe row of square promo cards, the bold figure
   set large on each. */
function Captioned() {
  return (
    <Option block={B} n={2} name="Captioned film + promo row" note="MasterClass style: the hero film with the headline burned in as a big caption, and the three lines as a square swipe row right under it, each figure set large.">
      <div className="hx2">
        <div className="hx2__film">
          <Clip src={HERO.clip} />
          <p className="hx2__cap">{HERO.headline}</p>
        </div>
        <ul className="rail hx2__row">
          {HERO.lines.map((l, n) => (
            <li key={l.bold} className="hx2__sq">
              <span className="hx2__big">{l.bold}</span>
              <p>
                <Line n={n} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Option>
  );
}

/* ---- 3 · Badge cards (YouTube) ---------------------------------------------------
   Light and calm. The film becomes one wide thumbnail with the headline under it
   as the title; the three lines become badge chips across it, the way a video
   card carries its count badges, and as meta lines beneath. */
function Badges() {
  return (
    <Option block={B} n={3} name="Badge cards" note="YouTube style: the film as one wide thumbnail with each line's figure as a small badge on it, the headline as its title, and the three lines as meta rows.">
      <div className="hx3">
        <div className="hx3__thumb">
          <Clip src={HERO.clip} />
          <span className="hx3__badges">
            {HERO.lines.map((l) => (
              <span key={l.bold}>{l.bold}</span>
            ))}
          </span>
        </div>
        <h2>{HERO.headline}</h2>
        <ul className="hx3__meta">
          {HERO.lines.map((l, n) => (
            <li key={l.bold}>
              <span className="hx3__dot" aria-hidden="true" />
              <span>
                <Line n={n} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Option>
  );
}

/* ---- 4 · Poster stack (Bahrain story) --------------------------------------------
   Four full-screen posters over the one film, snapping one per swipe: the
   headline first, then each line as its own poster with its figure as the giant
   type. */
function Posters() {
  return (
    <Option block={B} n={4} name="Poster stack" note="Instagram-story posters over the hero film, snapping one per swipe up: the headline first, then each line as its own poster with the figure as giant type.">
      <div className="hx4">
        <Clip src={HERO.clip} className="hx4__bg" />
        <div className="hx4__stack">
          <section className="hx4__p">
            <h2>{HERO.headline}</h2>
            <span className="hx4__hint">Swipe up ↑</span>
          </section>
          {HERO.lines.map((l, n) => (
            <section key={l.bold} className="hx4__p">
              <span className="hx4__big">{l.bold}</span>
              <p>
                <Line n={n} />
              </p>
            </section>
          ))}
        </div>
      </div>
    </Option>
  );
}

/* ---- 5 · Schedule list (F1) --------------------------------------------------------
   The F1 app's schedule: the film as a full-bleed photo header carrying the
   headline, then the three lines as a clean light list, each figure in a big
   block on the left and the line beside it. The rows light up one after
   another like a live timing board. */
function Schedule() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(() => setOn((n) => (n + 1) % HERO.lines.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <Option block={B} n={5} name="Schedule list" note="F1-app style: the film as a full-bleed header carrying the headline, then the three lines as a clean list with each figure in a big block, lighting up in turn like a timing board.">
      <div className="hx5">
        <div className="hx5__head">
          <Clip src={HERO.clip} />
          <h2>{HERO.headline}</h2>
        </div>
        <ol className="hx5__list">
          {HERO.lines.map((l, n) => (
            <li key={l.bold} className={n === on ? 'is-on' : ''}>
              <span className="hx5__block">{l.bold}</span>
              <span className="hx5__line">
                <Line n={n} />
              </span>
            </li>
          ))}
        </ol>
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
