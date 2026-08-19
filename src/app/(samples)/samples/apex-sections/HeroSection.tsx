import Clip from './Clip';
import { HERO } from './data';

/**
 * Components 1 and 2, exported separately because this page is a catalogue of
 * the 22 components rather than a landing page built out of them. Section 1 is
 * the frame; section 2 is the trigger that lives inside it, shown again on its
 * own so the component can be looked at rather than only used.
 */

/** Component 1 — the full-bleed cinematic frame. */
export function HeroFrame() {
  return (
    <section id="c1" className="wsec axhero">
      <div className="axhero-media">
        <Clip name={HERO.clip} />
      </div>

      <div className="pwrap axhero-in">
        <span className="axhero-tag">Section 1 — Full-bleed cinematic background</span>
        <div className="axhero-copy">
          <h1>{HERO.headline}</h1>
          <p className="axhero-sub">{HERO.subhead}</p>
          <a className="axhero-cta" href={HERO.ctaHref}>
            {HERO.cta}
          </a>
        </div>
      </div>

      <span className="axscroll" aria-hidden />
    </section>
  );
}

/** Component 2 — the scroll trigger, isolated. */
export function ObserveTrigger() {
  return (
    <div className="axtrigger">
      <a className="axhero-cta is-dark" href="#c3">
        {HERO.cta}
      </a>
      <p>
        One route out of the hero and no alternatives — the button scrolls to the comparison rather than opening a form,
        so the only thing it can cost a reader is the next screen. Smooth behaviour comes from CSS, and is dropped
        entirely under <code>prefers-reduced-motion</code>.
      </p>
    </div>
  );
}
