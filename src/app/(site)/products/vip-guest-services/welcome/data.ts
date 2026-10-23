/**
 * Copy and asset names for the parts of the Welcome page that are drawn by
 * script: the touchpoint cards and their opened sheet, the reel, the guest-type
 * frames, and the journey phone. Everything else is plain markup in WelcomeBody.tsx.
 *
 * Figures marked * are unverified placeholders until the sources are checked.
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
    lede: 'Your own team, in their own cloned voice, welcomes the guest by name, then a teaser of the room they booked turns into the suite they could have instead.',
    pays: [
      ['50%*', 'Lower cancellation rate. A direct human greeting within 24 hours takes the remorse out of the booking.'],
      ['4x*', 'Conversion of personal video messages against generic email links.'],
    ],
    cite: '* Cloudbeds; Canary Technologies. Sources pending verification.',
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
      ['85–90%*', 'Off-site dining leakage, captured as dinner covers before guests research anywhere else.'],
      ['380%*', 'Conversion lift on high-end culinary offers when backed by visual proof.'],
    ],
    cite: '* CBRE Americas / Regulr; Spiegel Research Center. Sources pending verification.',
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
      ['Up to €250*', 'Per-guest spend lift from visual pre-arrival upselling, a 10% to 20% increase.'],
    ],
    cite: '* ISPA / PwC; Oaky / Akia. Sources pending verification.',
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
      ['65%*', 'Early check-in revenue captured through direct mobile triggers.'],
      ['0', 'Front-desk queries about arrival. The guest already knows where to go and what happens next.'],
    ],
    cite: '* Source pending verification.',
  },
];

/* ---- section 2 · the journey phone --------------------------------------- */

export type JourneyStep = {
  day: number;
  date: string;
  time: string;
  img: string;
  dur: string;
  chip: string;
  msg: string;
};

export const JOURNEY: JourneyStep[] = [
  { day: 1, date: 'Mon 3 Nov', time: '08:02', img: 't2.jpg', dur: '0:30', chip: 'See the Ocean Suite', msg: "Good morning, Sarah. It's Maya at the front desk. See you on the 2nd." },
  { day: 3, date: 'Wed 5 Nov', time: '18:40', img: 'f6.jpg', dur: '0:15', chip: "Reserve the chef's table", msg: 'Chef Aris is plating something new. Your terrace table is waiting.' },
  { day: 23, date: 'Tue 25 Nov', time: '10:15', img: 't9.jpg', dur: '0:15', chip: 'Book a treatment', msg: 'Three treatment hours are still open during your stay.' },
  { day: 28, date: 'Sun 30 Nov', time: '09:30', img: 't16.jpg', dur: '0:15', chip: 'Add early check-in', msg: 'Your driver will meet you at arrivals. Want your room ready early?' },
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
  { name: 'Press play', c: '#2b59e0', poster: 'vsl-poster.jpg', len: '1:30', fig: 'Once', figLab: 'Your team records their voice', title: 'Ninety Seconds. The Whole Machine.', desc: 'One voice recording and one filming residency become a personal film for every guest who books.', foot: '4–5 days on site. Nothing for your team after that.' },
  { name: 'Your property, starring', c: '#c9803a', poster: 'f4.jpg', len: '0:45', fig: '16', figLab: 'Clips in the matrix', title: 'Your Property, Filmed Before We Even Talk.', desc: 'Book a demo and we make a 4K spec film of your hotel first. You see it working before the first call.', foot: 'Day 1 proof, before any contract is signed.' },
  { name: 'Your team, famous', c: '#b8902a', poster: 'f1.jpg', len: '0:45', fig: '88%*', figLab: 'Trust real people over ads', title: 'The Voice Your Guests Remember.', desc: 'We record your team once and clone their voice. Every welcome after that is theirs, cut with your 4K footage.', foot: '*Nielsen. Source pending verification.' },
  { name: 'Your events, sold out', c: '#2e8b8f', poster: 'h19.jpg', len: '0:45', fig: '365', figLab: 'Days a year, one residency', title: 'Your Events, Booked Before Guests Arrive.', desc: 'Galas, chef pop-ups and seasonal menus go into the films of guests whose dates overlap, weeks ahead.', foot: 'Limited-capacity events fill before arrival.' },
  { name: 'In every pocket', c: '#6a3fa0', poster: 'h5.jpg', len: '0:45', fig: '0', figLab: 'Apps, logins or portals', title: 'Your Brand, Straight to Their Phone.', desc: 'Triggered from OPERA or SynXis, delivered by SMS or WhatsApp. One tap and it plays.', foot: '*52% abandon clunky digital experiences (SiteMinder).' },
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
    data: '<span class="ast">*</span>75% of tourists are culinary travellers and rate food 8.2/10 when choosing a destination (WFTA 2026) [P05-4].',
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
  { claim: 'Front-desk upsells 2–5%; pre-arrival offers 15–25%.', src: 'BookingWhizz [P15-1]', vendor: true },
  { claim: '52% booking abandonment.', src: 'SiteMinder Changing Traveller Report 2025' },
  { claim: '85–90% of guests eat elsewhere; dinner capture 10–15%.', src: 'CBRE Americas / Regulr [P05-2]' },
  { claim: 'OTA commission 15–30% vs 4–5% direct.', src: 'Cloudbeds / Lighthouse [G-09]' },
  { claim: 'Cancellations 10.6% direct vs 21.8% OTA (a channel fact, not a Welcome result).', src: 'Cloudbeds [P03-6]', vendor: true },
  { claim: 'Ancillary revenue is 18%+ of hotel income.', src: 'Cloudbeds [P15-3]', vendor: true },
  { claim: '380% conversion lift on higher-priced items with reviews.', src: 'Spiegel Research Center [G-13]' },
  { claim: '75% of tourists are culinary travellers; food rated 8.2/10.', src: 'World Food Travel Association 2026 [P05-4]' },
  { claim: '$6.8T wellness economy, larger than global tourism.', src: 'Global Wellness Institute [P08-1]' },
  { claim: 'Wellness travellers spend more per trip.', src: 'Global Wellness Institute [P08-5]' },
  { claim: 'Ideal therapist utilisation 50–75%.', src: 'Cornell / Horwath [P08-4]' },
  { claim: '88% trust recommendations from people they know.', src: 'Nielsen 2021 [G-02]' },
  { claim: '74% of affluent travellers book after watching activity video.', src: 'Travel Iowa video-marketing presentation' },
  { claim: "Hotel listings with property video get 99% more clicks to the hotel's website.", src: 'TripAdvisor Business Advantage' },
  { claim: '65% of US hotels report staffing shortages.', src: 'AHLA, Feb 2025' },
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
  headline: 'Apex Welcome captures their spend commitment while excitement is at its absolute peak, locking in 5x more pre-arrival cash.',
  /** Bottom 1's heading (Bottoms 2 and 3 keep the headline above). */
  quote: 'Apex Welcome strikes at peak excitement, locking in 5x more pre-arrival spend before check-in.',
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
      title: '380% Conversion Lift on High-Priced Inventory',
      text: 'Spiegel Research Center proved that visual social proof lifts online conversions by 270% on average, jumping to 380% on higher-priced luxury suite upgrades.',
      src: 'Spiegel / Northwestern, unverified',
    },
    {
      num: '48',
      unit: 'Hours',
      title: '4x Higher Conversion via Digital Touchpoints',
      text: 'Pre-arrival room upgrade offers delivered via personalized digital touchpoints generate 4x the conversion rate of generic confirmation email links or front-desk check-in pitches.',
      src: 'Canary Technologies, unverified',
    },
    {
      num: '7',
      unit: 'Days',
      title: '60%+ Pre-Arrival Dining Decision Window',
      text: 'Over 60% of luxury hotel guests select and book their dining experiences prior to arrival or within their first 2 hours on property; failing to engage guests pre-arrival guarantees leakage to off-site competitors.',
      src: 'Cornell / OpenTable, unverified',
    },
    {
      num: '48',
      unit: 'Hours',
      title: '50% Lower Cancellation Rate',
      text: 'Direct guests engaged pre-arrival cancel at just 10.6%, compared to 21.8% for OTA bookers, stabilizing cash flow weeks in advance.',
      src: 'Cloudbeds, unverified',
    },
  ] as Row[],
};

/**
 * Bottom 1's order for Card B's rows (Bottoms 2 and 3 keep the order above):
 * the 4x row goes first at 24 hours and the 380% row second at 48 hours; each
 * takes its title, text and source with it.
 */
export const JOINED_ROWS: Row[] = [
  { ...APEX_WAY.rows[1], num: '24', unit: 'Hours' },
  { ...APEX_WAY.rows[0], num: '48', unit: 'Hours' },
  APEX_WAY.rows[2],
  APEX_WAY.rows[3],
];
