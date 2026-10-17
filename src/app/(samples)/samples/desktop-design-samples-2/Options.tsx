'use client';

import { CONTRAST, DATA_POINTS, RIBBON, TOP } from './data';
import { ApexCard, BgFilm, DataCard, OldCard, Option, Ribbon, Src, VslCard } from './parts';

/*
 * Round 2: three treatments of the top (the film full bleed behind the
 * headline, the VSL as one 9:16 card on the left) and three of the bottom (the
 * revised Them vs Us pair, the same structure each time, with the colour,
 * shading and surfaces varied).
 */

const Vs = () => (
  <span className="vs" aria-hidden="true">
    vs
  </span>
);

/* ---- Top ------------------------------------------------------------------- */

/** Top 1 · a left-weighted scrim like the live hero; data points as glass rows, ribbon as a strip along the foot. */
export function Top1() {
  return (
    <Option
      id="top-1"
      label="Top 1 · Cinematic Scrim"
      note="A directional scrim, heaviest under the copy on the right and lightest behind the VSL card on the left, so the film shows round the card. The headline sits right with the three data points as glass rows under it; the ribbon runs along the foot of the film."
    >
      <div className="top t1">
        <BgFilm />
        <span className="top__scrim" aria-hidden="true" />
        <div className="wrap top__in">
          <VslCard className="top__vsl" />
          <div className="top__copy">
            <h2 className="top__h">{TOP.headline}</h2>
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
      </div>
    </Option>
  );
}

/** Top 2 · the film stays brighter; everything on the right sits in one frosted panel. */
export function Top2() {
  return (
    <Option
      id="top-2"
      label="Top 2 · Glass Panel"
      note="A lighter, even scrim keeps more of the film. The headline, the three data cards and the ribbon share one frosted glass panel on the right, the same height as the VSL card on the left, so the two read as a pair."
    >
      <div className="top t2">
        <BgFilm />
        <span className="top__scrim" aria-hidden="true" />
        <div className="wrap top__in">
          <VslCard className="top__vsl" />
          <div className="top__copy t2__panel">
            <h2 className="top__h">{TOP.headline}</h2>
            <div className="t2__cards">
              {DATA_POINTS.map((d) => (
                <DataCard key={d.n} d={d} className="dc--mini" />
              ))}
            </div>
            <Ribbon className="t2__ribbon" />
          </div>
        </div>
      </div>
    </Option>
  );
}

/** Top 3 · editorial: a bottom-up scrim, the headline at display scale, the data points as ruled columns. */
export function Top3() {
  return (
    <Option
      id="top-3"
      label="Top 3 · Editorial"
      note="Magazine-cover scale: the scrim rises from the foot, the ribbon becomes a quiet line of caps above a very large headline, and the data points sit as three ruled columns. The VSL card is anchored to the bottom left with a thin light ring."
    >
      <div className="top t3">
        <BgFilm />
        <span className="top__scrim" aria-hidden="true" />
        <div className="wrap top__in">
          <VslCard className="top__vsl" />
          <div className="top__copy">
            <p className="t3__kick">
              {RIBBON.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>
            <h2 className="top__h">{TOP.headline}</h2>
            <ol className="t3__cols">
              {DATA_POINTS.map((d) => (
                <li key={d.n}>
                  <span className="t3__n">{d.n}</span>
                  <b>{d.title}</b>
                  <p>{d.text}</p>
                  <Src>{d.src}</Src>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Option>
  );
}

/* ---- Bottom ------------------------------------------------------------------ */

/**
 * The revised Them vs Us pair, the upright two-card block from round 1: Card A
 * left, Card B right, each a 9:16 phone over its rows, sharing one row grid so
 * the two mirror. The three options share this exactly and differ only in
 * their stylesheet theme.
 */
function Pair() {
  return (
    <div className="wrap">
      <span className="eye bot__eye">{CONTRAST.label}</span>
      <div className="bot__pair">
        <OldCard />
        <Vs />
        <ApexCard />
      </div>
    </div>
  );
}

export function Bottom1() {
  return (
    <Option
      id="bottom-1"
      label="Bottom 1 · Night"
      note="The round 1 look carried over: near-black ground, cream card bodies, white rows. Card A's phone sits on a cold red-grey, Card B's on brand blue."
    >
      <div className="bot b1">
        <Pair />
      </div>
    </Option>
  );
}

export function Bottom2() {
  return (
    <Option
      id="bottom-2"
      label="Bottom 2 · Paper"
      note="Inverted to a light section: warm paper ground, white cards with a soft drop shadow, rows on cream. The phones keep their dark grounds, so they become the two darkest things on the page."
    >
      <div className="bot b2">
        <Pair />
      </div>
    </Option>
  );
}

export function Bottom3() {
  return (
    <Option
      id="bottom-3"
      label="Bottom 3 · Ink"
      note="All dark: ink card surfaces with translucent rows and white type, each card tinted toward its side (Card A a cold red, Card B brand blue) over a ground that shades from black into deep blue. A large outline VS sits between them."
    >
      <div className="bot b3">
        <Pair />
      </div>
    </Option>
  );
}

/** All six, in order. The page is a server component, so it takes this one client component rather than the list. */
export default function Options() {
  return (
    <>
      <Top1 />
      <Top2 />
      <Top3 />
      <Bottom1 />
      <Bottom2 />
      <Bottom3 />
    </>
  );
}
