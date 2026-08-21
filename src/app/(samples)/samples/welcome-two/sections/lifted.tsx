import AutoPilot from './welcome/AutoPilot';
import Cadence from './welcome/Cadence';
import ModuleCards from './welcome/ModuleCards';
import Objections from './welcome/Objections';
import WelcomeRoi from './welcome/RoiCalculator';
import { HANDOFFS, LIFECYCLE, PROOF_CARDS, STEPS } from './welcome/data';

import { AutopilotSwitch, ProductionPipeline } from './apex/AutopilotToggle';
import { InHouseFallacy, LifecycleScope } from './apex/LifecycleBoundaries';
import { PriceTiers } from './apex/PriceTiersAndClose';
import { DarkSocialLoop, TouchpointTimeline } from './apex/PreArrivalTimeline';
import { CaseStudyArsenal, JointRiskCalculator, PaybackBaseline } from './apex/RoiCalculator';
import { CouplesPreview, ProductShowcase } from './apex/UsVsThem';
import { TeleprompterScripts, UnbeatablePromise, VslDashboard } from './apex/VslMatrix';
import { ProductionBlueprints } from './apex/WelcomeMatrixGrid';

/**
 * The sections lifted onto Welcome Page Two from the other three pages.
 *
 * Every one of these is the .wsec / .pwrap / .wsec-head shape the site already
 * uses, so they render through one loop in page.tsx rather than twenty-two
 * hand-written blocks. The four Revolut sections are NOT here: they have a
 * layout of their own and a dark palette, and they are written out in page.tsx
 * inside their own .rv1 wrapper.
 *
 * The components are copies under ./welcome and ./apex, not imports across
 * routes. Welcome Page Two is a draft being tuned section by section; a shared
 * component would mean every tweak here also changes the live Welcome page and
 * the Apex Sections catalogue. Copies cost duplication and buy independence,
 * which is the right trade while this page is still moving.
 *
 * `from` records where each one came from. It is not rendered — it is there so
 * that when a section is changed here, it is obvious what it has diverged from.
 */
export type Lifted = {
  n: number;
  title: string;
  lede: string;
  from: string;
  body: React.ReactNode;
};

export const LIFTED: Lifted[] = [
  /* ---- from Apex Welcome, /products/vip-guest-services/welcome ----------- */
  {
    n: 5,
    from: 'Welcome §2',
    title: 'One 60-second container, cut four ways',
    lede: 'The same vertical 9:16 film adapts to who booked it. Individual, couple, family, buyout — each with its own sensory beats and its own reason to convert.',
    body: <ModuleCards />,
  },
  {
    n: 6,
    from: 'Welcome §3',
    title: 'Four touchpoints across the pre-arrival dead zone',
    lede: 'Every send goes at 7:00 AM local, each one carrying a strategy explainer for you and a cinematic film for the guest.',
    body: <Cadence />,
  },
  {
    n: 7,
    from: 'Welcome §4',
    title: 'Zero-staff-drag workflow',
    lede: 'Zero video editing, zero camera handling, zero database integration. Fifteen seconds a day.',
    body: (
      <>
        <ol className="wsteps">
          {STEPS.map(([name, copy], i) => (
            <li key={name}>
              <span className="wsteps-n">Step {i + 1}</span>
              <h3>{name}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <AutoPilot />
      </>
    ),
  },
  {
    n: 8,
    from: 'Welcome §5',
    title: 'What the OTA tax costs you this month',
    lede: 'Drag the five inputs to your property. The leak and the recovery move with them.',
    body: (
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
        <WelcomeRoi />
      </div>
    ),
  },
  {
    n: 9,
    from: 'Welcome §6',
    title: 'Where Welcome stops',
    lede: 'Clean operational boundaries across the guest journey — one product per phase, no overlap.',
    body: (
      <>
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
          {HANDOFFS.map(([name, copy]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{copy}</dd>
            </div>
          ))}
        </dl>
      </>
    ),
  },
  {
    n: 10,
    from: 'Welcome §7',
    title: 'The questions the room will ask',
    lede: 'Operations, finance and marketing each get their own answer, and every number gets its source.',
    body: <Objections />,
  },

  /* ---- from Apex Sections, /samples/apex-sections ------------------------ */
  {
    n: 11,
    from: 'Apex Sections §4',
    title: 'The product showcase',
    lede: 'The four vertical films a guest actually receives, in the order they arrive.',
    body: <ProductShowcase />,
  },
  {
    n: 12,
    from: 'Apex Sections §5',
    title: 'Modular guest-facing preview — couples edition',
    lede: 'The 9:16 frame at the size it is held, with the typography floating over the footage.',
    body: <CouplesPreview />,
  },
  {
    n: 13,
    from: 'Apex Sections §6',
    title: 'The split-column VSL matrix',
    lede: 'Player, queue and proof in one dashboard. Forty, twenty-five, thirty-five.',
    body: <VslDashboard />,
  },
  {
    n: 14,
    from: 'Apex Sections §7',
    title: 'The four teleprompter scripts',
    lede: 'Verbatim, readable, and paced for the room at 115 words a minute.',
    body: <TeleprompterScripts />,
  },
  {
    n: 15,
    from: 'Apex Sections §8',
    title: 'The unbeatable promise',
    lede: 'The zero-risk intake, isolated so nothing competes with it.',
    body: <UnbeatablePromise />,
  },
  {
    n: 16,
    from: 'Apex Sections §9',
    title: 'The joint risk revenue calculator',
    lede: 'Five inputs. Drag them to your property and watch the leak move.',
    body: <JointRiskCalculator />,
  },
  {
    n: 17,
    from: 'Apex Sections §10',
    title: 'The 56-guest payback baseline',
    lede: 'What it actually takes to self-fund the retainer.',
    body: <PaybackBaseline />,
  },
  {
    n: 18,
    from: 'Apex Sections §11',
    title: 'The case study arsenal',
    lede: 'The Tuesday hack — how sensory loops pre-sell the least elastic inventory a resort owns.',
    body: <CaseStudyArsenal />,
  },
  {
    n: 19,
    from: 'Apex Sections §12',
    title: 'The four-touchpoint timeline & suppression gate',
    lede: 'Every send at 7:00 AM local, and the rule that silences the middle two.',
    body: <TouchpointTimeline />,
  },
  {
    n: 20,
    from: 'Apex Sections §13',
    title: 'The dark social share loop',
    lede: 'The forward into the family group chat that no ad platform can follow.',
    body: <DarkSocialLoop />,
  },
  {
    n: 21,
    from: 'Apex Sections §15',
    title: 'The operational autopilot toggle',
    lede: 'A live switch, not a screenshot of one. Flip it.',
    body: <AutopilotSwitch />,
  },
  {
    n: 22,
    from: 'Apex Sections §16',
    title: 'The four-step production pipeline',
    lede: 'Fifteen seconds of staff effort, from curation to the guest’s phone.',
    body: <ProductionPipeline />,
  },
  {
    n: 23,
    from: 'Apex Sections §18',
    title: 'The sixteen production blueprints',
    lede: 'The same sixteen, printed in full rather than one modal at a time.',
    body: <ProductionBlueprints />,
  },
  {
    n: 24,
    from: 'Apex Sections §19',
    title: 'Lifecycle scope & handoff boundaries',
    lede: 'Where Welcome stops, and what picks the guest up next.',
    body: <LifecycleScope />,
  },
  {
    n: 25,
    from: 'Apex Sections §20',
    title: 'The $2,000,000 in-house fallacy',
    lede: 'The fixed annual overhead you are not taking on. The four widgets add up to the anchor.',
    body: <InHouseFallacy />,
  },
  {
    n: 26,
    from: 'Apex Sections §21',
    title: 'Three-tier pricing & the high-status CTA',
    lede: 'Territory is exclusive. The evaluation confirms availability before anything else.',
    body: <PriceTiers />,
  },
];
