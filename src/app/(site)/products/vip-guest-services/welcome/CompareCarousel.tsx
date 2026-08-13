'use client';

import { useState } from 'react';
import Clip from './Clip';
import { COMPARE, SUITES } from './data';

/**
 * Section 1's side-by-side widget: the same suite, dead on the left and alive
 * on the right, stepped across three rooms.
 *
 * The wireframe rules out a manual drag slider and per-image tabs — the point is
 * that the contrast lands without the reader doing any work — so both panels are
 * always fully visible and the arrows only change which room is being compared.
 * The left panel is the clip's own poster frame, which makes the comparison
 * honest: it is literally the same footage, held still.
 */
export default function CompareCarousel() {
  const [i, setI] = useState(0);
  const suite = SUITES[i];
  const step = (d: number) => setI((n) => (n + d + SUITES.length) % SUITES.length);

  return (
    <div className="wcmp">
      <div className="wcmp-stage">
        <figure className="wcmp-side">
          <span className="wcmp-tag">Traditional static 2D</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- the poster frame of the clip beside it; next/image would resize it differently and break the comparison */}
          <img src={`/media/cards/${suite.clip}.jpg`} alt={`${suite.name} — static gallery image`} />
          <figcaption>{suite.still}</figcaption>
        </figure>

        <figure className="wcmp-side is-live">
          {/* "4K" lives in the caption below, so the corner tag stays short enough
              to share the top edge with the ASMR badge on a narrow panel. */}
          <span className="wcmp-tag is-on">Apex active</span>
          <Clip name={suite.clip} label={`${suite.name} — cinematic loop`} />
          <figcaption>{suite.motion}</figcaption>
          <span className="wcmp-asmr" aria-hidden>
            ASMR on
          </span>
        </figure>
      </div>

      <div className="wcmp-bar">
        <button type="button" onClick={() => step(-1)} aria-label="Previous suite">
          ‹
        </button>
        <div className="wcmp-dots" role="tablist" aria-label="Suite">
          {SUITES.map((s, n) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={s.name}
              className={n === i ? 'is-on' : undefined}
              onClick={() => setI(n)}
            />
          ))}
        </div>
        <strong className="wcmp-name">{suite.name}</strong>
        <button type="button" onClick={() => step(1)} aria-label="Next suite">
          ›
        </button>
      </div>

      <p className="wcmp-cap">{COMPARE.caption}</p>
      <p className="wcmp-sub">{COMPARE.subPlayer}</p>
      <a className="btn btn-solid wcmp-cta" href="#vsl">
        {COMPARE.cta}
      </a>
    </div>
  );
}
