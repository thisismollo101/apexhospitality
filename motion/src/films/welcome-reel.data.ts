/*
 * Apex Welcome — hero reel. Built on the reference showreel: 128 BPM, cuts on
 * the beat, a HUD that never leaves.
 *
 * The story is the Welcome page hero, told one huge word or phrase at a time.
 * Each point keeps its own colour while its words slam through, with its own
 * shapes popping behind them; the full sentence runs small along the bottom
 * so nothing is lost. Beats are at 128 BPM (1 beat = 0.46875s).
 */
export const BPM = 128;

export const COL = {
  ink: '#0B0D12',
  paper: '#F4F4F0',
  blue: '#2A7BFF',
  orange: '#FF6A1F',
  yellow: '#FFD84A',
  white: '#FFFFFF',
};

export type Shape = 'triangle' | 'circle' | 'square' | 'plus';

/** One huge word or phrase. `tall` is the 9:16 line-break version; `fig` sets it as a figure. */
export type Word = { text: string; tall?: string; beats: number; fig?: boolean; accent?: boolean };

export type Point = {
  label: string;
  bg: string;
  fg: string;
  accent: string;
  shape: Shape; // the shape that wipes this point in, and the shapes that pop behind its words
  shapeCols: string[];
  sentence: string;
  words: Word[];
};

export const INTRO_BEATS = 4;
export const FIN_BEATS = 8;

export const POINTS: Point[] = [
  {
    label: '01 — THE LEAK',
    bg: COL.orange, fg: COL.ink, accent: COL.white, shape: 'triangle', shapeCols: [COL.ink, COL.white, COL.yellow],
    sentence: 'This is the single largest commercial leak on your P&L.',
    words: [
      { text: 'THIS IS THE', beats: 1 },
      { text: 'SINGLE', beats: 1 },
      { text: 'LARGEST', beats: 1 },
      { text: 'LEAK.', beats: 2, accent: true },
      { text: 'ON YOUR P&L.', tall: 'ON YOUR\nP&L.', beats: 2 },
    ],
  },
  {
    label: '02 — FRONT DESK',
    bg: COL.paper, fg: COL.ink, accent: COL.orange, shape: 'circle', shapeCols: [COL.blue, COL.orange, COL.yellow],
    sentence: 'Front desk check-in upsells convert at 2% to 5%.',
    words: [
      { text: 'FRONT DESK', tall: 'FRONT\nDESK', beats: 1.5 },
      { text: 'CHECK-IN UPSELLS', tall: 'CHECK-IN\nUPSELLS', beats: 1.5 },
      { text: 'CONVERT AT ONLY', tall: 'CONVERT\nAT ONLY', beats: 1 },
      { text: '2–5%', beats: 2.5, fig: true },
    ],
  },
  {
    label: '03 — MOBILE CINEMA',
    bg: COL.blue, fg: COL.white, accent: COL.yellow, shape: 'square', shapeCols: [COL.yellow, COL.white, COL.orange],
    sentence: 'Data Driven Mobile Cinema converts at 15% to 25%.',
    words: [
      { text: 'DATA DRIVEN', tall: 'DATA\nDRIVEN', beats: 1 },
      { text: 'MOBILE CINEMA', tall: 'MOBILE\nCINEMA', beats: 1.5 },
      { text: 'CONVERTS AT', tall: 'CONVERTS\nAT', beats: 1 },
      { text: '15–25%', beats: 2.5, fig: true },
    ],
  },
  {
    label: '04 — 5X',
    bg: COL.yellow, fg: COL.ink, accent: COL.blue, shape: 'circle', shapeCols: [COL.blue, COL.orange, COL.ink],
    sentence: '5x your pre-arrival revenue, with zero staff labor.',
    words: [
      { text: '5x', beats: 2, fig: true },
      { text: 'YOUR\nPRE-ARRIVAL\nREVENUE.', beats: 2 },
      { text: 'ZERO', beats: 1 },
      { text: 'STAFF', beats: 1 },
      { text: 'LABOR.', beats: 2, accent: true },
    ],
  },
  {
    label: '05 — APEX WELCOME',
    bg: COL.ink, fg: COL.paper, accent: COL.orange, shape: 'square', shapeCols: [COL.blue, COL.yellow, COL.orange],
    sentence: 'You’re in the right place.',
    words: [
      { text: 'YOU’RE IN THE', tall: 'YOU’RE\nIN THE', beats: 1 },
      { text: 'RIGHT PLACE.', tall: 'RIGHT\nPLACE.', beats: 2 },
      { text: 'WELCOME', beats: 2 },
    ],
  },
];

export const RING = 'APEX WELCOME · VIP GUEST SERVICES · HOSPITALITY · 2026 · ';
export const TITLE = ['APEX WELCOME', 'HERO REEL 2026'];
export const PRODUCT = 'Welcome';

export const POINT_BEATS = POINTS.map((p) => p.words.reduce((a, w) => a + w.beats, 0));
export const BEATS = INTRO_BEATS + POINT_BEATS.reduce((a, c) => a + c, 0) + FIN_BEATS;
export const BARS = Math.ceil(BEATS / 4);
