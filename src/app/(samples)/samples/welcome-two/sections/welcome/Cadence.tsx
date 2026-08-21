'use client';

import { useState } from 'react';
import Clip from './Clip';
import { DARK_SOCIAL, SUPPRESSION, TOUCHPOINTS } from './data';

/**
 * Section 3 — the four-touchpoint cadence, then the share loop it feeds.
 *
 * Each touchpoint holds two clips: the explainer that tells a GM why the send
 * exists, and the guest-facing film that actually goes out. They are the same
 * argument at two altitudes, so they sit in one mini-carousel with a two-way
 * toggle rather than side by side — seeing them swap in place is the point.
 */
function Touchpoint({ t }: { t: (typeof TOUCHPOINTS)[number] }) {
  const [side, setSide] = useState<'a' | 'b'>('b');

  return (
    <li className="wtp">
      <div className="wtp-when">
        <span className="wtp-n">Touch {t.n}</span>
        <strong>{t.when}</strong>
        <span className="wtp-time">{t.time}</span>
      </div>

      <div className="wtp-media">
        <Clip
          name={side === 'a' ? t.explainerClip : t.exampleClip}
          label={`${t.title} — ${side === 'a' ? 'strategy explainer' : 'guest-facing film'}`}
          className="wv916"
        />
        <div className="wtp-swap" role="tablist" aria-label={`${t.title} clips`}>
          <button type="button" role="tab" aria-selected={side === 'a'} onClick={() => setSide('a')}>
            Explainer
          </button>
          <button type="button" role="tab" aria-selected={side === 'b'} onClick={() => setSide('b')}>
            Guest-facing
          </button>
        </div>
      </div>

      <h3>{t.title}</h3>
      <p>{t.body}</p>
    </li>
  );
}

export default function Cadence() {
  return (
    <>
      <ol className="wtps">
        {TOUCHPOINTS.map((t) => (
          <Touchpoint key={t.n} t={t} />
        ))}
      </ol>

      <p className="wnote">{SUPPRESSION}</p>

      <div className="wdark">
        <div className="wdark-phone" aria-hidden>
          <div className="wdark-screen">
            <div className="wdark-bubble">
              <Clip name="welcome" className="wdark-thumb" />
              <span>{DARK_SOCIAL.bubble}</span>
            </div>
            <div className="wdark-bubble is-them">
              <span>Now THAT is how you welcome a guest 🤝</span>
            </div>
          </div>
        </div>

        <div className="wdark-body">
          <h3>The dark social referral loop</h3>
          <p>{DARK_SOCIAL.note}</p>
          <blockquote className="wdark-quote">{DARK_SOCIAL.shareFrame}</blockquote>
          <dl className="wstats">
            {DARK_SOCIAL.stats.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
