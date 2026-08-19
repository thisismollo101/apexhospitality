/**
 * Every string on Apex Sections, in one file.
 *
 * Same convention as the Welcome page: copy never lives inline in a component.
 * This page is dense with figures that have to agree across sections — the
 * calculator in section 4 derives what the VSL quotes in section 3, and the
 * $2M in-house fallacy in section 8 has to add up to its own anchor line — and
 * keeping the strings together is what makes that checkable.
 *
 * Clip names refer to public/media/cards. Seven clips ship with the repo and
 * stand in until per-section footage lands.
 */

export const CLIPS = ['welcome', 'flagship', 'accommodation', 'dining', 'weddings', 'corporate', 'international'] as const;

/* ---- 1. Hero ------------------------------------------------------------ */

export const HERO = {
  clip: 'welcome',
  headline: 'Your $10M physical estate is bleeding 18% of its revenue to a plain-text email receipt.',
  subhead: 'Why is your pre-arrival experience still a sterile, invoice-like black box?',
  cta: '[ Observe Emotion ]',
  ctaHref: '#us-vs-them',
};

/* ---- 2. Them vs Us ------------------------------------------------------ */

export const THEM = {
  title: 'The tax-looking receipt',
  from: 'no-reply@reservations-system.net',
  subject: 'BOOKING CONFIRMATION #RSV-88241-A',
  lines: [
    'CONFIRMATION NO ....... RSV-88241-A',
    'GUEST NAME ............ S. MERCER',
    'ROOM TYPE ............. DLX-OV-K',
    'ARRIVAL ............... 14 SEP 2026',
    'DEPARTURE ............. 18 SEP 2026',
    'RATE PLAN ............. BAR-FLEX-NR',
    'TOTAL DUE ............. USD 6,412.00',
  ],
  attachment: 'booking_confirmation_final.pdf',
  footer: 'This is an automated message. Do not reply to this address.',
  verdict: 'Zero anticipation. Zero room verification. The guest leaves to find video proof somewhere else.',
};

export const US = {
  title: 'The cinematic storefront',
  clip: 'flagship',
  overlay: 'Your private terrace plunge pool is active, Sarah.',
  overlaySub: 'Observe your suite in motion.',
  verdict: 'Telepresence before arrival. The room is verified, the anticipation is built, and the guest never leaves your channel.',
};

/* ---- 2b. The four-box product showcase ---------------------------------- */

export type Box = { n: string; title: string; clip: string; body: string };

export const BOXES: Box[] = [
  { n: 'T1', title: 'The handshake', clip: 'welcome', body: 'A slow arrival-pathway sweep, delivered while the booking is still warm.' },
  { n: 'T2', title: 'Intro to Atlas', clip: 'international', body: 'Interactive visual navigation of the property, room by room.' },
  { n: 'T3', title: 'Pre-arrival spa', clip: 'dining', body: 'Sensory close-up: steaming basalt, drawn water, folded linen.' },
  { n: 'T4', title: 'Arrival pass', clip: 'flagship', body: 'Teak deck, low sun, the cruise the guest has not booked yet.' },
];

/* ---- 3. The VSL matrix -------------------------------------------------- */

export type Chapter = {
  n: number;
  tab: string;
  title: string;
  clip: string;
  transcript: string;
  metric: { value: string; label: string };
  proof: string[];
};

export const CHAPTERS: Chapter[] = [
  {
    n: 1,
    tab: 'The OTA tax',
    title: 'The 15% OTA commission tax exposure',
    clip: 'welcome',
    transcript:
      'Most luxury hotels spend ten million dollars on physical marble and gardens, then let their digital storefront sit completely silent. Travel social video shelf life is now under eleven days, which makes a once-a-year commercial shoot active business negligence.',
    metric: { value: '$15k–$20k', label: 'Recovered annually per room category' },
    proof: [
      'Shelf life of travel social video is now under 11 days',
      'A once-a-year shoot is depreciated before it ships',
      'Shifting OTA bookings direct is self-funding by month three',
    ],
  },
  {
    n: 2,
    tab: 'Silent postcards',
    title: 'The $10M masterpiece versus silent postcards',
    clip: 'accommodation',
    transcript:
      'Your highest-margin suites sit empty because wealthy travelers do not trust your wide-angle photography. With 2.7 million fake reviews removed by TripAdvisor in a single year, unedited vertical video is the only trust source left standing.',
    metric: { value: '270%', label: 'Lift in suite conversion' },
    proof: [
      '2.7M fake reviews removed by TripAdvisor in 2024',
      'Vertical micro-tours show real wardrobe, bed and balcony',
      'Telepresence converts where static galleries stall',
    ],
  },
  {
    n: 3,
    tab: 'Three pillars',
    title: 'The three core pillars of sensory pre-arrival engagement',
    clip: 'dining',
    transcript:
      'Most general managers believe the five-star experience starts in the lobby. The high-anxiety gap between booking and arrival is where retention is actually won. Three pillars close it: the 200-millisecond visual stun, the sensory ASMR layer, and the screenshot-ready loyalty key.',
    metric: { value: '+25%', label: 'On-site ancillary spend' },
    proof: [
      'The 200ms visual stun bypasses price resistance',
      'Sensory ASMR drives +25% on-site spend on autopilot',
      'Easter-egg QR keys gamify the direct re-book',
    ],
  },
  {
    n: 4,
    tab: 'Zero drag',
    title: 'Turnkey deployment, zero staff drag, and the double guarantee',
    clip: 'corporate',
    transcript:
      'We do not run standardized sales meetings. We open with an asset-compatibility study. A four-day on-site cinematic footprint, zero database integration, and under fifteen seconds of staff effort a day — backed by a six-month exit clause where you keep every asset.',
    metric: { value: '4 days', label: 'On-site footprint, zero integration' },
    proof: [
      'Four-day on-site footprint, then nothing',
      'Under 15 seconds of staff effort per day',
      'Six-month exit clause — you keep every asset',
    ],
  },
];

export const TRANSCRIPT_NOTE = 'Teleprompter pace — 115 WPM, ATC cadence.';

export const PROMISE = {
  tag: '[ The unbeatable promise: the zero-risk intake ]',
  copy:
    'Watch these four short, high-yield scenario clips. If you do not agree that this visual infrastructure instantly establishes telepresence and secures your booking funnel, we will render your property’s first custom pre-arrival video loop completely free — no contracts, no IT drag, no obligations.',
};

/* ---- 4. The calculator -------------------------------------------------- */

export type Field = { key: string; label: string; hint: string; min: number; max: number; step: number; unit: '$' | '%' | '' };

export const FIELDS: Field[] = [
  { key: 'rooms', label: 'Room inventory', hint: 'R', min: 20, max: 500, step: 5, unit: '' },
  { key: 'adr', label: 'Average daily rate', hint: 'ADR', min: 150, max: 2000, step: 25, unit: '$' },
  { key: 'occupancy', label: 'Occupancy', hint: 'Occ', min: 30, max: 100, step: 1, unit: '%' },
  { key: 'otaShare', label: 'OTA share of bookings', hint: 'OTA', min: 10, max: 90, step: 1, unit: '%' },
  { key: 'otaCommission', label: 'Average OTA commission', hint: 'Comm', min: 10, max: 30, step: 1, unit: '%' },
];

export const DEFAULTS = { rooms: 100, adr: 500, occupancy: 70, otaShare: 60, otaCommission: 20 };

export const PAYBACK = {
  tag: '[ The 56-guest payback baseline ]',
  copy:
    'Out of your monthly pre-arrival guest journeys, converting just 3 to 4 suite upgrades — a 0.6% conversion rate — and 10 to 12 spa treatments at 1.8% completely self-funds your entire Premium tier retainer. Everything beyond that is pure, high-margin profit to your P&L.',
};

export const ARSENAL = {
  title: 'The Tuesday hack',
  sub: 'F&B and spa ancillary yield',
  body:
    'Mid-week covers and empty treatment slots are the least elastic inventory a resort owns. A sensory ASMR loop delivered seven days out pre-sells them before the guest has packed — the offer lands while anticipation is peaking rather than at the front desk, where it reads as an upsell.',
  points: [
    ['+$180 – $500', 'Additional on-property spend per stay'],
    ['+25%', 'Lift in pre-arrival spa attachment'],
    ['7 days', 'Optimal window before arrival'],
  ] as [string, string][],
};

/* ---- 5. The cadence ----------------------------------------------------- */

export type Touchpoint = { n: number; title: string; when: string; time: string; clip: string; body: string; suppressed: boolean };

export const TOUCHPOINTS: Touchpoint[] = [
  {
    n: 1,
    title: 'The handshake',
    when: '24 hours post-booking',
    time: '7:00 AM',
    clip: 'welcome',
    body: 'Confirms the booking and bypasses buyer’s remorse while the decision is still fresh. Establishes visual authority and names the staff contact.',
    suppressed: false,
  },
  {
    n: 2,
    title: 'Intro to Atlas',
    when: '48 hours post-booking',
    time: '7:00 AM',
    clip: 'international',
    body: 'Hands the guest the unedited visual search index — suites, paths and rooms explored natively, at their own pace.',
    suppressed: true,
  },
  {
    n: 3,
    title: 'The spa teaser',
    when: '7 days pre-arrival',
    time: '7:00 AM',
    clip: 'dining',
    body: 'Establishes sensory anticipation and presents the high-margin offers — heated basalt, private dining — at the moment they convert best.',
    suppressed: true,
  },
  {
    n: 4,
    title: 'Arrival pass',
    when: '48 hours pre-arrival',
    time: '7:00 AM',
    clip: 'flagship',
    body: 'Solves packing anxiety with weather and logistics, then drives the last-mile upgrades: transfer, butler, cabana.',
    suppressed: false,
  },
];

export const SUPPRESSION = {
  tag: 'Suppression gate',
  copy: 'If the booking-to-arrival gap is under 3 days, touchpoints 2 and 3 are bypassed and silenced automatically — no notification spam, no broken brand posture.',
};

export const DARK_SOCIAL = {
  bubble: 'Now THAT is how you welcome a guest! Look at our suite’s private terrace 👀',
  reply: 'Okay that pool is unreal. Booking the same one.',
  tag: '[ The $6 trillion black box: the truth of dark social ]',
  copy:
    'Over 80% of high-end travel bookings and planning decisions occur inside dark social channels — untrackable WhatsApp threads, Instagram DMs and private family group chats. Apex Welcome intercepts that black box by giving your guests personalized, uncompressed visual assets of their specific booked room layouts. Grounded in Wharton School of Business research, referred customers acquired through peer-to-peer sharing carry a 16% higher lifetime value, an 18% lower churn rate, and convert at 3–5× the rate of traditional paid ads.',
  stats: [
    ['16%', 'Higher customer lifetime value'],
    ['18%', 'Lower churn rate'],
    ['3–5×', 'Conversion versus paid traffic'],
  ] as [string, string][],
};

/* ---- 6. Operations ------------------------------------------------------ */

export const AUTOPILOT = {
  on: {
    state: 'Autopilot engine engaged',
    copy: 'Absolute operational silence. All sweeps and translations compile on the backend automatically. Zero staff drag.',
  },
  off: {
    state: 'Standby',
    copy: 'Manual template overrides active. Peak huddles default to pre-rendered assets.',
  },
};

export const PIPELINE: [string, string, string][] = [
  ['Frictionless curation', 'Select', 'Premade ambient property clips are chosen in advance from the centralized library.'],
  ['15-second voice note', 'Record', 'Staff record a simple name greeting on the tablet during the morning huddle.'],
  ['The engine', 'Process', 'Seedance 2.5 converts stills to 3D loops; FlipSync compiles multi-language voice lipsyncing.'],
  ['Dynamic delivery', 'Send', 'Automated webhooks push the vertical loop straight to the guest’s phone. No database integration.'],
];

/* ---- 7. The Welcome Matrix ---------------------------------------------- */

export const PERSONAS = ['Individual & couples', 'Family', 'Wedding', 'Business'] as const;

export type Blueprint = { arc: string; asmr: string; type: string };

/** 16 cells: four touchpoints × four personas, indexed [touchpoint][persona]. */
export const MATRIX: Blueprint[][] = [
  [
    { arc: 'Threshold push through the suite door, settling on the turned-down bed.', asmr: 'Linen drawn back, a match struck, distant surf.', type: '“Your suite is ready, Sarah.”' },
    { arc: 'Wide sweep of the family suite, then the balcony gate closing safely.', asmr: 'Children distant, gate latch, pool filter hum.', type: '“Two rooms, one balcony, no stairs.”' },
    { arc: 'Aisle dolly from the arch to the sea, held on the empty seats.', asmr: 'Bougainvillea in wind, chairs set on stone.', type: '“Your aisle, four weeks out.”' },
    { arc: 'Grand foyer greeting, badge desk, then the boardroom screen descending.', asmr: 'Screen motor, glass on wood, low HVAC.', type: '“Two hundred delegates. One entrance.”' },
  ],
  [
    { arc: 'Handheld walk of the cliff path down to the private cove.', asmr: 'Gravel underfoot, gulls, wind over the mic.', type: '“Every path, unedited.”' },
    { arc: 'Rabbit café, shallow pool, then the waterfall trail entrance.', asmr: 'Water over rock, small animals, laughter.', type: '“Where the day actually goes.”' },
    { arc: 'Suite-to-suite walk showing where each party gets ready.', asmr: 'Doors, hangers, a cork drawn.', type: '“Nine rooms, one corridor.”' },
    { arc: 'Breakout rooms, terrace, and the walk between them timed.', asmr: 'Footsteps on terrazzo, doors, coffee poured.', type: '“Ninety seconds, room to room.”' },
  ],
  [
    { arc: 'Basalt stones lifted from steaming water onto folded cloth.', asmr: 'Stone on stone, steam release, water drip.', type: '“Tuesday, 4pm. Held for you.”' },
    { arc: 'Kids club craft table, then the parents’ empty spa loungers.', asmr: 'Scissors, paper, then near-silence.', type: '“Two hours that are yours.”' },
    { arc: 'Tasting table set course by course in a single unbroken move.', asmr: 'Cutlery placed, cork, wine poured.', type: '“Your menu, before you land.”' },
    { arc: 'Whisky poured at the terrace bar as the room lights come up.', asmr: 'Ice, pour, low conversation.', type: '“The room after the room.”' },
  ],
  [
    { arc: 'Teak deck, low sun, the cruise pulling away from the jetty.', asmr: 'Hull on water, rigging, engine low.', type: '“Sunset, day two. One seat left.”' },
    { arc: 'Transfer vehicle loaded, car seats already fitted, doors closing.', asmr: 'Boot closing, belts clicking, indicator.', type: '“Seats fitted. Nothing to carry.”' },
    { arc: 'Cabana dressed at first light before any guest has arrived.', asmr: 'Fabric snapping taut, ice into buckets.', type: '“Set at six. Yours at ten.”' },
    { arc: 'Airport pickup board, then the car door held open.', asmr: 'Terminal hum, door, city fading out.', type: '“Kerb to keycard: 40 minutes.”' },
  ],
];

/* ---- 8. Lifecycle and the in-house fallacy ------------------------------ */

export const LIFECYCLE = [
  {
    phase: 'Pre-arrival',
    product: 'Apex Welcome',
    active: true,
    body: 'The SMS and WhatsApp timeline covering touchpoints 1 through 4, from booking to the moment the guest walks in.',
  },
  {
    phase: 'On-property',
    product: 'Apex Atlas',
    active: false,
    body: 'Activated by wooden NFC coasters in the lobby. Shifts the guest entirely to room service menus and spa exploration.',
  },
  {
    phase: 'Post-departure',
    product: 'Apex Goodbye',
    active: false,
    body: 'Launches the referral and VIP loyalty loop with locked 180-day room upgrade codes.',
  },
];

export type Widget = { key: string; title: string; sub: string; total: string; lines: string[]; wide: boolean };

export const FALLACY: Widget[] = [
  {
    key: 'staff',
    title: 'The staffing heavyweight',
    sub: '9 fully-loaded FTE',
    total: '$1,085,000',
    lines: ['Creative director', 'Director of photography', 'Second camera operator', 'Lead editor', 'Sound engineer', 'Colorist', 'Motion designer', 'Systems and MAM administrator', 'Producer and scheduler'],
    wide: true,
  },
  {
    key: 'gear',
    title: 'The gear capital',
    sub: 'Cinema CAPEX, annualized',
    total: '$280,000',
    lines: ['RED camera bodies', 'Anamorphic glass set', 'Drone and gimbal rigs', 'Lighting and grip truck'],
    wide: false,
  },
  {
    key: 'software',
    title: 'Enterprise software',
    sub: 'Licenses and infrastructure',
    total: '$145,000',
    lines: ['Post-production suite seats', 'Media asset management', 'Voice cloning licenses', 'Render farm and storage'],
    wide: false,
  },
  {
    key: 'logistics',
    title: 'Logistics & IP clearances',
    sub: 'Per-shoot, annualized',
    total: '$490,000',
    lines: ['Travel and freight', 'Model and talent fees', 'Music and likeness clearances', 'Legal and insurance'],
    wide: true,
  },
];

export const FALLACY_ANCHOR =
  'Why assume a high-risk, fixed annual overhead of $2,000,000 when Apex Welcome delivers the exact same virtual film crew value on an automated, risk-reversed Premium retainer?';

/* ---- 9. Pricing, close and citations ------------------------------------ */

export type Tier = { name: string; price: string; note: string; points: string[]; featured: boolean };

export const TIERS: Tier[] = [
  {
    name: 'Signature',
    price: '$5,000',
    note: 'Back-end compliance only. Heavily restricted.',
    points: ['Existing asset library only', 'Touchpoint 1 delivery', 'Quarterly refresh', 'No on-site footprint'],
    featured: false,
  },
  {
    name: 'Premium',
    price: '$10,000',
    note: 'The full turnkey deployment.',
    points: ['Turnkey 4-day on-site cinematic footprint', 'Unlimited Seedance loops', 'Full automated timeline delivery', 'All four touchpoints, all personas', 'Six-month exit clause — keep every asset'],
    featured: true,
  },
  {
    name: 'Apex 365 Elite',
    price: '$25,000',
    note: 'Always-on, regionally exclusive.',
    points: ['Always-on filming crew', 'Regional lockout', 'Unlimited properties', 'Dedicated production line'],
    featured: false,
  },
];

export const CLOSE = {
  cta: '[ Request a territory specimen evaluation ]',
  href: 'https://apexaccess.com/welcome-intake',
  note: 'Confirms territory availability and takes your website URL for the Day 1 rendering proof.',
};

export const CITATIONS: [string, string][] = [
  ['Expedia Group — Path-to-Purchase Report', 'Video-exposed travelers are 74% more likely to complete a booking within seven days than those viewing static images.'],
  ['TripAdvisor — Video performance metrics', 'Listings featuring high-quality video receive 138% more guest engagement and direct click-through.'],
  ['Wharton School — Customer acquisition study', 'Referred customers carry 16% higher lifetime value and 18% lower churn than ad-driven acquisitions.'],
  ['TripAdvisor — Trust verification report', 'Over 2.7 million fake reviews were removed in 2024 alone, making unedited vertical video the only trust source modern consumers believe.'],
];
