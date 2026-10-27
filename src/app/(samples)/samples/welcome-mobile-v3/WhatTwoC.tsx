import { WHAT2 } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 2 · C · Glass — Revolut and Spotify. The title as the big friendly
 * heading, the film in the glass "now playing" card with its length and the
 * AHLA callout beside it, and the four value boxes as a short glass list of
 * labelled placeholder rows.
 */
export default function WhatTwoC() {
  return (
    <div className="gl">
      <h2 className="gl-h">{WHAT2.vsl.title}</h2>

      <section className="gl-player glass" aria-label={WHAT2.vsl.title}>
        <Player film={WHAT2.vsl} className="gl-phone">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <p className="gl-player__side">
          <span className="gl-len">{WHAT2.vsl.len}</span>
          <b>{WHAT2.callout}</b>
        </p>
      </section>

      <ul className="gl-list glass">
        {WHAT2.boxes.map((b, i) => (
          <li key={b} className="gl-item">
            <span className="gl-item__ico gl-item__ico--ph">{i + 1}</span>
            <span className="gl-item__ph">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
