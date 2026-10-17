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
  /** The card's short headline: the live Welcome VSL headline, reused rather than written new. */
  headline: 'Your Revenue Walks Out the Door Before Your Guest Walks In.',
  subject: 'Thank you for your booking',
  attachment: 'Invoice_Rules_Terms.pdf',
  silence: '30 days of radio silence',
  result: [
    { fig: '2% to 5%', text: 'Check-In Conversion', src: UNVERIFIED },
    { fig: '85%-90%', text: 'Guest Dining Revenue Leaks Off-Site', src: UNVERIFIED },
  ] as Stat[],
};

/**
 * Card B's four rows. Title, countdown, message and reply chip are the What
 * Works list's own (welcome-mobile-options-2/data.ts, MILESTONES), verbatim;
 * only the left-hand value is the send timing instead of a date. "days to
 * arrival" is 30 minus the send day, as there.
 */
export type Touch = { num: string; unit: string; title: string; sub: string; msg: string; chip: string };

const daysLeft = (day: number) => `${30 - day} days to arrival`;

export const APEX_WAY = {
  kick: 'Card B',
  title: 'The APEX Way',
  /** One placeholder film on a muted loop, from the Bento Expand set; to be swapped. */
  clip: 'hq/card-tall.mp4',
  clipHevc: 'hq/card-tall-hevc.mp4',
  poster: 'hq/card-tall.jpg',
  touches: [
    { num: '24', unit: 'Hours', title: 'Welcome by name', sub: daysLeft(1), msg: "Good morning, Sarah. It's Maya at the front desk. See you on the 2nd.", chip: 'See the Ocean Suite' },
    { num: '48', unit: 'Hours', title: 'Dining, in close-up', sub: daysLeft(3), msg: 'Chef Aris is plating something new. Your terrace table is waiting.', chip: "Reserve the chef's table" },
    { num: '7', unit: 'Days', title: 'Spa, matched to open hours', sub: daysLeft(23), msg: 'Three treatment hours are still open during your stay.', chip: 'Book a treatment' },
    { num: '48', unit: 'Hours', title: 'Arrival and extensions', sub: daysLeft(28), msg: 'Your driver will meet you at arrivals. Want your room ready early?', chip: 'Add early check-in' },
  ] as Touch[],
};
