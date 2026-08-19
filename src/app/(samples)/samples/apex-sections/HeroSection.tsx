import Clip from './Clip';
import { HERO } from './data';

/**
 * Components 1 and 2 — the full-bleed cinematic frame and its single trigger.
 *
 * One clip, one headline, one button, and deliberately no second route out:
 * the only navigation offered is down to the comparison, which is the argument
 * the rest of the page is built on. The vignette lives in style.css because it
 * has to sit between the video and the type, not on either.
 */
export default function HeroSection() {
  return (
    <section id="hero" className="wsec axhero">
      <div className="axhero-media">
        <Clip name={HERO.clip} />
      </div>

      <div className="pwrap axhero-in">
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
