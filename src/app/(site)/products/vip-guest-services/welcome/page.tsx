import Link from 'next/link';
import type { Metadata } from 'next';
import AutoPilot from './AutoPilot';
import Cadence from './Cadence';
import CompareCarousel from './CompareCarousel';
import ModuleCards from './ModuleCards';
import Objections from './Objections';
import RoiCalculator from './RoiCalculator';
import VslMatrix from './VslMatrix';
import { CLOSE, HANDOFFS, HERO, LIFECYCLE, PROOF_CARDS, STEPS } from './data';
import './welcome.css';

/**
 * Apex Welcome — the product landing page, built to the v4 wireframe.
 *
 * A real file at this path rather than the nav-driven catch-all, which still
 * generates the other seventeen products from products.json through the shared
 * ProductDetail template. Next resolves the static segment first, so this page
 * takes over /products/vip-guest-services/welcome and nothing else moves.
 *
 * The wireframe specifies a dark charcoal-and-gold system of its own. It is not
 * used: this is an Apex page and it is reached from the Apex header, so it is
 * built on the site's own tokens — v34's light ground, Inter, the shared .btn
 * and .pwrap — and welcome.css only describes the widgets the site has no
 * pattern for yet. The structure, the copy and the seven-section order are the
 * wireframe's.
 */
export const metadata: Metadata = {
  title: 'Apex Welcome',
  description: HERO.subhead,
};

export default function WelcomePage() {
  return (
    <main className="page wpage">
      {/* ---- 1. Hero ------------------------------------------------------ */}
      <section id="hero" className="wsec wsec-hero">
        <div className="pwrap">
          <div className="whero">
            <div className="whero-copy">
              <p className="weyebrow">{HERO.eyebrow}</p>
              <h1>{HERO.headline}</h1>
              <p className="plede">{HERO.subhead}</p>

              <div className="wcta">
                <Link className="btn btn-solid" href="/contact-sales">
                  {HERO.primaryCta}
                </Link>
                <a className="btn btn-ghost" href="#vsl">
                  {HERO.secondaryCta}
                </a>
              </div>

              <details className="wnarr">
                <summary>Where the money actually leaks</summary>
                <p>{HERO.narrative}</p>
              </details>
            </div>

            <div className="whero-widget">
              <CompareCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ---- 1B. The VSL matrix ------------------------------------------- */}
      <section id="vsl" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 1B</span>
            <h2>The four-part executive VSL</h2>
            <p>
              What it is, why it matters, what is involved and how to use it — four chapters, each ending in a number a
              General Manager can take upstairs.
            </p>
          </header>
          <VslMatrix />
        </div>
      </section>

      {/* ---- 2. Demographic modules --------------------------------------- */}
      <section id="previews" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 2</span>
            <h2>One 60-second container, cut four ways</h2>
            <p>
              The same vertical 9:16 film adapts to who booked it. Individual, couple, family, buyout — each with its own
              sensory beats and its own reason to convert.
            </p>
          </header>
          <ModuleCards />
        </div>
      </section>

      {/* ---- 3. Cadence and dark social ----------------------------------- */}
      <section id="cadence" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 3</span>
            <h2>Four touchpoints across the pre-arrival dead zone</h2>
            <p>
              Every send goes at 7:00 AM local, each one carrying a strategy explainer for you and a cinematic film for
              the guest.
            </p>
          </header>
          <Cadence />
        </div>
      </section>

      {/* ---- 4. Operational mechanics ------------------------------------- */}
      <section id="mechanics" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 4</span>
            <h2>Zero-staff-drag workflow</h2>
            <p>Zero video editing, zero camera handling, zero database integration. Fifteen seconds a day.</p>
          </header>

          <ol className="wsteps">
            {STEPS.map(([name, body], i) => (
              <li key={name}>
                <span className="wsteps-n">Step {i + 1}</span>
                <h3>{name}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>

          <AutoPilot />
        </div>
      </section>

      {/* ---- 5. The calculator -------------------------------------------- */}
      <section id="roi" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 5</span>
            <h2>What the OTA tax costs you this month</h2>
            <p>Drag the five inputs to your property. The leak and the recovery move with them.</p>
          </header>

          <div className="wroi">
            <div className="wroi-proof">
              {PROOF_CARDS.map(([title, points]) => (
                <article className="wproof" key={title}>
                  <h3>{title}</h3>
                  <ul>
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* ---- 6. Lifecycle boundaries -------------------------------------- */}
      <section id="lifecycle" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 6</span>
            <h2>Where Welcome stops</h2>
            <p>Clean operational boundaries across the guest journey — one product per phase, no overlap.</p>
          </header>

          <ol className="wlife">
            {LIFECYCLE.map((p) => (
              <li key={p.phase} className={p.active ? 'is-active' : undefined}>
                <span className="wlife-phase">{p.phase}</span>
                <h3>{p.product}</h3>
                <ul>
                  {p.points.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <dl className="pdefs whandoff">
            {HANDOFFS.map(([name, body]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- 7. Verification, objections, close ---------------------------- */}
      <section id="faq" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 7</span>
            <h2>The questions the room will ask</h2>
            <p>Operations, finance and marketing each get their own answer, and every number gets its source.</p>
          </header>
          <Objections />
        </div>
      </section>

      <section id="close" className="wsec wsec-close">
        <div className="pwrap">
          <div className="wclose">
            <p className="wclose-copy">{CLOSE.copy}</p>
            <a className="btn btn-solid wclose-cta" href={CLOSE.href}>
              {CLOSE.cta}
            </a>
            <p className="wclose-note">{CLOSE.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
