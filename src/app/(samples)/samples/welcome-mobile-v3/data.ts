/**
 * Every string and asset the three hero options show. The copy is the live
 * Welcome hero's, exactly as it stands (header banner, StatTicker cards,
 * WorksAlongside bar); nothing here is new, reworded or re-verified.
 *
 * Media is the live hero's own: the APEX Way film that plays in its phone
 * (its captions are burned into the film) and the hero background still.
 */

export const MEDIA = '/media/welcome/';
export const img = (name: string) => `${MEDIA}${name}`;

export const BANNER = {
  text: '73% say creator or influencer recommendations have influenced their booking decisions. Expedia Group, 2025 Traveler Value Index',
  link: 'See the trends',
  /** the live header's target; a plain <a>, since it crosses out of (samples) */
  href: '/library',
};

export const HEADLINE = 'This Is the Single Largest Commercial Leak on Your P&L.';

/** The hero phone's film: 994 × 1920 with its sound track. Safari takes the HEVC, Chrome and Firefox the WebM, anything else the H.264. */
export const FILM = {
  clip: 'hq/apex-way.mp4',
  hevc: 'hq/apex-way-hevc.mp4',
  webm: 'hq/apex-way.webm',
  poster: 'hq/apex-way.jpg',
};

/** The hero's background still, for the options that want a photo. */
export const PHOTO = 'hero.jpg';

export const STATS = [
  { stat: '5%', label: 'Status Quo', copy: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.' },
  { stat: '25%', label: 'APEX Conversion', copy: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.' },
  { stat: '5X', label: 'Operational Freedom', copy: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.' },
];

export const PARTNERS = [
  { key: 'oracle', name: 'Oracle', logo: '/media/partners/oracle.svg', w: 76, h: 16, figure: '236', caption: 'countries & territories live' },
  { key: 'aven', name: 'Aven Hospitality', logo: '/media/partners/aven.png', w: 58, h: 25, figure: '35,000+', caption: "hotels use Aven's solutions" },
  { key: 'agilysys', name: 'Agilysys', logo: '/media/partners/agilysys.svg', w: 46, h: 26, figure: '4,000+', caption: 'properties worldwide' },
];

export const ALONGSIDE = {
  lead: 'Works alongside',
  line: 'Built to work alongside the systems your hotel already runs.',
  tail: 'Zero operational drag.',
};

/* ---- review chrome: the section index and the option switcher ------------- */

/** The four sections, each built three ways: /<key>-a, /<key>-b, /<key>-c. */
export const SECTIONS = [
  { n: '01', key: 'hero', label: 'Hero' },
  { n: '02', key: 'why', label: 'Why' },
  { n: '03', key: 'what1', label: 'What 1' },
  { n: '04', key: 'what2', label: 'What 2' },
];

export const OPTIONS = [
  { key: 'a', letter: 'A', name: 'Grid' },
  { key: 'b', letter: 'B', name: 'Billboard' },
  { key: 'c', letter: 'C', name: 'Glass' },
];

/* ---- Sections 1–3 ----------------------------------------------------------
   The locked decision log's copy, word for word, as on /samples/welcome-mobile-preview
   (copied, not imported). Ranges take the live page's en dash. Films load only
   when tapped. */

/** One film: an H.264 copy every browser plays, plus HEVC/WebM where they exist. */
export type Film = { title: string; len?: string; clip: string; hevc?: string; webm?: string; poster: string };

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
  eye: 'The Four Films.',
  headline: 'Four Films, Four Moments. Every One Sells the Stay.',
  /** One film per milestone, in the rows' order (the round 2 mobile page's mapping, still to be confirmed). */
  films: [
    { title: 'welcome by name', clip: 'hq/card.mp4', hevc: 'hq/card-hevc.mp4', poster: 'hq/card.jpg' },
    { title: 'dining', clip: 'hq/apex-reveal.mp4', poster: 'hq/apex-reveal.jpg' },
    { title: 'spa', clip: 'hq/screen.mp4', hevc: 'hq/screen-hevc.mp4', poster: 'hq/screen.jpg' },
    { title: 'arrival and extensions', clip: 'm9.mp4', poster: 'm9.jpg' },
  ] as Film[],
};

export const WHAT2 = {
  vsl: { title: 'Real Staff Voice vs. AI Slop', len: '90s', clip: 'hq/apex-way.mp4', hevc: 'hq/apex-way-hevc.mp4', webm: 'hq/apex-way.webm', poster: 'hq/apex-way.jpg' } as Film,
  callout: '65% of US hotels are short-staffed (AHLA)',
  /** No copy yet: shown as labelled placeholders. */
  boxes: ['Value box 1 · content pending', 'Value box 2 · content pending', 'Value box 3 · content pending', 'Value box 4 · content pending'],
};
