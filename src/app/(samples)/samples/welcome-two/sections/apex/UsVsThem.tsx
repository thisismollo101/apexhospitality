import Clip from './Clip';
import { BOXES, THEM, US } from './data';

/** Components 3, 4 and 5, each its own section on this page. */

/** Component 3 — the two windows. */
export function ThemVsUs() {
  return (
    <div className="axvs">
      <article className="axwin is-them">
        <header className="axwin-head">
          <h3>{THEM.title}</h3>
          <span className="axwin-flag">Them</span>
        </header>

        {/* Rendered as an actual confirmation rather than described as one: a
            reader recognises their own PMS output on sight, and no amount of
            copy about "sterile receipts" does that work as fast. */}
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
        </div>

        <p className="axwin-verdict">{US.verdict}</p>
      </article>
    </div>
  );
}

/** Component 4 — the four-box product showcase. */
export function ProductShowcase() {
  return (
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
  );
}

/** Component 5 — the guest-perspective phone simulation. */
export function CouplesPreview() {
  return (
    <div className="axpreview">
      <div className="axphone">
        <div className="axphone-screen">
          <Clip name="weddings" label="Couples edition — guest perspective" className="wv916" />
          <div className="axstore-type">
            <strong>{US.overlay}</strong>
            <em>{US.overlaySub}</em>
          </div>
        </div>
      </div>
      <div className="axpreview-body">
        <h3>Couples edition</h3>
        <p>
          The 9:16 frame the guest actually receives, at the size they actually hold it. Typography floats over the
          footage rather than sitting beside it, because the message and the proof have to arrive in the same glance.
        </p>
      </div>
    </div>
  );
}
