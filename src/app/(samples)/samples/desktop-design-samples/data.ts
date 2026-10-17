/**
 * Every string on the Desktop Design Samples page, verbatim from the brief. The
 * five layouts arrange this content; none of them adds copy of its own.
 *
 * Figures are not yet cleared by the fact checker, so each one carries a
 * `src` note rendered in the grey source-line style. Swap the note for the real
 * citation when it clears.
 */

export const img = (name: string) => `/media/welcome/${name}`;

/** The source line every uncleared figure carries. */
export const UNVERIFIED = 'Unverified · source pending';

/** The five layouts, for the jump menu and each option's label. */
export const OPTIONS = [
  { n: 1, name: 'Classic Stack' },
  { n: 2, name: 'Sticky Split' },
  { n: 3, name: 'Bento' },
  { n: 4, name: 'Triptych' },
  { n: 5, name: 'Flip Toggle' },
];

/* ---- Section 1 · top header & spine -------------------------------------- */

export const SPINE = {
  headline: 'The Silent 30-Day Window Between Booking & Check-In Is the Single Largest Commercial Leak on Your P&L.',
};

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

export type Stat = { fig: string; text: string; src: string };

export const OLD_WAY = {
  kick: 'Card A',
  title: 'The Old Way',
  attachment: 'Invoice_Rules_Terms.pdf',
  silence: '30 days of radio silence',
  result: [
    { fig: '2% to 5%', text: 'Check-In Conversion', src: UNVERIFIED },
    { fig: '85%-90%', text: 'Guest Dining Revenue Leaks Off-Site', src: UNVERIFIED },
  ] as Stat[],
};

export type Stream = { title: string; img: string };

export const APEX_WAY = {
  kick: 'Card B',
  title: 'The APEX Way',
  sub: '4K Mobile Cinema',
  streams: [
    { title: 'Voice greeting by name', img: 'hq/card-tall.jpg' },
    { title: "Chef's Tasting ASMR", img: 'm7-tall.jpg' },
    { title: 'Spa Yield', img: 'p2.jpg' },
    { title: 'Penthouse Upgrades', img: 'm6.jpg' },
  ] as Stream[],
  result: [
    { fig: '15% to 25%', text: 'Pre-Arrival Conversion', src: UNVERIFIED },
    { fig: '5x', text: 'Revenue Multiplier', src: 'Unverified · internal target only' },
    { fig: '95%', text: 'Open Rate', src: 'Unverified · source pending' },
    { fig: '0', text: 'Staff Drag', src: UNVERIFIED },
  ] as Stat[],
};
