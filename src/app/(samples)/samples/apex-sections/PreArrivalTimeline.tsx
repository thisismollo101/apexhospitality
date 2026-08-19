import Clip from './Clip';
import { DARK_SOCIAL, SUPPRESSION, TOUCHPOINTS } from './data';

/**
 * Components 12, 13 and 14 — the four-touchpoint timeline with its suppression
 * gate, the share-loop mockup, and the Wharton grounding beneath it.
 *
 * The gate is marked on the two touchpoints it actually silences rather than
 * drawn as a separate flow diagram. A rule shown where it applies is read; a
 * rule shown in its own box is skipped.
 */
export default function PreArrivalTimeline() {
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
          <h3>{DARK_SOCIAL.tag}</h3>
          <p>{DARK_SOCIAL.copy}</p>
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
