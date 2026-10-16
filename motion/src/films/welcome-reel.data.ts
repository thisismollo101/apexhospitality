/*
 * Apex Welcome — hero reel. Built on the structure of the 15s motion-design
 * showreel we were given as reference: 128 BPM, eight bars of four beats
 * (1.875s each), a hard colour change on every cut, a HUD that never leaves.
 *
 * The story is the Welcome page hero, word for word, with its figures. The
 * two conversion ranges carry the page's asterisk and source.
 */
export const BPM = 128;
export const BARS = 8;

export const COL = {
  ink: '#0B0D12', // near-black, the reference's #111 shifted toward our navy
  paper: '#F4F4F0',
  blue: '#2A7BFF',
  orange: '#FF6A1F',
  yellow: '#FFD84A',
  white: '#FFFFFF',
};

export const REEL = {
  title: ['APEX WELCOME', 'HERO REEL 2026'],
  sections: [
    '00 — INTRO',
    '01 — THE LEAK',
    '02 — CALCULATORS',
    '03 — FRONT DESK',
    '04 — MOBILE CINEMA',
    '05 — 5X',
    '06 — KINETIC',
    '07 — FIN',
  ],
  ring: 'APEX WELCOME · VIP GUEST SERVICES · HOSPITALITY · 2026 · ',

  leak: { kicker: 'THIS IS THE SINGLE LARGEST', words: ['COMMERCIAL', 'LEAK'], italic: 'on your P&L.', tagL: 'N° 01', tagR: 'THE LEAK' },

  calc: {
    title: 'Four ways to plug the leak.',
    note: 'SAME GUEST · FOUR MOMENTS',
    rows: [
      { n: '01', label: 'COMBAT OTAs', ease: 'expo-out' },
      { n: '02', label: 'DINING', ease: 'back-out' },
      { n: '03', label: 'SPA', ease: 'elastic' },
      { n: '04', label: 'SUITE UPGRADES', ease: 'bounce' },
    ],
  },

  desk: { pre: 'FRONT DESK CHECK-IN UPSELLS CONVERT AT', fig: '2–5%' },
  cinema: { pre: 'DATA DRIVEN MOBILE CINEMA CONVERTS AT', fig: '15–25%' },
  source: '* BOOKINGWHIZZ / AKIA · PENDING VERIFICATION',
  five: { fig: '5x', lines: ['Your pre-arrival revenue,', 'with zero staff labor.'] },

  kinetic: ['ZERO', 'LABOR.', 'WELCOME', 'RIGHT PLACE.'],

  fin: { line: 'A personal film for every guest who books.', meta: ['APEX WELCOME', 'VIP GUEST SERVICES', 'APEXHOSPITALITY.ONLINE'], tags: ['WELCOME', 'VIP GUEST SERVICES'] },
};
