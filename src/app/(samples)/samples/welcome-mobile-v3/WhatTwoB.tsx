import { WHAT2 } from './data';
import { Mark, PlayIcon, Player } from './parts';

/*
 * What · 2 · B · Billboard — Netflix and MasterClass. The film as the rounded
 * billboard card, its burned-in captions running as subtitles, with the title,
 * its length and the AHLA callout set on it; the four value boxes as a row of
 * placeholder posters.
 */
export default function WhatTwoB() {
  return (
    <div className="hb hb--sec">
      <Player film={WHAT2.vsl} className="hb-card hb-card--sq">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot">
          <span className="hb-h">{WHAT2.vsl.title}</span>
          <span className="hb-meta">
            <span className="hb-len">{WHAT2.vsl.len}</span>
            <Mark />
            {WHAT2.callout}
          </span>
          <span className="hb-play">
            <PlayIcon />
          </span>
        </span>
      </Player>

      <ul className="nf-row nf-row--end">
        {WHAT2.boxes.map((b) => (
          <li key={b} className="nf-poster nf-poster--ph">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
