/**
 * Every string and asset on the Hero Data Cards page. The hero is the live
 * Welcome hero (Top 1 · Cinematic Scrim) copied in, not imported, so nothing
 * here can move the live page; only the three data cards change between the
 * versions.
 *
 * The figures are locked: 2–5%, 15–25% and 5x, and no others.
 */

export const img = (name: string) => `/media/welcome/${name}`;

export const TOP = {
  headline: 'This Is the Single Largest Commercial Leak on Your P&L.',
  film: 'hero.mp4',
  poster: 'hero.jpg',
};

export const RIBBON = ['Oracle OPERA Cloud (OHIP REST API)', 'SynXis Middleware', 'Agilysys PMS', '0 Staff Drag Guarantee'];

/**
 * The VSL: the live page's executive film, now shown on its own with no card
 * round it, muted on a loop. 994 × 1920; Safari takes the HEVC, Chrome and
 * Firefox the WebM, anything else the H.264.
 */
export const VSL = {
  cta: 'Watch 90-second executive briefing',
  clip: 'hq/screen-tall.mp4',
  clipHevc: 'hq/screen-tall-hevc.mp4',
  clipWebm: 'hq/screen-tall.webm',
  poster: 'hq/screen-tall.jpg',
};

/** One hero card: the index, the figure in the time-label spot, the title and the line after it. */
export type Card = { n: string; fig: string; title: string; text: string };

const FREEDOM: Card = { n: '03', fig: '5x', title: 'Operational Freedom', text: 'Multiplies pre-arrival revenue with ZERO staff labor or IT drag.' };

export type Version = { id: string; n: number; name: string; note: string; cards: Card[] };

export const VERSIONS: Version[] = [
  {
    id: 'v1',
    n: 1,
    name: 'Navy Glass',
    note: 'Three separate rows of frosted dark navy glass, stacked close like the APEX Way rows: the figure white in the time-label column, the card title in light blue after the divider.',
    cards: [
      { n: '01', fig: '2–5%', title: 'The Status Quo Leak', text: "That's all your front desk converts when guests arrive tired." },
      { n: '02', fig: '15–25%', title: 'The APEX Conversion Lift', text: 'Data Driven Mobile Cinema converts while guests are still excited to arrive.' },
      FREEDOM,
    ],
  },
  {
    id: 'v2',
    n: 2,
    name: 'Light Frost Ledger',
    note: 'The three rows joined into one light frosted panel with hairline rules between them, like a single card holding the timeline; the figures in site blue, the text in ink.',
    cards: [
      { n: '01', fig: '2–5%', title: 'The Status Quo Leak', text: 'Upsells pitched at check-in hit guests at their most tired. Most say no.' },
      { n: '02', fig: '15–25%', title: 'The APEX Conversion Lift', text: 'Reach guests before arrival, right when buying intent peaks.' },
      FREEDOM,
    ],
  },
  {
    id: 'v3',
    n: 3,
    name: 'Blue Gradient Edge',
    note: 'Each row a translucent deep blue gradient, site blue fading into the Welcome night navy, with a thin light-blue accent edge on the left, the same edge as the VSL caption box on the live page.',
    cards: [
      { n: '01', fig: '2–5%', title: 'The Status Quo Leak', text: 'Wait for the front desk and almost every upsell is lost to a tired guest.' },
      { n: '02', fig: '15–25%', title: 'The APEX Conversion Lift', text: 'Data Driven Mobile Cinema wins the sale before they ever reach the desk.' },
      FREEDOM,
    ],
  },
];
