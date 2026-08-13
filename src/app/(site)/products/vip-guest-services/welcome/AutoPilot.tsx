'use client';

import { useState } from 'react';
import { AUTOPILOT } from './data';

/**
 * Section 4's toggle card. It is a live control rather than a picture of one:
 * the claim is that a GM disarms a 200-arrival morning with a single click, and
 * a switch that actually moves makes that argument better than a screenshot.
 * Nothing is persisted — flipping it only changes what the card says.
 */
export default function AutoPilot() {
  const [on, setOn] = useState(true);

  return (
    <div className={`wauto${on ? ' is-on' : ''}`}>
      <div className="wauto-head">
        <div>
          <h3>Auto-Pilot {on ? 'active' : 'off'}</h3>
          <p className="wauto-sub">
            {on
              ? 'Pre-rendered executive greeting is covering today’s arrivals.'
              : 'Every arrival is waiting on a personalized voice note from the huddle.'}
          </p>
        </div>
        <button type="button" className="wswitch" role="switch" aria-checked={on} onClick={() => setOn(!on)}>
          <span className="wswitch-track" aria-hidden>
            <span className="wswitch-knob" />
          </span>
          <span className="wswitch-label">{on ? 'On' : 'Off'}</span>
        </button>
      </div>
      <p>{AUTOPILOT}</p>
    </div>
  );
}
