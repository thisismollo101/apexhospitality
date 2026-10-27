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

export const SECTIONS = [
  { n: '01', label: 'Hero', live: true },
  { n: '02', label: 'Why', live: false },
  { n: '03', label: 'What · 1', live: false },
  { n: '04', label: 'What · 2', live: false },
];

export const OPTIONS = [
  { slug: 'hero-a', letter: 'A', name: 'Grid' },
  { slug: 'hero-b', letter: 'B', name: 'Billboard' },
  { slug: 'hero-c', letter: 'C', name: 'Glass' },
];
