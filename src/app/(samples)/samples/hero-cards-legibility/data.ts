/**
 * Every string and asset on the Hero Cards Legibility page. The hero is the
 * live Welcome hero (Gradient 1 · Cobalt Sweep) as it stands, copied in, not
 * imported; only the three cards' boxes change between the options.
 *
 * The cards carry only what the live cards already say: the same titles, the
 * same figures (5%, 25%, 5X) and the same lines, word for word. `key` is the
 * phrase an option may set in bold; it is a piece of the line, never new copy.
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

export type Card = { fig: string; title: string; text: string; key: string };

export const CARDS: Card[] = [
  { fig: '5%', title: 'Status Quo', text: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.', key: 'just 2% to 5%' },
  { fig: '25%', title: 'APEX Conversion', text: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.', key: '15% to 25%' },
  { fig: '5X', title: 'Operational Freedom', text: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.', key: 'ZERO staff labor or IT drag' },
];

export type Option = { id: 'o1' | 'o2' | 'o3'; n: number; name: string; note: string };

export const OPTIONS: Option[] = [
  {
    id: 'o1',
    n: 1,
    name: 'Ticker',
    note: 'The title static in caps, the figure anchored on the left, and the line running right to left across the box as a ticker that pauses on hover.',
  },
  {
    id: 'o2',
    n: 2,
    name: 'Statement',
    note: 'A big figure on the left and the line as a large statement of two to three lines beside it, its key phrase in bold.',
  },
  {
    id: 'o3',
    n: 3,
    name: 'Poster',
    note: 'Stacked like a poster: a very large figure with the title in caps beside it, and the line set large across the full card underneath.',
  },
];
