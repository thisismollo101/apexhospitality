/**
 * Copy and asset names for the parts of the Welcome page that are drawn by
 * script: the touchpoint cards and their opened sheet, the reel and the guest-type
 * frames. Everything else is plain markup in WelcomeBody.tsx.
 *
 * Every figure marked * is from the vetted evidence bank (Evidence Ledger v1.0 /
 * EVIDENCE-SSOT) and is listed in SOURCES with its ledger ID. Kill-List and
 * unsourced figures were removed on 27 Oct 2026.
 */

/** Everything the page shows lives here, copied from the design artifact. */
export const MEDIA = '/media/welcome/';

export const img = (name: string) => `${MEDIA}${name}`;

/* ---- section 2 · the four touchpoint cards ------------------------------- */

export type Card = {
  kick: string;
  title: string;
  img: string;
  fig: string;
  figSub: string;
  desc: string;
  lede: string;
  pays: [string, string][];
  cite: string;
};

export const TOUCHPOINTS: Card[] = [
  {
    kick: 'Touchpoint 01',
    title: 'Welcome By Name',
    img: 't2.jpg',
    fig: 'Day 1',
    figSub: 'Morning after booking',
    desc: 'Your team welcomes the guest by name, in their own voice.',
    lede: 'Your own team, in their own recorded voice, welcomes the guest by name, then a teaser of the room they booked turns into the suite they could have instead.',
    pays: [
      ['10.6%*', 'Cancellation rate on direct bookings, against 21.8% through OTAs. A channel fact, not a Welcome result.'],
      ['$519*', 'Average direct booking value, against $320 through an OTA. The guest relationship is worth keeping warm.'],
    ],
    cite: '* Cloudbeds via Prostay 2026 (vendor data) [P03-6]; SiteMinder Hotel Booking Trends 2025 [G-10].',
  },
  {
    kick: 'Touchpoint 02',
    title: 'Dining, In Close-Up',
    img: 'f6.jpg',
    fig: '48 hours',
    figSub: 'After booking',
    desc: 'Signature dishes in close-up, with one tap to book the table.',
    lede: "Fifteen seconds of signature dishes, the cocktail pour and the kitchen at work, with one tap to reserve the chef's table.",
    pays: [
      ['7 in 8*', 'Hotel guests eat dinner somewhere other than the hotel. The film puts your table in front of them first.'],
      ['29.1%*', 'Hotel F&B departmental margin in the first half of 2025, across 2,669 US hotels.'],
    ],
    cite: '* CBRE Hotels Americas, via Regulr [P05-2]; CBRE Hotels Research 2025 [P05-1].',
  },
  {
    kick: 'Touchpoint 03',
    title: 'Spa, Matched To Open Hours',
    img: 't9.jpg',
    fig: '7 days',
    figSub: 'Before arrival',
    desc: 'A spa teaser matched to the hours still open on their dates.',
    lede: "A hydrotherapy teaser sent a week before arrival, matched to the therapist hours still open on the guest's dates.",
    pays: [
      ['20–33%*', 'Departmental operating margin for resort and hotel spas, so every filled hour lands as profit.'],
      ['50–75%*', 'Ideal therapist utilisation. An unsold treatment hour never comes back.'],
    ],
    cite: '* ISPA / PwC; PKF-CBRE; HVS [P08-3]; Kimes, Cornell Hospitality Quarterly 2009; Horwath HTL [P08-4].',
  },
  {
    kick: 'Touchpoint 04',
    title: 'Arrival And Extensions',
    img: 't16.jpg',
    fig: '48 hours',
    figSub: 'Before arrival',
    desc: 'Valet, arrival, and one tap for early check-in or an extra night.',
    lede: 'Valet, the chilled-towel greeting, and one tap to lock in early check-in, late checkout or an extra night.',
    pays: [
      ['65%*', 'Of US hotels report staffing shortages. A guest who already knows where to go asks the desk less.'],
      ['71%*', 'Of US hoteliers report openings they cannot fill. The films add nothing to the front desk’s day.'],
    ],
    cite: '* AHLA Front Desk Feedback, Feb 2025, 282 hoteliers [G-18].',
  },
];

/* ---- section 3 · the reel ------------------------------------------------- */

export type ReelStep = {
  name: string;
  c: string;
  poster: string;
  len: string;
  fig: string;
  figLab: string;
  title: string;
  desc: string;
  foot: string;
};

export const REEL: ReelStep[] = [
  { name: 'Press play', c: '#2b59e0', poster: 'vsl-poster.jpg', len: '1:30', fig: 'Once', figLab: 'Your team records their voice', title: 'Ninety Seconds. The Whole Machine.', desc: 'One voice recording and your property’s own footage become a personal film for every guest who books.', foot: 'One recording session. Nothing for your team after that.' },
  { name: 'Your property, starring', c: '#c9803a', poster: 'f4.jpg', len: '0:45', fig: '16', figLab: 'Clips in the matrix', title: 'See It Working Before You Sign.', desc: 'Book a private demo and we make a sample film first, so you see the format working before any contract.', foot: 'Proof first, before any contract is signed.' },
  { name: 'Your team, famous', c: '#b8902a', poster: 'f1.jpg', len: '0:45', fig: '88%*', figLab: 'Trust recommendations from people they know', title: 'The Voice Your Guests Remember.', desc: 'We record your team once, with their written consent. Every welcome after that carries their own voice, cut with your property’s footage.', foot: '*Nielsen Trust in Advertising, 2021 [G-02].' },
  { name: 'Your events, sold out', c: '#2e8b8f', poster: 'h19.jpg', len: '0:45', fig: '365', figLab: 'Days a year, one system', title: 'Your Events, Booked Before Guests Arrive.', desc: 'Galas, chef pop-ups and seasonal menus go into the films of guests whose dates overlap, weeks ahead.', foot: 'Limited-capacity events reach guests before they arrive.' },
  { name: 'In every pocket', c: '#6a3fa0', poster: 'h5.jpg', len: '0:45', fig: '0', figLab: 'Apps, logins or portals', title: 'Your Brand, Straight to Their Phone.', desc: 'Sent from your daily arrivals export or booking emails, delivered by SMS or WhatsApp. One tap and it plays.', foot: 'Works alongside your PMS. No integration needed.' },
];

/* ---- section 4 · the marquee --------------------------------------------- */

/** m0..m10, each a .mp4 with a .jpg poster. */
export const MARQUEE_CLIPS = Array.from({ length: 11 }, (_, i) => i);

/* ---- who it's for --------------------------------------------------------- */

export const WHEN = ['The morning after booking', '48 hours later', '7 days before arrival', '48 hours before arrival'];

export type Guest = { name: string; imgs: string[]; lines: string[]; data: string };

export const GUESTS: Guest[] = [
  {
    name: 'Individual',
    imgs: ['t2.jpg', 'f6.jpg', 't9.jpg', 'm2.jpg'],
    lines: ['Welcomed by name, then their room', 'A seat at the chef’s counter', 'Wellness hours built around one', 'Late checkout and lounge access'],
    data: '<span class="ast">*</span>Wellness travellers spend more per trip than the average tourist (GWI) [P08-5].',
  },
  {
    name: 'Couple',
    imgs: ['t2.jpg', 'f6.jpg', 't9.jpg', 'p27.jpg'],
    lines: ['Welcomed by name, then the suite upgrade', 'The candlelit tasting menu', 'Couples’ spa, side by side', 'Champagne on arrival'],
    data: '<span class="ast">*</span>96% of leisure travellers seek unique culinary experiences (World Food Travel Association, Food Travel Monitor 2020) [P05-3].',
  },
  {
    name: 'Family',
    imgs: ['t2.jpg', 'p23.jpg', 'm4.jpg', 't16.jpg'],
    lines: ['Welcomed by name, connecting rooms confirmed', 'Family dining, booked ahead', 'The kids’ club schedule', 'A pool cabana, reserved'],
    data: '',
  },
];

/* ---- sources footer ------------------------------------------------------- */

export const SOURCES: { claim: string; src: string; vendor?: boolean }[] = [
  { claim: 'Average direct booking $519 vs $320 through an OTA.', src: 'SiteMinder Hotel Booking Trends 2025 [G-10]' },
  { claim: '76% prefer to buy in their own language.', src: 'CSA Research, Can’t Read, Won’t Buy B2C, 2020 (8,709 consumers) [P04-1]' },
  { claim: '65% of US hotels report staffing shortages; 71% report openings they cannot fill.', src: 'AHLA Front Desk Feedback, Feb 2025 (282 hoteliers) [G-18]' },
  { claim: 'Only about one in eight hotel guests eats dinner at the hotel.', src: 'CBRE Hotels Americas, via Regulr [P05-2]' },
  { claim: 'Hotel F&B departmental margin 29.1%, H1 2025 (2,669 US hotels).', src: 'CBRE Hotels Research 2025 [P05-1]' },
  { claim: 'OTA commission 15–30% vs 4–5% direct.', src: 'Cloudbeds 2026 / Lighthouse via Hospitality Net [G-09]', vendor: true },
  { claim: 'Cancellations 10.6% direct vs 21.8% OTA (a channel fact, not a Welcome result).', src: 'Cloudbeds via Prostay 2026 [P03-6]', vendor: true },
  { claim: 'Ancillary revenue is 18%+ of hotel income.', src: 'Cloudbeds [P15-3]', vendor: true },
  { claim: 'One review-score point supports an 11.2% higher rate at the same occupancy.', src: 'Anderson, Cornell Center for Hospitality Research 2012 [G-15]' },
  { claim: '96% of leisure travellers seek unique culinary experiences.', src: 'World Food Travel Association, Food Travel Monitor 2020 [P05-3]' },
  { claim: '$6.8T global wellness economy, forecast to reach $9.8T.', src: 'Global Wellness Institute, Nov 2025 [P08-1]' },
  { claim: 'Wellness travellers spend more per trip.', src: 'Global Wellness Institute [P08-5]' },
  { claim: 'Resort and hotel spa departmental margin about 20–33%.', src: 'ISPA / PwC; PKF-CBRE; HVS [P08-3]' },
  { claim: 'Ideal therapist utilisation 50–75%.', src: 'Kimes, Cornell Hospitality Quarterly 2009; Horwath HTL [P08-4]' },
  { claim: '88% trust recommendations from people they know.', src: 'Nielsen Trust in Advertising 2021 [G-02]' },
  { claim: "Hotel listings with property video get 99% more clicks to the hotel's website (correlational).", src: 'TripAdvisor Business Advantage [P01-2]' },
  {
    claim: '73% say creator or influencer recommendations have influenced their booking decisions.',
    src: 'Expedia Group, 2025 Traveler Value Index (May 2025), https://secure.businesswire.com/news/home/20250520512943/en/ [G-05]',
  },
];

/* ---- the top of the page: the hero and the Wrong Way vs APEX Way section ---------
   Copied verbatim from two samples, not imported, per CLAUDE.md: the hero from
   /samples/hero-data-cards (Gradient 1 · Cobalt Sweep only; its own headline
   lines and cards are HERO_G1 here), and the section from
   /samples/wrong-way-headings. */

/* the hero (hero-data-cards) */

export const TOP = {
  headline: 'This Is the Single Largest Commercial Leak on Your P&L.',
  /** The same headline in the two lines it already breaks into on the live page. */
  lines: ['This Is the Single Largest', 'Commercial Leak on Your P&L.'],
  film: 'hero.mp4',
  poster: 'hero.jpg',
};

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

/** Gradient 1's headline lines (Aidan, 18 Oct). The three stat cards under it are StatTicker. */
export const HERO_G1: { lines: string[] } = {
  lines: ['This Is the Single', 'Largest Commercial', 'Leak on Your P&L.'],
};

/* the Wrong Way vs APEX Way section (wrong-way-headings) */

/**
 * added: the section heading over the whole block (set like the live "Why it
 * works" heading, its two lines broken from tablet up) and the two mini
 * headings, Aidan's copy word for word, each mini headline on two lines.
 */
export const SECTION = { label: 'The potential', lines: ['Boring Administrative Confirmations vs', 'Apex Data Driven Revenue Engine.'] };

export const HEADINGS = {
  wrong: { label: 'Standard', lines: ['Stop Reminding Guests.', 'Start Exciting Them.'] },
  apex: { label: 'Exceptional', lines: ['Same Guest. Same Booking.', 'Two Very Different Stays.'] },
};


/**
 * One of Card B's expandable rows: the send timing on the outer edge, the
 * title, and the source line, which shows only once the row is open.
 */
export type Row = { num: string; unit: string; title: string; text: string; src: string };

export const OLD_WAY = {
  kick: 'Card A',
  /** Bottom 1's pill, above the phone. */
  pill: 'The Wrong Way',
  title: 'The Old Way',
  headline:
    "While you send cold email receipts and 30 days of radio silence, off-site competitors are stealing your guest's dining and spa budget.",
  /** Bottom 1's heading. */
  quote: "Thirty days of radio silence surrenders your guest's dining and spa budget off-site.",
  /** The phone: a plain reminder text, as in Aidan's reference screenshot. */
  sms: {
    kind: 'Text Message',
    when: 'Today 9:29AM',
    body: 'Hi Alex, this is a reminder of your reservation at our hotel on March 15. Your check-in time is 3:00 PM. Please confirm your arrival by replying YES or call us at 123-456-7890 if you need to make any changes.',
    input: 'Text message',
  },
  /**
   * The month from booking to check-in, the What Works calendar's own
   * (welcome-mobile-options-2): Monday-first, booked Mon 3 Nov, arrival Tue
   * 2 Dec, "days to arrival" counted from Day 1. On the Old Way every one of
   * the 30 days is empty: nothing is sent.
   */
  calendar: { kick: 'Booking to check-in', left: '29 days to arrival', start: Date.UTC(2025, 10, 3), days: 30 },
};

export const APEX_WAY = {
  kick: 'Card B',
  /** Bottom 1's pill, above the phone. */
  pill: 'The APEX Way',
  title: 'The APEX Way',
  headline: 'Apex Welcome reaches the guest while excitement is at its absolute peak, so dining, spa and upgrades are chosen before check-in.',
  /** Bottom 1's heading (Bottoms 2 and 3 keep the headline above). */
  quote: 'Apex Welcome strikes at peak excitement, putting dining, spa and upgrades in front of the guest before check-in.',
  /**
   * One placeholder film from the Bento Expand set, to be swapped; it has a
   * sound track, for the unmute button. Safari takes the HEVC master; Chrome
   * and Firefox the WebM (VP9 + Opus); anything else the H.264 copy.
   */
  clip: 'hq/card-tall.mp4',
  clipHevc: 'hq/card-tall-hevc.mp4',
  clipWebm: 'hq/card-tall.webm',
  poster: 'hq/card-tall.jpg',
  /**
   * Bottom 1's film, approved by Aidan: 994 × 1920 with its sound track, shown
   * whole on a screen of the same shape. The same three encodes and a poster.
   */
  joined: { clip: 'hq/apex-way.mp4', clipHevc: 'hq/apex-way-hevc.mp4', clipWebm: 'hq/apex-way.webm', poster: 'hq/apex-way.jpg' },
  rows: [
    {
      num: '24',
      unit: 'Hours',
      title: '7 in 8 Guests Eat Dinner Elsewhere',
      text: 'Only about one in eight hotel guests eats dinner at the hotel. Reaching them before they arrive is how the table gets booked before they look anywhere else.',
      src: 'CBRE Hotels Americas, via Regulr [P05-2]',
    },
    {
      num: '48',
      unit: 'Hours',
      title: '73% Influenced by Creator Content',
      text: '73% of travellers say creator or influencer recommendations have influenced their booking decisions. A personal film speaks that same language.',
      src: 'Expedia Group, 2025 Traveler Value Index [G-05]',
    },
    {
      num: '7',
      unit: 'Days',
      title: '76% Prefer Their Own Language',
      text: '76% of consumers prefer to buy with information in their own language, and 40% will not buy from websites in other languages.',
      src: 'CSA Research, 2020, 8,709 consumers [P04-1]',
    },
    {
      num: '48',
      unit: 'Hours',
      title: 'Direct Bookings Cancel Less',
      text: 'Direct bookings cancel at 10.6%, against 21.8% for OTA bookings. A channel fact, not an Apex result: the more of the relationship you hold directly, the steadier it is.',
      src: 'Cloudbeds via Prostay 2026, vendor data [P03-6]',
    },
  ] as Row[],
};

/**
 * Bottom 1's order for Card B's rows (Bottoms 2 and 3 keep the order above):
 * the creator-content row goes first at 24 hours and the dining row second at 48 hours; each
 * takes its title, text and source with it.
 */
export const JOINED_ROWS: Row[] = [
  { ...APEX_WAY.rows[1], num: '24', unit: 'Hours' },
  { ...APEX_WAY.rows[0], num: '48', unit: 'Hours' },
  APEX_WAY.rows[2],
  APEX_WAY.rows[3],
];
