'use client';

import { useState } from 'react';
import { WHY } from './data';
import { PlayIcon, Player } from './parts';

/*
 * Why · C · Glass — Revolut and Spotify. A Revolut account screen: the film's
 * title as the account label and the callout as the big centred balance; the
 * four cards as round action buttons whose detail opens in the glass card
 * below; then the film and the conversion line side by side in one card.
 */
export default function WhyC() {
  const [sel, setSel] = useState(0);
  const k = WHY.cards[sel];
  const c = WHY.conversion;
  return (
    <div className="gl">
      <header className="gl-acct">
        <span className="gl-acct__lab">{WHY.vsl.title}</span>
        <h2 className="gl-acct__bal">{WHY.callout}</h2>
      </header>

      <div className="gl-acts" role="tablist" aria-label="Cards">
        {WHY.cards.map((x, i) => (
          <button key={x.label} type="button" role="tab" aria-selected={sel === i} className={sel === i ? 'is-on' : undefined} onClick={() => setSel(i)}>
            <span className="gl-acts__dot">{x.fig}</span>
            <span className="gl-acts__lab">{x.label}</span>
          </button>
        ))}
      </div>

      <p className="gl-detail glass" aria-live="polite">
        <b>{k.fig}</b>
        <span>
          <i>{k.label}</i>
          {k.line}
        </span>
      </p>

      <section className="gl-duo glass" aria-label={WHY.vsl.title}>
        <Player film={WHY.vsl} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__conv">
          <p className="gl-duo__on">
            <b>{c.apex}</b>
            {c.apexLab}
          </p>
          <span className="gl-duo__vs">{c.vs}</span>
          <p className="gl-duo__off">
            <b>{c.desk}</b>
            {c.deskLab}
          </p>
        </div>
      </section>
    </div>
  );
}
