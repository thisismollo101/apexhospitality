/**
 * Every string on the Apex Welcome landing page, in one file.
 *
 * The wireframe (v4) is the source of truth for this page and it is dense with
 * numbers — $121,500 of monthly leakage, 270% conversion, 16% LTV. Those need to
 * agree wherever they appear, and the calculator in Section 5 has to derive the
 * same figures the VSL quotes in Section 1B rather than restate them. Keeping
 * the copy out of the components is what makes that checkable.
 *
 * Clip names refer to public/media/cards. They are the hospitality footage the
 * repo already ships, standing in until the real per-section assets land.
 */

/* ---- Section 1: hero ---------------------------------------------------- */

export const HERO = {
  eyebrow: 'Your physical asset is a $10M masterpiece.',
  headline: 'Why is your pre-arrival experience still a plain-text receipt?',
  subhead:
    'Stop letting the “30-Day Pre-Arrival Dead Zone” bleed your high-margin revenue. Reclaim your direct booking authority, eliminate the OTA commission tax, and establish immediate telepresence before your guest ever sets foot on property.',
  narrative:
    'Standard confirmation workflows rely on clinical, text-heavy PDFs and sterile automated emails, creating an “uncertainty tax.” Lacking vertical visual proof of room reality — closet layouts, bed positioning, balcony views — guests exit to OTAs or TripAdvisor for secondary verification, costing you a brutal 15% to 30% commission tax to buy back the guest you already had.',
  primaryCta: 'Reclaim direct revenue',
  secondaryCta: 'Watch executive VSL',
};

export type Suite = { name: string; clip: string; still: string; motion: string };

/** Section 1's side-by-side carousel: the same room, dead and alive. */
export const SUITES: Suite[] = [
  {
    name: 'Presidential Ocean Suite',
    clip: 'accommodation',
    still: 'A flat, wide-angle JPEG. Beautiful, silent, and unverifiable — the guest cannot tell where the bed faces or what the balcony actually overlooks.',
    motion:
      'The same space in 4K. Morning sunlight drifts across the bed linens, water ripples in the private balcony pool, and typography floats over the frame.',
  },
  {
    name: 'Cliffside Sanctuary',
    clip: 'flagship',
    still: 'Static photography crops out the approach, the drop, and the scale — the three things a high-net-worth traveler is actually buying.',
    motion:
      'A continuous move from the threshold to the edge, so the guest reads the elevation and the privacy in one unbroken shot.',
  },
  {
    name: 'Honeymoon Garden Villa',
    clip: 'weddings',
    still: 'A gallery of stills makes a couple assemble the villa in their head, and doubt fills whatever the frame leaves out.',
    motion:
      'Bougainvillea moving in real air, the plunge pool catching light, the tasting table set — telepresence instead of inference.',
  },
];

export const COMPARE = {
  caption:
    'Traditional images trigger zero anticipation and leave room configurations entirely unverified.',
  subPlayer:
    'When your physical asset is represented online by static 2D images, high-intent guests exit to Booking.com to find video reviews — costing you 15% to 30% in direct commission leakage. Apex Welcome installs the visual infrastructure to reclaim it.',
  cta: 'Observe the specimen in motion',
};

/* ---- Section 1B: the four-part VSL matrix ------------------------------- */

export type Chapter = {
  tab: string;
  title: string;
  clip: string;
  hook: string;
  narrative: string;
  metric: { value: string; label: string };
};

export const CHAPTERS: Chapter[] = [
  {
    tab: 'What is it',
    title: 'The 15% OTA commission tax exposure',
    clip: 'welcome',
    hook: 'Most luxury hotels spend $10 million on physical marble and gardens, then let their digital storefront sit completely silent.',
    narrative:
      'In 2026, travel social video shelf life has dropped to under 11 days, which makes a once-a-year commercial shoot active business negligence. Shifting bookings from OTAs back to direct channels recovers over $15,000 to $20,000 annually per room category, making the entire system self-funding.',
    metric: { value: '$15k–$20k', label: 'Recovered annually per room category' },
  },
  {
    tab: 'Why it matters',
    title: 'The $10M masterpiece versus silent postcards',
    clip: 'accommodation',
    hook: 'Your highest-margin luxury suites are sitting empty because wealthy travelers don’t trust your wide-angle photography.',
    narrative:
      'With over 2.7 million fake reviews removed by TripAdvisor in 2024 alone, modern travelers demand unedited vertical micro-tours showing the actual bedroom layout, wardrobe space and balcony views. That proof triggers telepresence and raises suite conversions by up to 270%.',
    metric: { value: '270%', label: 'Lift in suite conversion' },
  },
  {
    tab: 'What’s involved',
    title: 'The three core pillars',
    clip: 'dining',
    hook: 'Most GMs believe the five-star experience starts in the lobby. But the high-anxiety gap between booking and arrival is where guest retention is won or lost.',
    narrative:
      'Price resistance is bypassed pre-arrival with three pillars: the 200ms visual “stun gun,” sensory ASMR that drives 25% higher on-site spend on autopilot, and screenshot-ready “Easter egg” loyalty QR codes that gamify returning direct bookings.',
    metric: { value: '+25%', label: 'On-site ancillary spend' },
  },
  {
    tab: 'How to use it',
    title: 'Turnkey deployment and risk reversal',
    clip: 'corporate',
    hook: 'We do not run standardized sales meetings. Instead, we initiate our partnerships with an asset-compatibility study.',
    narrative:
      'A turnkey four-day on-site cinematic footprint with zero database integration. Staff spend under 15 seconds recording morning huddle voice notes. Backed by a six-month contract exit clause — you keep every asset — and a $5,000 setup deposit rolled forward as full credit.',
    metric: { value: '4 days', label: 'On-site footprint, zero integration' },
  },
];

/* ---- Section 2: guest-facing demographic modules ------------------------ */

export type Module = { segment: string; frame: string; clip: string; body: string; beats: string[] };

export const MODULES: Module[] = [
  {
    segment: 'Individual',
    frame: 'Rest & work',
    clip: 'flagship',
    body: 'Targets solo executives protective of productivity and peace, replacing sterile local guides with spatial workspace proof.',
    beats: ['Workspace POV', 'Sound bath ASMR', 'Nature trail'],
  },
  {
    segment: 'Couple',
    frame: 'Romance & luxury',
    clip: 'weddings',
    body: 'Drives luxury weekend bookings and high-yield private dining upsells before the guest has packed.',
    beats: ['Honeymoon villa', 'Champagne cork pop ASMR', 'Tasting table'],
  },
  {
    segment: 'Family',
    frame: 'Experiential resorting',
    clip: 'accommodation',
    body: 'Eliminates parental anxiety on child safety and logistics by showing the rooms and routes as they actually are.',
    beats: ['Secure family suite & balcony', 'Rabbit Cafe', 'Waterfall trail'],
  },
  {
    segment: 'MICE & Weddings',
    frame: 'The buyout',
    clip: 'corporate',
    body: 'Compresses corporate sales cycles from weeks to minutes by delivering immediate spatial proof of the whole property.',
    beats: ['Grand foyer greeting', 'Boardroom screen descent', 'Golf drone sweep'],
  },
];

/* ---- Section 3: the four-touchpoint cadence ----------------------------- */

export type Touchpoint = {
  n: number;
  when: string;
  time: string;
  title: string;
  body: string;
  explainerClip: string;
  exampleClip: string;
};

export const TOUCHPOINTS: Touchpoint[] = [
  {
    n: 1,
    when: '24–36h post-booking',
    time: '7:00 AM',
    title: 'The handshake',
    body: 'Confirms the booking, eliminates buyer’s remorse, establishes elite visual authority and introduces the key staff contact.',
    explainerClip: 'welcome',
    exampleClip: 'flagship',
  },
  {
    n: 2,
    when: '48h post-booking',
    time: '7:00 AM',
    title: 'Intro to Atlas',
    body: 'Invites the guest into Apex Atlas — the dedicated secondary Instagram visual guide for native suite and path exploration.',
    explainerClip: 'international',
    exampleClip: 'accommodation',
  },
  {
    n: 3,
    when: '7 days pre-arrival',
    time: '7:00 AM',
    title: 'The pre-arrival teaser & spa',
    body: 'Builds deep anticipation and presents sensory-rich offers — heated basalt spa sessions, private dining — using the visual stun gun.',
    explainerClip: 'dining',
    exampleClip: 'weddings',
  },
  {
    n: 4,
    when: '48h pre-arrival',
    time: '7:00 AM',
    title: 'Arrival pass & upgrades',
    body: 'Solves packing anxiety with final logistics — weather, directions — paired with high-margin upsells: airport transfer, private butler, beach cabana.',
    explainerClip: 'corporate',
    exampleClip: 'dining',
  },
];

export const SUPPRESSION =
  'Smart suppression gate — for booking windows under three days, touchpoints suppress automatically to prevent guest spam and maintain brand posture.';

export const DARK_SOCIAL = {
  shareFrame:
    'Feel free to share this clip with your travel companions or family. Show them how a luxury stay should start: “Now THAT is how you welcome a guest!”',
  bubble: 'Your suite at Cliffside is ready — look at this 👀',
  stats: [
    ['16%', 'Higher customer lifetime value'],
    ['18%', 'Lower churn rate'],
    ['3–5×', 'Conversion versus ad-driven traffic'],
  ] as [string, string][],
  note: 'Over 80% of travel sharing happens inside dark social channels — WhatsApp, DMs, SMS — where no ad platform can follow it.',
};

/* ---- Section 4: operational mechanics ----------------------------------- */

export const STEPS: [string, string][] = [
  ['Pick assets', 'GMs select room and amenity clips from their centralized library. Updated weekly or monthly.'],
  ['Record audio', 'Staff record the guest’s name in 15 seconds during the standard morning huddle, on the tablet.'],
  ['Apex 365 model', 'The engine clones and translates that voice natively into 30+ guest languages with perfect lip-sync.'],
  ['Deliver', 'Webhooks deliver direct to the guest by SMS or WhatsApp. No database integration.'],
];

export const AUTOPILOT =
  'On high-volume check-in days — 200+ arrivals — management toggles Auto-Pilot with a single click. Personalized voice notes are instantly replaced with a pre-rendered executive GM greeting, while personalized text overlays are fully preserved.';

/* ---- Section 5: the calculator ------------------------------------------ */

export type Field = { key: string; label: string; hint: string; min: number; max: number; step: number; unit: '$' | '%' | '' };

export const FIELDS: Field[] = [
  { key: 'rooms', label: 'Room inventory', hint: 'R', min: 20, max: 600, step: 5, unit: '' },
  { key: 'adr', label: 'Average daily rate', hint: 'ADR', min: 100, max: 2000, step: 25, unit: '$' },
  { key: 'occ', label: 'Occupancy', hint: 'Occ%', min: 30, max: 100, step: 1, unit: '%' },
  { key: 'ota', label: 'OTA share of bookings', hint: 'OTA%', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'comm', label: 'Average OTA commission', hint: 'Comm%', min: 5, max: 30, step: 1, unit: '%' },
];

/** The wireframe's worked example: 150 rooms at $450 leaks $121,500 a month. */
export const DEFAULTS = { rooms: 150, adr: 450, occ: 75, ota: 40, comm: 20 };

export const PROOF_CARDS: [string, string[]][] = [
  [
    'The Wharton study',
    [
      'Referred customers carry 16% higher lifetime value',
      '18% lower churn than ad-driven acquisition',
      'They convert at 3–5× the rate of paid traffic',
    ],
  ],
  [
    'The Tuesday restaurant ASMR calculator',
    [
      'Pre-sells lagging mid-week restaurant covers',
      'Boosts on-site ancillary spa spend by +25%',
      'Captures +$180 to +$500 in additional spend per stay',
    ],
  ],
];

/* ---- Section 6: lifecycle boundaries ------------------------------------ */

export const LIFECYCLE: { phase: string; product: string; points: string[]; active: boolean }[] = [
  {
    phase: '1. Pre-arrival',
    product: 'Apex Welcome',
    points: ['Touchpoints 1–4', 'Closes the gap between booking and arrival'],
    active: true,
  },
  {
    phase: '2. On-site',
    product: 'Apex Atlas',
    points: ['Triggers at physical check-in', 'Dedicated Instagram guide', 'Replaces paper directories'],
    active: false,
  },
  {
    phase: '3. Post-departure',
    product: 'Apex Goodbye',
    points: ['Post-checkout incentives', 'Referral loop'],
    active: false,
  },
];

export const HANDOFFS: [string, string][] = [
  [
    'Handoff 1 — check-in',
    'The moment the guest physically checks in the pre-arrival sequence ends, transferring operations to Apex Atlas: the secondary Instagram guidebook for visual navigation, menus and on-property schedules.',
  ],
  [
    'Handoff 2 — check-out',
    'Post-checkout, the guest transitions to Apex Goodbye to capture direct re-bookings, reviews and private referral loops.',
  ],
];

/* ---- Section 7: verification, objections, close ------------------------- */

export const SOURCES: [string, string][] = [
  [
    'Expedia Group Path-to-Purchase Report',
    'Video-exposed travelers are 74% more likely to complete a booking within seven days than those viewing static images.',
  ],
  [
    'TripAdvisor video performance metrics',
    'Listings featuring high-quality video receive 138% more guest engagement and direct click-through.',
  ],
  [
    'Wharton School customer acquisition data',
    'Referred customers carry 16% higher lifetime value and 18% lower churn than ad-driven acquisitions.',
  ],
  [
    'TripAdvisor trust verification report',
    'Over 2.7 million fake reviews were removed in 2024 alone, making unedited vertical video the only trust source modern consumers believe.',
  ],
];

export const OBJECTIONS: { who: string; objection: string; resolution: string }[] = [
  {
    who: 'The General Manager — operational time',
    objection: 'My front-desk staff is already overworked. We don’t have time to act as filmmakers.',
    resolution:
      'Under 15 seconds of total staff effort per day, during the morning huddle. Zero editing, zero technical file handling, and Auto-Pilot covers high-volume peak days with a single button.',
  },
  {
    who: 'The Revenue Director — proof of return',
    objection: 'How do we prove this software investment actually recovers our direct booking margins?',
    resolution:
      'Recovering five direct bookings a month self-funds the entire Premium tier retainer, while pre-arrival sensory offers generate +$180 to +$500 in additional spend per stay. Backed by a 90-day direct booking target and a six-month risk-free exit clause.',
  },
  {
    who: 'The Marketing Head — template compatibility',
    objection: 'We already spent thousands designing our email confirmation templates and PDF guides.',
    resolution:
      'We do not replace your PMS email engine; we overlay elite visual infrastructure on top of it. Replacing static PDFs with dynamic vertical 60-second loops increases direct conversions by up to 270%.',
  },
];

export const CLOSE = {
  copy: 'Shall we establish total visual supremacy for your property and secure your regional slot?',
  cta: 'Request a territory specimen evaluation',
  href: 'https://apexaccess.com/welcome-intake',
  note: 'Confirms territory availability and takes your website URL for the Day 1 rendering proof.',
};
