/*
 * Copy, figures and colours for the Apex Welcome ad — the 15s motion hero
 * for /products/vip-guest-services/welcome. 128 BPM, 32 beats: six figure
 * sections of 4 beats, then an 8-beat end card.
 *
 * Every figure is one the Welcome page already shows, with the same source.
 * `star` marks the ones the page flags as unverified; keep the two in step.
 */
export const BPM = 128;

export const COL = {
  ink: '#06080F',
  blue: '#2A7BFF',
  white: '#FFFFFF',
  orange: '#FF6A1F',
  yellow: '#FFD84A',
};

export type Shape = 'circle' | 'square' | 'triangle';

export type Section = {
  label: string;
  bg: string;
  fg: string;
  accent: string;
  shape: Shape; // the shape that grows out to open this section
  /** The figure counts from `from` to each `to` in order: [lo] or [lo, hi]. */
  fig: { to: number[]; unit: string; prefix?: string; star?: boolean };
  lines: string[]; // kinetic caption, one entry per line
  source?: string;
  graphic: 'ring' | 'slowbar' | 'fastbar' | 'plates' | 'phone' | 'stack';
  ease: { name: string; bez: [number, number, number, number] };
};

export const SECTIONS: Section[] = [
  {
    label: 'THE LEAK',
    bg: COL.ink, fg: COL.white, accent: COL.orange, shape: 'circle',
    fig: { to: [52], unit: '%' },
    lines: ['of travellers abandoned', 'a direct booking last year.'],
    source: 'SiteMinder Changing Traveller Report 2025',
    graphic: 'ring',
    ease: { name: 'ease-out', bez: [0, 0, 0.58, 1] },
  },
  {
    label: 'THE FRONT DESK',
    bg: COL.white, fg: COL.ink, accent: COL.ink, shape: 'square',
    fig: { to: [2, 5], unit: '%', star: true },
    lines: ['is what upsells convert', 'at check-in.'],
    source: 'BookingWhizz / Akia. Pending verification.',
    graphic: 'slowbar',
    ease: { name: 'linear', bez: [0, 0, 1, 1] },
  },
  {
    label: 'APEX WELCOME',
    bg: COL.blue, fg: COL.white, accent: COL.yellow, shape: 'triangle',
    fig: { to: [15, 25], unit: '%', star: true },
    lines: ['is what a personal film', 'converts before arrival.'],
    source: 'BookingWhizz / Akia. Pending verification.',
    graphic: 'fastbar',
    ease: { name: 'expo-out', bez: [0.16, 1, 0.3, 1] },
  },
  {
    label: 'DINING',
    bg: COL.orange, fg: COL.ink, accent: COL.white, shape: 'circle',
    fig: { to: [85, 90], unit: '%' },
    lines: ['of guests eat dinner', 'somewhere else.'],
    source: 'CBRE Americas / Regulr',
    graphic: 'plates',
    ease: { name: 'ease-in-out', bez: [0.42, 0, 0.58, 1] },
  },
  {
    label: 'PERSONAL',
    bg: COL.ink, fg: COL.white, accent: COL.yellow, shape: 'square',
    fig: { to: [4], unit: 'x', star: true },
    lines: ['the conversion of a welcome', 'by name over a generic email.'],
    source: 'Canary Technologies. Pending verification.',
    graphic: 'phone',
    ease: { name: 'back-out', bez: [0.34, 1.56, 0.64, 1] },
  },
  {
    label: 'THE RESULT',
    bg: COL.yellow, fg: COL.ink, accent: COL.blue, shape: 'triangle',
    fig: { to: [5], unit: 'x' },
    lines: ['your pre-arrival revenue.', 'Zero staff labour.'],
    graphic: 'stack',
    ease: { name: 'apex', bez: [0.2, 0.7, 0.2, 1] },
  },
];

export const END = {
  label: 'APEX WELCOME',
  product: 'Welcome',
  line: 'A personal film for every guest who books.',
  url: 'apexhospitality.online',
};
