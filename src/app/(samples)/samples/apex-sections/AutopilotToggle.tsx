'use client';

import { useState } from 'react';
import { AUTOPILOT, PIPELINE } from './data';

/**
 * Components 15 and 16 — the autopilot switch and the four-step pipeline.
 *
 * The switch is a live control rather than a picture of one. The claim is that
 * a GM disarms a two-hundred-arrival morning with a single click, and a switch
 * that actually moves argues that better than a screenshot. Nothing persists:
 * flipping it only changes what the card says.
 */
export default function AutopilotToggle() {
  const [on, setOn] = useState(true);
  const state = on ? AUTOPILOT.on : AUTOPILOT.off;

  return (
    <>
      <div className={`wauto${on ? ' is-on' : ''}`}>
        <div className="wauto-head">
          <div>
            <h3>{state.state}</h3>
            <p className="wauto-sub">{on ? 'Absolute operational silence.' : 'Manual template overrides active.'}</p>
          </div>
          <button type="button" className="wswitch" role="switch" aria-checked={on} onClick={() => setOn(!on)}>
            <span className="wswitch-track" aria-hidden>
              <span className="wswitch-knob" />
            </span>
            <span className="wswitch-label">{on ? 'On' : 'Standby'}</span>
          </button>
        </div>
        <p>{state.copy}</p>
      </div>

      <ol className="wsteps">
        {PIPELINE.map(([name, verb, body], i) => (
          <li key={name}>
            <span className="wsteps-n">
              Step {i + 1} · {verb}
            </span>
            <h3>{name}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
