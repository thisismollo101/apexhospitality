/**
 * Every string and asset on the Hero Ticker Options page. The hero is the
 * live Welcome hero (Gradient 1 · Cobalt Sweep) as it stands, copied in, not
 * imported; only the three cards' boxes change between the options.
 *
 * The cards carry only what the live cards already say: the same titles, the
 * same figures (5%, 25%, 5X) and the same lines, word for word.
 */

export const img = (name: string) => `/media/welcome/${name}`;

export const TOP = {
  /** The live hero's three lines. */
  lines: ['This Is the Single', 'Largest Commercial', 'Leak on Your P&L.'],
  film: 'hero.mp4',
  poster: 'hero.jpg',
};

/** The VSL phone's film, as live. */
export const VSL = {
  cta: 'Watch 90-second executive briefing',
  clip: 'hq/screen-tall.mp4',
  clipHevc: 'hq/screen-tall-hevc.mp4',
  clipWebm: 'hq/screen-tall.webm',
  poster: 'hq/screen-tall.jpg',
};

export type Card = { fig: string; title: string; text: string };

export const CARDS: Card[] = [
  { fig: '5%', title: 'Status Quo', text: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.' },
  { fig: '25%', title: 'APEX Conversion', text: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.' },
  { fig: '5X', title: 'Operational Freedom', text: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.' },
];

/** Motion's three ticker designs for the card box (21 Oct). */
export type Option = { id: 't1' | 't2' | 't3'; n: number; name: string; note: string };

export const OPTIONS: Option[] = [
  {
    id: 't1',
    n: 1,
    name: 'Three tapes',
    note: 'The three blue cards as now, each with its figure locked on the left, the caps label above, and the line running as a ticker.',
  },
  {
    id: 't2',
    n: 2,
    name: 'One rail',
    note: 'One blue box with three lanes: each figure on a solid blue plate, each line running through a dark LED-style strip.',
  },
  {
    id: 't3',
    n: 3,
    name: 'Big numbers',
    note: 'Oversized figures on the left, each caps label marked with a dot, and each line rolling through a rounded pill track.',
  },
];
