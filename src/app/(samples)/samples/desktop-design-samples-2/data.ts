/**
 * Every string on the Desktop Design Samples 2 page, verbatim from the briefs
 * (copied from round 1's data.ts, not imported). The
 * five layouts arrange this content; none of them adds copy of its own.
 *
 * Figures are not yet cleared by the fact checker, so each one carries a
 * `src` note rendered in the grey source-line style. Swap the note for the real
 * citation when it clears.
 */

export const img = (name: string) => `/media/welcome/${name}`;

/** The source line every uncleared figure carries. */
export const UNVERIFIED = 'Unverified · source pending';

/** The six options: three for the top of the section, three for the bottom. */
export const OPTIONS = [
  { id: 'top-1', group: 'Top', n: 1, name: 'Cinematic Scrim' },
  { id: 'top-2', group: 'Top', n: 2, name: 'Glass Panel' },
  { id: 'top-3', group: 'Top', n: 3, name: 'Editorial' },
  { id: 'bottom-1', group: 'Bottom', n: 1, name: 'Night' },
  { id: 'bottom-2', group: 'Bottom', n: 2, name: 'Paper' },
  { id: 'bottom-3', group: 'Bottom', n: 3, name: 'Ink' },
];

/** The top's headline, and the film that loops full bleed behind it (the live Welcome hero's placeholder). */
export const TOP = {
  headline: 'This Is the Single Largest Commercial Leak on Your P&L.',
  film: 'hero.mp4',
  /** A frame of the film, for while it loads and under reduced motion. */
  poster: 'hero.jpg',
};

/* ---- Section 1 · top header & spine -------------------------------------- */


export type DataPoint = { n: string; title: string; text: string; img: string; src: string };

export const DATA_POINTS: DataPoint[] = [
  {
    n: '01',
    title: 'The Status Quo Leak',
    text: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.',
    img: 'm9-tall.jpg',
    src: UNVERIFIED,
  },
  {
    n: '02',
    title: 'The APEX Conversion Lift',
    text: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.',
    img: 'm4-tall.jpg',
    src: UNVERIFIED,
  },
  {
    n: '03',
    title: 'Operational Freedom',
    text: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.',
    img: 'p27.jpg',
    src: 'Unverified · 5x is an internal target',
  },
];

export const RIBBON = ['Oracle OPERA Cloud (OHIP REST API)', 'SynXis Middleware', 'Agilysys PMS', '0 Staff Drag Guarantee'];

/* ---- Section 2 · main hero stage ------------------------------------------ */

export const VSL = {
  /** Panel A's label. */
  label: 'Executive VSL',
  cta: 'WATCH 90-SEC EXECUTIVE BRIEFING',
  /** The VSL runs 90 seconds across the 13-slide objection script. */
  seconds: 90,
  slides: 13,
  /** The slide the caption box is showing. */
  activeSlide: 9,
  focusKick: 'Active objection focus',
  focus: 'Dismantling Staff & IT Fears',
  poster: 'hq/screen-tall.jpg',
};

export const CONTRAST = { label: 'Them vs Us' };

/**
 * One expandable row on a contrast card. Card B's left value is the send
 * timing; Card A's is "never sent" (`num` left out). The source line shows as
 * the row's grey subline, so every figure's tag is visible without opening it.
 */
export type Row = { num?: string; unit: string; title: string; text: string; src: string };

export const OLD_WAY = {
  kick: 'Card A',
  title: 'The Old Way',
  /** The card's short headline: the live Welcome VSL headline, reused rather than written new. */
  headline: 'Your Revenue Walks Out the Door Before Your Guest Walks In.',
  subject: 'Thank you for your booking',
  attachment: 'Invoice_Rules_Terms.pdf',
  silence: '30 days of radio silence',
  rows: [
    {
      unit: 'Never sent',
      title: '380% Conversion Lift on High-Priced Inventory',
      text: 'Spiegel Research Center proved that visual social proof lifts online conversions by 270% on average, jumping to 380% on higher-priced luxury suite upgrades.',
      src: 'Spiegel / Northwestern · unverified',
    },
    {
      unit: 'Never sent',
      title: '68% of Pre-Arrival Upsell Revenue Driven by Suites',
      text: 'Industry upsell benchmarks show that premium room category upgrades represent the single largest ancillary revenue stream in hotel operations, accounting for over 68% of total pre-arrival upsell value.',
      src: 'Oaky Data · unverified',
    },
    {
      unit: 'Never sent',
      title: '4x Higher Conversion via Digital Touchpoints',
      text: 'Pre-arrival room upgrade offers delivered via personalized digital touchpoints generate 4x the conversion rate of generic confirmation email links or front-desk check-in pitches.',
      src: 'Canary Technologies · unverified',
    },
    {
      unit: 'Never sent',
      title: '60%+ Pre-Arrival Dining Decision Window',
      text: 'Over 60% of luxury hotel guests select and book their dining experiences prior to arrival or within their first 2 hours on property; failing to engage guests pre-arrival guarantees leakage to off-site competitors.',
      src: 'Cornell / OpenTable · unverified',
    },
  ] as Row[],
};

export const APEX_WAY = {
  kick: 'Card B',
  title: 'The APEX Way',
  /** One placeholder film on a muted loop, from the Bento Expand set; to be swapped. */
  clip: 'hq/card-tall.mp4',
  clipHevc: 'hq/card-tall-hevc.mp4',
  poster: 'hq/card-tall.jpg',
  rows: [
    { num: '24', unit: 'Hours', title: '2% to 5% at the Front Desk', text: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.', src: UNVERIFIED },
    { num: '48', unit: 'Hours', title: '15% to 25% Pre-Arrival Conversion', text: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.', src: UNVERIFIED },
    { num: '7', unit: 'Days', title: '5x Pre-Arrival Revenue', text: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.', src: 'Unverified · internal target only' },
    {
      num: '48',
      unit: 'Hours',
      title: '50% Lower Cancellation Rate',
      text: 'Direct guests engaged pre-arrival cancel at just 10.6%, compared to 21.8% for OTA bookers, stabilizing cash flow weeks in advance.',
      src: '10.6% Direct vs. 21.8% OTA, Cloudbeds, unverified',
    },
  ] as Row[],
};
