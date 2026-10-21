/**
 * Every string and asset the preview shows. The copy is the locked decision
 * log's, word for word; nothing else is written here. Ranges take the en dash
 * the live page uses. Figures still to be checked carry `pending: true` and are
 * shown with a PENDING CHECK tag.
 *
 * Media is the live Welcome page's (/media/welcome/), standing in until the
 * real cuts exist. Films load only when tapped, so the page itself weighs the
 * posters and nothing more.
 */

export const MEDIA = '/media/welcome/';
export const img = (name: string) => `${MEDIA}${name}`;

/** One tap-to-play film: an H.264 copy every browser plays, plus HEVC/WebM where they exist. */
export type Film = { title: string; len?: string; clip: string; hevc?: string; webm?: string; poster: string };

/* ---- Hero ------------------------------------------------------------------ */

export const HERO = {
  strip: { text: '73% say creator or influencer recommendations have influenced their booking decisions. Expedia Group, 2025 Traveler Value Index' },
  headline: 'Single Largest Commercial Leak',
  film: 'hero.mp4',
  poster: 'hero.jpg',
  /** The ticker boxes: `to` is what the count lands on, `suffix` follows it. */
  boxes: [
    { to: 5, suffix: '%', pending: false },
    { to: 25, suffix: '%', pending: false },
    { to: 5, suffix: 'x', pending: true },
  ],
  logos: [
    { key: 'oracle', name: 'Oracle', src: '/media/partners/oracle.svg', w: 76, h: 16 },
    { key: 'apex', name: 'Apex Hospitality' },
    { key: 'aven', name: 'Aven', src: '/media/partners/aven.png', w: 58, h: 25 },
  ],
  logoLine: "hotels use Aven's solutions",
};

/* ---- Section 1 · Why ------------------------------------------------------- */

export const WHY = {
  vsl: { title: 'Silent 30-Day Window', clip: 'hq/screen-tall.mp4', hevc: 'hq/screen-tall-hevc.mp4', webm: 'hq/screen-tall.webm', poster: 'hq/screen-tall.jpg' } as Film,
  callout: '141 pages in 45 days (Expedia)',
  cards: [
    { label: 'Dream', fig: '20–30%', line: 'more ancillary revenue per guest from pre-arrival offers' },
    { label: 'Likelihood', fig: '74%', line: 'of affluent travellers book after watching travel video' },
    { label: 'Time', fig: '99%', line: 'TripAdvisor' },
    { label: 'Effort', fig: '95%', line: 'open rate plus zero staff labour' },
  ],
  conversion: { apex: '15–25%', apexLab: 'pre-arrival', vs: 'vs', desk: '2–5%', deskLab: 'at the front desk' },
};

/* ---- Section 2 · What, part 1 --------------------------------------------- */

export const WHAT1 = {
  vsl: { title: 'Timing is Everything: The 4-Milestone Guest Journey', len: '1:15', clip: 'vsl.mp4', poster: 'vsl-poster.jpg' } as Film,
  rows: [
    { when: 'Day 1', what: 'welcome by name', img: 't2.jpg' },
    { when: '48h', what: 'dining', img: 'f6.jpg' },
    { when: '7 days', what: 'spa', img: 't9.jpg' },
    { when: '48h out', what: 'arrival and extensions', img: 't16.jpg' },
  ],
  trigger: 'triggered by OPERA/SynXis, sent by SMS/WhatsApp',
  phone: { img: 't9.jpg', button: 'Book a treatment' },
  films: {
    eye: 'The Four Films.',
    headline: 'Four Films, Four Moments. Every One Sells the Stay.',
    /** The round 2 mobile page's film for each touchpoint (upload order, still to be confirmed). */
    tiles: [
      { title: 'welcome by name', clip: 'hq/card.mp4', hevc: 'hq/card-hevc.mp4', poster: 'hq/card.jpg' },
      { title: 'dining', clip: 'hq/apex-reveal.mp4', poster: 'hq/apex-reveal.jpg' },
      { title: 'spa', clip: 'hq/screen.mp4', hevc: 'hq/screen-hevc.mp4', poster: 'hq/screen.jpg' },
      { title: 'arrival and extensions', clip: 'm9.mp4', poster: 'm9.jpg' },
    ] as Film[],
  },
};

/* ---- Section 3 · What, part 2 --------------------------------------------- */

export const WHAT2 = {
  vsl: { title: 'Real Staff Voice vs. AI Slop', len: '90s', clip: 'hq/apex-way.mp4', hevc: 'hq/apex-way-hevc.mp4', webm: 'hq/apex-way.webm', poster: 'hq/apex-way.jpg' } as Film,
  callout: '65% of US hotels are short-staffed (AHLA)',
  boxes: 4,
};
