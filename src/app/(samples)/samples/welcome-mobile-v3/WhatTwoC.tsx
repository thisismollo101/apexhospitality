import { WHAT2 } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 2 · C · Glass — Revolut and Spotify. A Revolut account screen: the
 * film's title as the label and the AHLA callout as the big centred balance;
 * the film as a glass card with its length; and the four value boxes as a glass
 * list of labelled placeholder rows.
 */
export default function WhatTwoC() {
  return (
    <div className="gl">
      <header className="gl-acct">
        <span className="gl-acct__lab">{WHAT2.vsl.title}</span>
        <h2 className="gl-acct__bal">{WHAT2.callout}</h2>
      </header>

      <section className="gl-duo glass" aria-label={WHAT2.vsl.title}>
        <Player film={WHAT2.vsl} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <b>{WHAT2.vsl.title}</b>
          <span className="gl-len">{WHAT2.vsl.len}</span>
        </div>
      </section>

      <ul className="gl-list glass">
        {WHAT2.boxes.map((b, i) => (
          <li key={b} className="gl-item">
            <span className="gl-item__ico gl-item__ico--ph">{String(i + 1).padStart(2, '0')}</span>
            <span className="gl-item__ph">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
