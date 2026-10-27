'use client';

import { useState } from 'react';
import { WHY } from './data';
import { Chevron, PlayIcon, Player } from './parts';

/*
 * Why · A · Grid — Formula 1. The film as the full-bleed header, its title in
 * heavy white capitals and the Expedia callout in the outlined pill; the four
 * cards as a schedule list (big figure, bold title, chevron; a tap opens the
 * line); the conversion line as a dark two-row timing board.
 */
export default function WhyA() {
  const [open, setOpen] = useState(0);
  const c = WHY.conversion;
  return (
    <div className="f1">
      <Player film={WHY.vsl} className="f1-head">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__h">{WHY.vsl.title}</span>
          <span className="f1-head__row">
            <span className="f1-pill">{WHY.callout}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <ol className="f1-sched">
        {WHY.cards.map((k, i) => {
          const on = open === i;
          return (
            <li key={k.label} className={on ? 'is-open' : undefined}>
              <button type="button" className="f1-sched__row" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                <b className="f1-sched__fig">{k.fig}</b>
                <span className="f1-sched__title">{k.label}</span>
                <Chevron className="ico f1-sched__chev" />
              </button>
              <p className="f1-sched__copy" hidden={!on}>
                {k.line}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="f1-board">
        <p className="f1-board__row f1-board__row--lead">
          <b>{c.apex}</b>
          <span>{c.apexLab}</span>
        </p>
        <p className="f1-board__vs">{c.vs}</p>
        <p className="f1-board__row">
          <b>{c.desk}</b>
          <span>{c.deskLab}</span>
        </p>
      </div>
    </div>
  );
}
