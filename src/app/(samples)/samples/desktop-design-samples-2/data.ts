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
  { id: 'bottom-1', group: 'Bottom', n: 1, name: 'Joined Cards' },
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

export const CONTRAST = { label: 'Them vs Us', title: 'The Cold Receipt & Stolen Budget' };

/**
 * One of Card B's expandable rows: the send timing on the outer edge, the
 * title, and the source line, which shows only once the row is open.
 */
export type Row = { num: string; unit: string; title: string; text: string; src: string };

export const OLD_WAY = {
  kick: 'Card A',
  /** Bottom 1's pill, above the phone. */
  pill: 'The Wrong Way',
  title: 'The Old Way',
  headline:
    "While you send cold email receipts and 30 days of radio silence, off-site competitors are stealing your guest's dining and spa budget.",
  /** Bottom 1's heading. */
  quote: "Thirty days of radio silence surrenders your guest's dining and spa budget off-site.",
  /** The phone: a plain reminder text, as in Aidan's reference screenshot. */
  sms: {
    kind: 'Text Message',
    when: 'Today 9:29AM',
    body: 'Hi Alex, this is a reminder of your reservation at our hotel on March 15. Your check-in time is 3:00 PM. Please confirm your arrival by replying YES or call us at 123-456-7890 if you need to make any changes.',
    input: 'Text message',
  },
  /**
   * The month from booking to check-in, the What Works calendar's own
   * (welcome-mobile-options-2): Monday-first, booked Mon 3 Nov, arrival Tue
   * 2 Dec, "days to arrival" counted from Day 1. On the Old Way every one of
   * the 30 days is empty: nothing is sent.
   */
  calendar: { kick: 'Booking to check-in', left: '29 days to arrival', start: Date.UTC(2025, 10, 3), days: 30 },
};

export const APEX_WAY = {
  kick: 'Card B',
  /** Bottom 1's pill, above the phone. */
  pill: 'The APEX Way',
  title: 'The APEX Way',
  headline: 'Apex Welcome captures their spend commitment while excitement is at its absolute peak, locking in 5x more pre-arrival cash.',
  /** Bottom 1's heading (Bottoms 2 and 3 keep the headline above). */
  quote: 'Apex Welcome strikes at peak excitement, locking in 5x more pre-arrival spend before check-in.',
  /**
   * One placeholder film from the Bento Expand set, to be swapped; it has a
   * sound track, for the unmute button. Safari takes the HEVC master; Chrome
   * and Firefox the WebM (VP9 + Opus); anything else the H.264 copy.
   */
  clip: 'hq/card-tall.mp4',
  clipHevc: 'hq/card-tall-hevc.mp4',
  clipWebm: 'hq/card-tall.webm',
  poster: 'hq/card-tall.jpg',
  rows: [
    {
      num: '24',
      unit: 'Hours',
      title: '380% Conversion Lift on High-Priced Inventory',
      text: 'Spiegel Research Center proved that visual social proof lifts online conversions by 270% on average, jumping to 380% on higher-priced luxury suite upgrades.',
      src: 'Spiegel / Northwestern, unverified',
    },
    {
      num: '48',
      unit: 'Hours',
      title: '4x Higher Conversion via Digital Touchpoints',
      text: 'Pre-arrival room upgrade offers delivered via personalized digital touchpoints generate 4x the conversion rate of generic confirmation email links or front-desk check-in pitches.',
      src: 'Canary Technologies, unverified',
    },
    {
      num: '7',
      unit: 'Days',
      title: '60%+ Pre-Arrival Dining Decision Window',
      text: 'Over 60% of luxury hotel guests select and book their dining experiences prior to arrival or within their first 2 hours on property; failing to engage guests pre-arrival guarantees leakage to off-site competitors.',
      src: 'Cornell / OpenTable, unverified',
    },
    {
      num: '48',
      unit: 'Hours',
      title: '50% Lower Cancellation Rate',
      text: 'Direct guests engaged pre-arrival cancel at just 10.6%, compared to 21.8% for OTA bookers, stabilizing cash flow weeks in advance.',
      src: 'Cloudbeds, unverified',
    },
  ] as Row[],
};
