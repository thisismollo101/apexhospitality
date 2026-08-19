import Clip from './Clip';
import { DARK_SOCIAL, SUPPRESSION, TOUCHPOINTS } from './data';

/** Components 12, 13 and 14, each its own section. */

/**
 * Component 12 — the timeline and its suppression gate.
 *
 * The gate is marked on the two touchpoints it actually silences rather than
 * drawn as a separate flow diagram: a rule shown where it applies is read, a
 * rule shown in its own box is skipped.
 */
export function TouchpointTimeline() {
  return (
    <>
      <ol className="axtl">
        {TOUCHPOINTS.map((t) => (
          <li key={t.n}>
            <div className="axtl-when">
              <span className="axtl-n">Touch {t.n}</span>
              <strong>{t.when}</strong>
              <span>{t.time} local</span>
            </div>
            <div className="axtl-media">
              <Clip name={t.clip} label={`${t.title} — guest-facing film`} className="wv916" />
            </div>
            <div className="axtl-body">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              {t.suppressed && <span className="axtl-gate">Silenced when the booking window is under 3 days</span>}
            </div>
          </li>
        ))}
      </ol>
      <p className="wnote">
        <strong>{SUPPRESSION.tag}</strong> — {SUPPRESSION.copy}
      </p>
    </>
  );
}

/** Component 13 — the share loop. */
export function DarkSocialLoop() {
  return (
    <div className="wdark">
      <div className="wdark-phone" aria-hidden>
        <div className="wdark-screen">
          <div className="wdark-bubble">
            <Clip name="welcome" className="wdark-thumb" />
            <span>{DARK_SOCIAL.bubble}</span>
          </div>
          <div className="wdark-bubble is-them">
            <span>{DARK_SOCIAL.reply}</span>
          </div>
        </div>
      </div>
      <div className="wdark-body">
        <h3>The share loop</h3>
        <p>
          The guest forwards the clip into a group chat and it arrives as a card rather than a link. No ad platform can
          see the hop, which is exactly why it converts.
        </p>
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
  );
}

/** Component 14 — the Wharton grounding. */
export function DarkSocialScience() {
  return (
    <div className="axcall is-wide">
      <span className="axcall-tag">{DARK_SOCIAL.tag}</span>
      <p>{DARK_SOCIAL.copy}</p>
    </div>
  );
}
