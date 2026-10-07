/**
 * Copy for the mobile-options sample, round 2 (copied from round 1, not imported). Every string is the live Welcome page's
 * copy, verbatim. No new stats, no changed numbers. Media is the live page's
 * own placeholder set in /media/welcome/.
 */

export const img = (name: string) => `/media/welcome/${name}`;

/* ---- Block A · hero, top VSL, value cards -------------------------------- */

export const HERO = {
  headline: 'This Is the Single Largest Commercial Leak on Your P&L.',
  /** [text, bold part, text after, footnoted] */
  lines: [
    { pre: 'Front desk check-in upsells convert at ', bold: '2% to 5%', post: '.', ast: true },
    { pre: 'Data Driven Mobile Cinema converts at ', bold: '15% to 25%', post: '.', ast: true },
    { pre: '', bold: '5x', post: ' your pre-arrival revenue, with zero staff labor.', ast: false },
  ],
  clip: 'hero.mp4',
};

export const VSL_A = {
  eye: 'Why it works',
  headline: 'Your Revenue Walks Out the Door Before Your Guest Walks In.',
  tag: 'Watch · 1:30',
  poster: 'vsl-poster.jpg',
};

export type ValueCard = { fig: string; title: string; text: string; src: string; img: string };

export const VALUE_CARDS: ValueCard[] = [
  {
    fig: '52%',
    title: 'Booking Abandonment',
    text: 'Over half of travelers abandoned a direct booking last year because the digital experience felt cold, flat or sterile.',
    src: 'SiteMinder Changing Traveller Report 2025',
    img: 'f7.jpg',
  },
  {
    fig: '85–90%',
    title: 'Off-Site Dining Leakage',
    text: 'Seven of eight guests walk past your restaurants and spend their dinner money somewhere else.',
    src: 'CBRE Americas / Regulr',
    img: 'f6.jpg',
  },
  {
    fig: '15–30%',
    title: 'OTA Commission Tax',
    text: 'Paid to third parties on every OTA booking, against 4–5% to win the same guest direct.',
    src: 'Cloudbeds / Lighthouse',
    img: 'f5.jpg',
  },
];

/* ---- Block B · what works -------------------------------------------------- */

export const WORKS = {
  eye: 'What works',
  headline: 'Timing Is Everything: The 4-Milestone Guest Journey.',
  tag: 'Watch · 1:15',
  poster: 'vsl-poster.jpg',
  kick: 'Booking to check-in',
  title: 'Four films, timed to the guest',
  foot: 'Triggered by the booking in OPERA or SynXis. Sent by SMS or WhatsApp. Nobody on your team sends a thing.',
};

/**
 * The four milestones, with the live journey panel's day, date, time and
 * message for each. "days to arrival" is 30 minus the day, exactly as the live
 * countdown computes it.
 */
export type Milestone = {
  when: string;
  clip: string;
  poster: string;
  what: string;
  day: number;
  date: string;
  time: string;
  img: string;
  dur: string;
  chip: string;
  msg: string;
};

export const MILESTONES: Milestone[] = [
  { clip: 'm4.mp4', poster: 'm4.jpg', when: 'Day 1', what: 'Welcome by name', day: 1, date: 'Mon 3 Nov', time: '08:02', img: 't2.jpg', dur: '0:30', chip: 'See the Ocean Suite', msg: "Good morning, Sarah. It's Maya at the front desk. See you on the 2nd." },
  { clip: 'm7.mp4', poster: 'm7.jpg', when: '48 hours', what: 'Dining, in close-up', day: 3, date: 'Wed 5 Nov', time: '18:40', img: 'f6.jpg', dur: '0:15', chip: "Reserve the chef's table", msg: 'Chef Aris is plating something new. Your terrace table is waiting.' },
  { clip: 'm2.mp4', poster: 'm2.jpg', when: '7 days out', what: 'Spa, matched to open hours', day: 23, date: 'Tue 25 Nov', time: '10:15', img: 't9.jpg', dur: '0:15', chip: 'Book a treatment', msg: 'Three treatment hours are still open during your stay.' },
  { clip: 'm9.mp4', poster: 'm9.jpg', when: '48 hours out', what: 'Arrival and extensions', day: 28, date: 'Sun 30 Nov', time: '09:30', img: 't16.jpg', dur: '0:15', chip: 'Add early check-in', msg: 'Your driver will meet you at arrivals. Want your room ready early?' },
];

export const daysLeft = (day: number) => `${30 - day} days to arrival`;

export const PHONE = { who: 'The Resort', verified: 'Verified business' };

/* ---- Block C · four films, four moments ----------------------------------- */

export const MOMENTS_HEAD = {
  eye: 'The four films',
  headline: 'Four Films, Four Moments. Every One Sells the Stay.',
};

export type Moment = {
  fig: string;
  figSub: string;
  kick: string;
  title: string;
  desc: string;
  img: string;
  /** Placeholder film for this touchpoint, from the live page's marquee set. */
  clip: string;
  poster: string;
  /** The live journey's send date, and the matching milestone label. */
  when: string;
  /** The live touchpoint sheet's lede, verbatim (src/app/(site)/products/vip-guest-services/welcome/data.ts). */
  lede: string;
};

export const MOMENTS: Moment[] = [
  { fig: 'Day 1', figSub: 'Morning after booking', kick: 'Touchpoint 01', title: 'Welcome By Name', desc: 'Your team welcomes the guest by name, in their own voice.', img: 't2.jpg', clip: 'm4.mp4', poster: 'm4.jpg', when: 'Day 1', lede: "Your own team, in their own cloned voice, welcomes the guest by name, then a teaser of the room they booked turns into the suite they could have instead." },
  { fig: '48 hours', figSub: 'After booking', kick: 'Touchpoint 02', title: 'Dining, In Close-Up', desc: 'Signature dishes in close-up, with one tap to book the table.', img: 'f6.jpg', clip: 'm7.mp4', poster: 'm7.jpg', when: '48 hours', lede: "Fifteen seconds of signature dishes, the cocktail pour and the kitchen at work, with one tap to reserve the chef's table." },
  { fig: '7 days', figSub: 'Before arrival', kick: 'Touchpoint 03', title: 'Spa, Matched To Open Hours', desc: 'A spa teaser matched to the hours still open on their dates.', img: 't9.jpg', clip: 'm2.mp4', poster: 'm2.jpg', when: '7 days out', lede: "A hydrotherapy teaser sent a week before arrival, matched to the therapist hours still open on the guest's dates." },
  { fig: '48 hours', figSub: 'Before arrival', kick: 'Touchpoint 04', title: 'Arrival And Extensions', desc: 'Valet, arrival, and one tap for early check-in or an extra night.', img: 't16.jpg', clip: 'm9.mp4', poster: 'm9.jpg', when: '48 hours out', lede: "Valet, the chilled-towel greeting, and one tap to lock in early check-in, late checkout or an extra night." },
];

/* ---- calendar: the 30 days from booking to arrival ------------------------ */

/** Mon 3 Nov is Day 1, the live journey's first send; Tue 2 Dec is arrival. */
export const BOOKED = { label: 'Booked', date: 'Mon 3 Nov' };
export const ARRIVAL = { label: 'Arrival', date: 'Tue 2 Dec', note: 'See you on the 2nd.' };
