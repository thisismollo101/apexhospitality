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
  /** The same headline in the two lines it already breaks into on the live page. */
  lines: ['This Is the Single Largest', 'Commercial Leak on Your P&L.'],
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

/**
 * One hero card: the figure in the time-label spot, then the title and the
 * line after it. The figure is split at its range so the dash can be drawn
 * short with a little room either side; `to` is how it reads aloud.
 */
export type Card = { fig: [string] | [string, string]; title: string; text: string | [string, string] };

/** The three cards, the same in every option: the live page's lines, with no asterisks, sources or tags. */
export const CARDS: Card[] = [
  { fig: ['2%', '5%'], title: 'Status Quo', text: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.' },
  { fig: ['15%', '25%'], title: 'APEX Conversion', text: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.' },
  { fig: ['5X'], title: 'Operational Freedom', text: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.' },
];

/**
 * The three options: Version 3 (Blue Gradient Edge) each time, differing in the
 * cards' gradient. An option can also set its own headline lines and cards:
 * Gradient 1 does (Aidan, 18 Oct), with each card's line, word for word, set
 * on two lines broken where the top runs a little longer than the bottom.
 */
export type Option = { id: string; n: number; name: string; note: string; lines?: string[]; cards?: Card[] };

export const OPTIONS: Option[] = [
  {
    id: 'g1',
    n: 1,
    name: 'Cobalt Sweep',
    note: 'Site blue from the accent edge, held to the middle of the card before it deepens into the Welcome navy on the right. The headline on three lines, one figure per card, each line on two, and the group 15% smaller with the card text kept at its size.',
    lines: ['This Is the Single', 'Largest Commercial', 'Leak on Your P&L.'],
    cards: [
      { fig: ['5%'], title: 'Status Quo', text: ['Front desk check-in upsells convert at just', '2% to 5% when guests arrive tired.'] },
      { fig: ['25%'], title: 'APEX Conversion', text: ['Data Driven Mobile Cinema converts at', '15% to 25% during pre-arrival intent.'] },
      { fig: ['5X'], title: 'Operational Freedom', text: ['Multiplies pre-arrival revenue by 5x', 'with ZERO staff labor or IT drag.'] },
    ],
  },
  {
    id: 'g2',
    n: 2,
    name: 'Midnight Rise',
    note: 'The other way round: Welcome navy at the accent edge, rising to site blue by the middle and staying blue to the right edge.',
  },
  {
    id: 'g3',
    n: 3,
    name: 'Centre Glow',
    note: 'Welcome navy at both ends, with a lit site-blue glow in the middle of the card, behind the line.',
  },
];
