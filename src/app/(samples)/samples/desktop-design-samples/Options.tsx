'use client';

import { useState } from 'react';
import { APEX_WAY, CONTRAST, DATA_POINTS, OLD_WAY, OPTIONS } from './data';
import { ApexCard, DataCard, DataCards, OldCard, Option, PlayerCard, Ribbon, Spine } from './parts';

/*
 * Five layouts of the same two sections. Section 1 is the spine headline, the
 * three data points and the trust ribbon; section 2 is the stage: Panel A's 9:16
 * player against Panel B's Them vs Us. Wherever the player sits beside the
 * contrast cards, the cards share its three rows (media / head / body), so the
 * two panels mirror each other.
 */


const Vs = () => (
  <span className="vs" aria-hidden="true">
    vs
  </span>
);

/** 1 · Centred header, then the player beside Them vs Us on one shared row grid. */
export function Option1() {
  return (
    <Option
      n={1}
      name={OPTIONS[0].name}
      note="Centred spine, three cards, ribbon; then Panel A beside Panel B. All three stage cards share one row grid, so media, titles and result badges line up edge to edge."
    >
      <div className="night o1">
        <div className="wrap">
          <Spine className="spine--center" />
          <DataCards className="o1__cards" />
          <Ribbon className="ribbon--center" />
        </div>
        <div className="wrap o1__stage">
          <div className="o1__a">
            <PlayerCard />
          </div>
          <div className="o1__b">
            <span className="eye o1__eye">{CONTRAST.label}</span>
            <OldCard />
            <Vs />
            <ApexCard />
          </div>
        </div>
      </div>
    </Option>
  );
}

/** 2 · The player sticks on the left while the contrast scrolls past on the right. */
export function Option2() {
  return (
    <Option
      n={2}
      name={OPTIONS[1].name}
      note="Headline left with the ribbon as a vertical trust list; data cards run landscape. On the stage the player stays pinned while Old Way then APEX Way scroll past it, each laid out as the player's mirror image."
    >
      <div className="night o2">
        <div className="wrap o2__top">
          <Spine className="o2__spine" />
          <Ribbon className="ribbon--list o2__ribbon" />
          <div className="o2__cards">
            {DATA_POINTS.map((d) => (
              <DataCard key={d.n} d={d} className="dc--row" />
            ))}
          </div>
        </div>
        <div className="wrap o2__stage">
          <div className="o2__a">
            <PlayerCard className="sc--h" />
          </div>
          <div className="o2__b">
            <span className="eye">{CONTRAST.label}</span>
            <OldCard className="sc--h sc--h-rev" />
            <ApexCard className="sc--h sc--h-rev" />
          </div>
        </div>
      </div>
    </Option>
  );
}

/** 3 · Both sections in one bento grid. */
export function Option3() {
  return (
    <Option
      n={3}
      name={OPTIONS[2].name}
      note="One grid holds both sections: the headline tile, the three data cards and the ribbon wrap around a full-height player; Old Way and APEX Way sit underneath as mirrored landscape tiles."
    >
      <div className="night o3">
        <div className="wrap">
          <div className="o3__grid">
            <div className="o3__spine tile">
              <Spine />
            </div>
            <div className="o3__player">
              <PlayerCard />
            </div>
            {DATA_POINTS.map((d, i) => (
              <DataCard key={d.n} d={d} className={`o3__dc o3__dc--${i + 1}`} />
            ))}
            <div className="o3__ribbon tile">
              <Ribbon className="ribbon--grid" />
            </div>
            <span className="eye o3__eye">{CONTRAST.label}</span>
            <OldCard className="sc--h o3__old" />
            <ApexCard className="sc--h sc--h-rev o3__apex" />
          </div>
        </div>
      </div>
    </Option>
  );
}

/** 4 · Old Way | Player | APEX Way, mirrored around the player. */
export function Option4() {
  return (
    <Option
      n={4}
      name={OPTIONS[3].name}
      note="A symmetric triptych: the player is the centre panel, a step larger, with Old Way and APEX Way as mirror images either side. The data cards sit on the same three columns above, so the page reads as one spine."
    >
      <div className="night o4">
        <div className="wrap">
          <Spine className="spine--center o4__spine" />
          <Ribbon className="ribbon--center ribbon--quiet" />
          <DataCards className="o4__cards" />
        </div>
        <div className="wrap o4__stage">
          <span className="eye o4__eye">{CONTRAST.label}</span>
          <OldCard className="sc--mirror" />
          <PlayerCard className="o4__player" />
          <ApexCard />
        </div>
      </div>
    </Option>
  );
}

/** 5 · The player beside one contrast card that flips between Old Way and APEX Way. */
export function Option5() {
  const [side, setSide] = useState<'old' | 'apex'>('apex');
  return (
    <Option
      n={5}
      name={OPTIONS[4].name}
      note="The ribbon leads as a full-width strip. The stage is two cards of identical shape: the player, and one contrast card that a segmented switch flips between Old Way and APEX Way. The matching data card lights up with it."
    >
      <div className="night o5">
        <Ribbon className="ribbon--strip" />
        <div className="wrap">
          <Spine className="o5__spine" />
          <div className="dcs o5__cards">
            {DATA_POINTS.map((d, i) => (
              <DataCard
                key={d.n}
                d={d}
                className={`dc--short${(side === 'old' && i === 0) || (side === 'apex' && i === 1) ? ' is-lit' : ''}`}
              />
            ))}
          </div>
        </div>
        <div className="wrap o5__stage">
          <div className="o5__a">
            <PlayerCard />
          </div>
          <div className="o5__b">
            <div className="seg" role="group" aria-label={CONTRAST.label}>
              <button type="button" aria-pressed={side === 'old'} className={side === 'old' ? 'is-on is-old' : undefined} onClick={() => setSide('old')}>
                {OLD_WAY.title}
              </button>
              <button type="button" aria-pressed={side === 'apex'} className={side === 'apex' ? 'is-on' : undefined} onClick={() => setSide('apex')}>
                {APEX_WAY.title}
              </button>
            </div>
            <div className="o5__card">
              {side === 'old' ? <OldCard key="old" className="is-in" /> : <ApexCard key="apex" className="is-in" />}
            </div>
          </div>
        </div>
      </div>
    </Option>
  );
}

/** All five, in order. The page is a server component, so it takes this one client component rather than the list. */
export default function Options() {
  return (
    <>
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
    </>
  );
}
