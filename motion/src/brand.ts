import '@fontsource-variable/inter/wght.css';

/*
 * The site's tokens, restated for video. Same palette as v34 + globals.css —
 * nothing here is new, only copied, because a Remotion bundle cannot import
 * the Next app's CSS.
 */
/* Inter, bundled from @fontsource so renders need no network. */
export const INTER = "'Inter Variable', Inter, sans-serif";

export const C = {
  ink: '#06080F', // the near-black ApexMark flattens onto
  blue: '#2A7BFF', // --brandblue
  white: '#FFFFFF',
  muted: 'rgba(255,255,255,.72)',
  line: 'rgba(255,255,255,.22)',
};

/* The mark's three faces on its 100×100 grid, and their fixed opacities. */
export const FACES = [
  { points: '50,11 9,85 50,63', opacity: 0.45 }, // left
  { points: '50,11 91,85 50,63', opacity: 1 }, // right
  { points: '9,85 91,85 50,63', opacity: 0.22 }, // base
] as const;

/* --ease from v34, as a cubic-bezier for Remotion's Easing.bezier. */
export const EASE = [0.2, 0.7, 0.2, 1] as const;
