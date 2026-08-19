import Clip from './Clip';
import { BOXES, THEM, US } from './data';

/**
 * Components 3, 4 and 5 — the two windows, the four-box showcase, and the
 * guest-perspective overlay nested in the right-hand window.
 *
 * The left panel renders an actual transactional confirmation rather than a
 * description of one. That is the whole point of the comparison: a reader
 * recognises their own PMS output on sight, and no amount of copy about
 * "sterile receipts" does that work as quickly.
 */
export default function UsVsThem() {
  return (
    <>
      <div className="axvs">
        <article className="axwin is-them">
          <header className="axwin-head">
            <h3>{THEM.title}</h3>
            <span className="axwin-flag">Them</span>
          </header>

          <div className="axrcpt">
            <div className="axrcpt-meta">
              <span>From: {THEM.from}</span>
              <span className="axrcpt-subject">{THEM.subject}</span>
            </div>
            <div className="axrcpt-lines">
              {THEM.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <div className="axrcpt-file">
              <span aria-hidden>PDF</span>
              {THEM.attachment}
            </div>
            <p className="axrcpt-foot">{THEM.footer}</p>
          </div>

          <p className="axwin-verdict">{THEM.verdict}</p>
        </article>

        <article className="axwin is-us">
          <header className="axwin-head">
            <h3>{US.title}</h3>
            <span className="axwin-flag">Us</span>
          </header>

          <div className="axstore">
            <Clip name={US.clip} label="The cinematic storefront — vertical guest loop" className="wv916" />
            <div className="axstore-type">
              <strong>{US.overlay}</strong>
              <em>{US.overlaySub}</em>
            </div>
          </div>

          <p className="axwin-verdict">{US.verdict}</p>
        </article>
      </div>

      <div className="axboxes">
        {BOXES.map((b) => (
          <article className="axbox" key={b.n}>
            <Clip name={b.clip} label={`${b.title} — guest-facing loop`} className="wv916" />
            <div className="axbox-body">
              <span className="axbox-n">{b.n}</span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
