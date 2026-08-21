import products from '@/data/products.json';
import { breadcrumbs } from '@/lib/nav';

/**
 * Everything Welcome Page Two says, in one file.
 *
 * The page itself holds no copy. Swapping the hero clip, the marquee reel or
 * the four featured products is an edit here and nowhere else — which is also
 * how the placeholder media gets replaced once the real footage lands.
 *
 * This module is imported by page.tsx only, never by a client component:
 * products.json carries all eighteen products and none of it should cross into
 * the browser bundle. page.tsx passes the four it needs down as props.
 */

/* ---- 1. hero ------------------------------------------------------------- */

export const HERO = {
  /** Resolves to /media/cards/welcome.{webm,mp4} with welcome.jpg as the poster. */
  clip: 'welcome',
  tag: 'Section 1',
  headline: 'The property sold itself. The confirmation email undid it.',
  subhead:
    'Everything between booking and arrival is a black box your guest fills in themselves. We fill it in for them, in film.',
  cta: '[ Observe Emotion ]',
  ctaHref: '#s2',
};

/* ---- 2. the particle field ----------------------------------------------- */

/**
 * No written heading. The lockup sits at the bottom instead — the mark
 * assembling itself is the argument, and a sentence over it competes.
 */
export const FIELD = {
  tag: 'Section 2',
};

/* ---- 3. latest posts ----------------------------------------------------- */

/**
 * The marquee reel. Seven clips, and the track renders the set twice so the
 * translateX(-50%) loop closes on itself — see PostsMarquee.
 *
 * Placeholder footage: these are the card clips the rest of the site already
 * ships. Real 9:16 posts drop in by replacing the names here once the files
 * exist at /media/cards/<name>.{webm,mp4,jpg}.
 */
export const POSTS: { clip: string; label: string }[] = [
  { clip: 'welcome', label: 'The welcome film' },
  { clip: 'flagship', label: 'Flagship — the digital storefront' },
  { clip: 'accommodation', label: 'Suites and villas, unedited' },
  { clip: 'dining', label: 'The dining room at service' },
  { clip: 'weddings', label: 'A wedding, day one to day two' },
  { clip: 'corporate', label: 'Corporate and incentive events' },
  { clip: 'international', label: 'International reach' },
];

/* ---- 4. featured products ------------------------------------------------ */

export type Feature = {
  href: string;
  label: string;
  tier: string;
  /** Card face + the panel's large graphic. Placeholder kit until real stills land. */
  image: string;
  concept: string;
  math: string;
  quote: string;
};

/**
 * Four of the eighteen, read out of products.json rather than restated — the
 * concept, math and quote fields already carry this copy and there is no second
 * version of it to drift. Labels come from navigation.json through breadcrumbs(),
 * so a rename in the nav tree follows through here on its own.
 */
const FEATURED_HREFS = [
  '/products/signature-films/flagship',
  '/products/signature-films/anthem',
  '/products/billboards/accommodation',
  '/products/specialized-venues/weddings',
];

type ProductEntry = { tier: string; concept: string; math: string; quote: string };
const catalogue = products as Record<string, ProductEntry>;

export const FEATURES: Feature[] = FEATURED_HREFS.map((href, i) => {
  const p = catalogue[href];
  return {
    href,
    label: breadcrumbs(href).at(-1)?.label ?? href,
    tier: p.tier,
    image: `/media/samples/4x3/${i + 1}.jpg`,
    concept: p.concept,
    math: p.math,
    quote: p.quote,
  };
});
