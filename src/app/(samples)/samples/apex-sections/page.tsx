import AutopilotToggle from './AutopilotToggle';
import HeroSection from './HeroSection';
import LifecycleBoundaries from './LifecycleBoundaries';
import PreArrivalTimeline from './PreArrivalTimeline';
import PriceTiersAndClose from './PriceTiersAndClose';
import RoiCalculator from './RoiCalculator';
import UsVsThem from './UsVsThem';
import VslMatrix from './VslMatrix';
import WelcomeMatrixGrid from './WelcomeMatrixGrid';

// One stylesheet, which itself @imports globals.css and welcome.css so the
// whole page ships as a single sheet in a guaranteed order. See style.css.
import './style.css';

export const metadata = { title: 'Apex Sections' };

/**
 * Apex Sections — the 22-component Apex Welcome landing page, as a sample.
 *
 * Sections run 1 to 9, sequentially. No 1B: a letter suffix is what happens
 * when a section is added without deciding where it belongs, and every anchor
 * here is named for what it holds rather than for its position, so a reorder
 * costs nothing.
 *
 * Kept under /samples deliberately. The live Welcome route at
 * /products/vip-guest-services/welcome is untouched by any of this.
 */
export default function ApexSectionsPage() {
  return (
    <main className="page wpage axpage">
      <a className="axback" href="/samples">
        ← References
      </a>

      {/* ---- 1. Hero ---------------------------------------------------- */}
      <HeroSection />

      {/* ---- 2. Them versus us ------------------------------------------ */}
      <section id="us-vs-them" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 2</span>
            <h2>A receipt, or a storefront</h2>
            <p>
              The same booking, confirmed two ways. One of them sends the guest to Booking.com for video proof; the other
              is the proof.
            </p>
          </header>
          <UsVsThem />
        </div>
      </section>

      {/* ---- 3. The executive VSL --------------------------------------- */}
      <section id="vsl" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 3</span>
            <h2>The four-part executive presentation</h2>
            <p>
              What it is, why it matters, what is involved and how to deploy it — four chapters, each ending in a number
              a General Manager can take upstairs.
            </p>
          </header>
          <VslMatrix />
        </div>
      </section>

      {/* ---- 4. The calculator ------------------------------------------ */}
      <section id="roi" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 4</span>
            <h2>What the OTA tax costs you this month</h2>
            <p>Drag the five inputs to your property. The leak, the recovery and the flow count move with them.</p>
          </header>
          <RoiCalculator />
        </div>
      </section>

      {/* ---- 5. The cadence --------------------------------------------- */}
      <section id="cadence" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 5</span>
            <h2>Four touchpoints across the pre-arrival dead zone</h2>
            <p>Every send goes at 7:00 AM local, and the gate silences the middle two when the window is too short.</p>
          </header>
          <PreArrivalTimeline />
        </div>
      </section>

      {/* ---- 6. Operations ---------------------------------------------- */}
      <section id="ops" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 6</span>
            <h2>Zero-staff-drag workflow</h2>
            <p>Zero video editing, zero camera handling, zero database integration. Fifteen seconds a day.</p>
          </header>
          <AutopilotToggle />
        </div>
      </section>

      {/* ---- 7. The Welcome Matrix -------------------------------------- */}
      <section id="matrix" className="wsec">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 7</span>
            <h2>Sixteen journeys, already specified</h2>
            <p>Four touchpoints across four personas. Open any cell for its shot-by-shot production blueprint.</p>
          </header>
          <WelcomeMatrixGrid />
        </div>
      </section>

      {/* ---- 8. Lifecycle and the in-house fallacy ---------------------- */}
      <section id="lifecycle" className="wsec is-alt">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 8</span>
            <h2>Where Welcome stops, and what it replaces</h2>
            <p>Clean operational boundaries across the guest journey — then the overhead you are not taking on.</p>
          </header>
          <LifecycleBoundaries />
        </div>
      </section>

      {/* ---- 9. Pricing and close --------------------------------------- */}
      <section id="pricing" className="wsec wsec-close">
        <div className="pwrap">
          <header className="wsec-head">
            <span className="wsec-tag">Section 9</span>
            <h2>Three tiers, one regional slot</h2>
            <p>Territory is exclusive. The evaluation confirms availability before anything else is discussed.</p>
          </header>
          <PriceTiersAndClose />
        </div>
      </section>
    </main>
  );
}
