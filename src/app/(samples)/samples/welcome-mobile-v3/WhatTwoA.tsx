import { WHAT2 } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 2 · A · Grid — Formula 1. The film as the full-bleed header with its
 * length in the outlined pill; the AHLA callout as the heavy black heading on
 * off-white; the four value boxes, still without copy, as a two-by-two grid of
 * labelled placeholders.
 */
export default function WhatTwoA() {
  return (
    <div className="ha">
      <Player film={WHAT2.vsl} className="f1-head">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__h">{WHAT2.vsl.title}</span>
          <span className="f1-head__row">
            <span className="f1-pill">{WHAT2.vsl.len}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <h2 className="f1-callout">{WHAT2.callout}</h2>

      <ul className="f1-grid">
        {WHAT2.boxes.map((b) => (
          <li key={b} className="ph">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
