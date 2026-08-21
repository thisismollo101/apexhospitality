'use client';

import { useState } from 'react';
import Clip from './Clip';
import { MODULES } from './data';

/**
 * Section 2 — the same 60-second container, cut four ways.
 *
 * Every card runs its own loop with its own mute control. Only one card can be
 * unmuted at a time: four hospitality soundtracks at once is noise, and the
 * claim being demonstrated is sensory precision.
 */
export default function ModuleCards() {
  const [loud, setLoud] = useState<string | null>(null);

  return (
    <div className="wmods">
      {MODULES.map((m) => {
        const on = loud === m.segment;
        return (
          <article className="wmod" key={m.segment}>
            <div className="wmod-media">
              <Clip name={m.clip} muted={!on} label={`${m.segment} — 60-second module`} className="wv916" />
              <button
                type="button"
                className="wmute"
                aria-pressed={on}
                onClick={() => setLoud(on ? null : m.segment)}
              >
                {on ? 'Mute' : 'Unmute'}
              </button>
            </div>

            <h3>
              {m.segment}
              <span>{m.frame}</span>
            </h3>
            <p>{m.body}</p>
            <ul>
              {m.beats.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
