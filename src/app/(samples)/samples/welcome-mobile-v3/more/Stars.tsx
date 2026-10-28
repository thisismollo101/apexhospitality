'use client';

import { useState } from 'react';
import { STARS } from '../data-more';
import { Lockup } from '../parts';

/*
 * The statement after the four films: the lockup and two lines. The live page
 * sets it over a WebGL particle field whose palette shifts on a tap (Cobalt,
 * Nebula, Ember, Aurora); the options here keep that tap in C and stay static
 * in A and B, so the page stays light.
 */

/* A · Grid: Formula 1's five start lights over the two lines in heavy capitals. */
export function StarsA() {
  return (
    <div className="st-a">
      <div className="st-a__lights" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i}>
            <i />
            <i />
          </span>
        ))}
      </div>
      <Lockup className="lockup--over" />
      <h2 className="st-a__h">
        {STARS.lines.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </h2>
    </div>
  );
}

/* B · Billboard: a title card, black, the lockup over a thin brand-blue rule. */
export function StarsB() {
  return (
    <div className="st-b">
      <Lockup className="lockup--over st-b__lock" />
      <span className="st-b__rule" aria-hidden="true" />
      <h2 className="st-b__h">
        {STARS.lines.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </h2>
    </div>
  );
}

/* C · Glass: a star field in the live page's four palettes, shifted by a tap, under one glass card. */
const SKIES = ['cobalt', 'nebula', 'ember', 'aurora'];

export function StarsC() {
  const [sky, setSky] = useState(0);
  return (
    <button type="button" className={`st-c st-c--${SKIES[sky]}`} onClick={() => setSky((sky + 1) % SKIES.length)} aria-label={`${STARS.lines.join(' ')} Tap to change the sky.`}>
      <span className="st-c__field" aria-hidden="true" />
      <span className="st-c__card glass">
        <Lockup className="lockup--on-dark" />
        <span className="st-c__h">
          {STARS.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </span>
      </span>
      <span className="st-c__dots" aria-hidden="true">
        {SKIES.map((s, i) => (
          <i key={s} className={i === sky ? 'is-on' : undefined} />
        ))}
      </span>
    </button>
  );
}
