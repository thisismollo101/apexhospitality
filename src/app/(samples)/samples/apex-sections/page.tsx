import { AutopilotSwitch, ProductionPipeline } from './AutopilotToggle';
import { HeroFrame, ObserveTrigger } from './HeroSection';
import { InHouseFallacy, LifecycleScope } from './LifecycleBoundaries';
import { CitationsDrawer, PriceTiers } from './PriceTiersAndClose';
import { DarkSocialLoop, DarkSocialScience, TouchpointTimeline } from './PreArrivalTimeline';
import { CaseStudyArsenal, JointRiskCalculator, PaybackBaseline } from './RoiCalculator';
import { CouplesPreview, ProductShowcase, ThemVsUs } from './UsVsThem';
import { TeleprompterScripts, UnbeatablePromise, VslDashboard } from './VslMatrix';
import { WelcomeMatrix } from './WelcomeMatrixGrid';
import { ProductionBlueprints } from './WelcomeMatrixGrid';

// One stylesheet, which itself @imports globals.css and welcome.css so the
// whole page ships as a single sheet in a guaranteed order. See style.css.
import './style.css';

export const metadata = { title: 'Apex Sections' };

/** The five categories the 22 components are grouped under in the spec. */
// Keyed to section 2, not 1: the hero renders outside the loop, so a label on
// section 1 would never be emitted.
const CATEGORIES: Record<number, string> = {
  2: 'Category I — Hero & first impression',
  6: 'Category II — Persuasion & financial logic',
  12: 'Category III — Visual cadence & viral loops',
  15: 'Category IV — Operations & the Welcome Matrix',
  19: 'Category V — Closing, overheads & packaging',
};

/** Every section on the page, in spec order. Section 1 is the hero and renders itself. */
const SECTIONS: { n: number; title: string; lede: string; alt?: boolean }[] = [
  { n: 2, title: 'The [ Observe Emotion ] scroll trigger', lede: 'One gold-rule button, one destination, no escape routes.' },
  { n: 3, title: 'Them vs us — the side-by-side windows', lede: 'The same booking confirmed two ways. One sends the guest to Booking.com for video proof; the other is the proof.', alt: true },
  { n: 4, title: 'The product showcase', lede: 'The four vertical films a guest actually receives, in the order they arrive.' },
  { n: 5, title: 'Modular guest-facing preview — couples edition', lede: 'The 9:16 frame at the size it is held, with the typography floating over the footage.', alt: true },
  { n: 6, title: 'The split-column VSL matrix', lede: 'Player, queue and proof in one dashboard. Forty, twenty-five, thirty-five.' },
  { n: 7, title: 'The four teleprompter scripts', lede: 'Verbatim, readable, and paced for the room at 115 words a minute.', alt: true },
  { n: 8, title: 'The unbeatable promise', lede: 'The zero-risk intake, isolated so nothing competes with it.' },
  { n: 9, title: 'The joint risk revenue calculator', lede: 'Five inputs. Drag them to your property and watch the leak move.', alt: true },
  { n: 10, title: 'The 56-guest payback baseline', lede: 'What it actually takes to self-fund the retainer.' },
  { n: 11, title: 'The case study arsenal', lede: 'The Tuesday hack — how sensory loops pre-sell the least elastic inventory a resort owns.', alt: true },
  { n: 12, title: 'The four-touchpoint timeline & suppression gate', lede: 'Every send at 7:00 AM local, and the rule that silences the middle two.' },
  { n: 13, title: 'The dark social share loop', lede: 'The forward into the family group chat that no ad platform can follow.', alt: true },
  { n: 14, title: 'The dark social science', lede: 'The $6 trillion black box, grounded in Wharton.' },
  { n: 15, title: 'The operational autopilot toggle', lede: 'A live switch, not a screenshot of one. Flip it.', alt: true },
  { n: 16, title: 'The four-step production pipeline', lede: 'Fifteen seconds of staff effort, from curation to the guest’s phone.' },
  { n: 17, title: 'The Welcome Matrix', lede: 'Four touchpoints across four personas. Open any cell for its blueprint.', alt: true },
  { n: 18, title: 'The sixteen production blueprints', lede: 'The same sixteen, printed in full rather than one modal at a time.' },
  { n: 19, title: 'Lifecycle scope & handoff boundaries', lede: 'Where Welcome stops, and what picks the guest up next.', alt: true },
  { n: 20, title: 'The $2,000,000 in-house fallacy', lede: 'The fixed annual overhead you are not taking on. The four widgets add up to the anchor.' },
  { n: 21, title: 'Three-tier pricing & the high-status CTA', lede: 'Territory is exclusive. The evaluation confirms availability before anything else.', alt: true },
  { n: 22, title: 'Third-party verified data', lede: 'Every statistic on this page, traced to its source.' },
];

const BODY: Record<number, React.ReactNode> = {
  2: <ObserveTrigger />,
  3: <ThemVsUs />,
  4: <ProductShowcase />,
  5: <CouplesPreview />,
  6: <VslDashboard />,
  7: <TeleprompterScripts />,
  8: <UnbeatablePromise />,
  9: <JointRiskCalculator />,
  10: <PaybackBaseline />,
  11: <CaseStudyArsenal />,
  12: <TouchpointTimeline />,
  13: <DarkSocialLoop />,
  14: <DarkSocialScience />,
  15: <AutopilotSwitch />,
  16: <ProductionPipeline />,
  17: <WelcomeMatrix />,
  18: <ProductionBlueprints />,
  19: <LifecycleScope />,
  20: <InHouseFallacy />,
  21: <PriceTiers />,
  22: <CitationsDrawer />,
};

/**
 * Apex Sections — all 22 components, one section each.
 *
 * This is a catalogue, not a landing page. Every component in the spec gets
 * its own numbered, labelled section so it can be looked at, argued with and
 * replaced on its own; grouping them into thematic sections is what a finished
 * landing page does, and it makes individual components impossible to point
 * at. Numbering is flat — 1 to 22, no letter suffixes — and each anchor is
 * #cN so a section can be linked to directly.
 *
 * The design system is Apex Welcome's, taken directly. Kept under /samples;
 * the live Welcome route is untouched.
 */
export default function ApexSectionsPage() {
  return (
    <main className="page wpage axpage">
      <a className="axback" href="/samples">
        ← References
      </a>

      <HeroFrame />

      {SECTIONS.map((s) => (
        <section id={`c${s.n}`} key={s.n} className={`wsec${s.alt ? ' is-alt' : ''}`}>
          <div className="pwrap">
            {CATEGORIES[s.n] && <p className="axcat">{CATEGORIES[s.n]}</p>}
            <header className="wsec-head">
              <span className="wsec-tag">Section {s.n}</span>
              <h2>{s.title}</h2>
              <p>{s.lede}</p>
            </header>
            {BODY[s.n]}
          </div>
        </section>
      ))}
    </main>
  );
}
