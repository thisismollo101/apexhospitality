/**
 * The rest of the live Welcome page, section by section, for the eleven
 * sections after Hero, Why and What 1: copy word for word from the live page
 * (WelcomeBody.tsx, TopSections.tsx, Behaviors.tsx and data.ts on the
 * production branch), copied rather than imported per CLAUDE.md. A '*' marks a
 * figure listed in the sources, as on the live page.
 *
 * Every "Watch" film on the live page plays vsl.mp4 under its own poster; the
 * same here.
 */
import type { Film } from './data';

/** A live-page "Watch" film: vsl.mp4 under the given poster. */
const watch = (poster: string, title: string, len: string): Film => ({ title, len, clip: 'vsl.mp4', poster });

/* ---- The potential · Wrong Way vs APEX Way ------------------------------- */

export type Row = { num: string; unit: string; title: string; text: string; src: string };

export const WRONG = {
  eye: 'The potential',
  headline: 'Boring Administrative Confirmations vs Apex Data Driven Revenue Engine.',
  vs: 'vs',
  apex: {
    pill: 'The APEX Way',
    label: 'Exceptional',
    headline: 'Same Guest. Same Booking. Two Very Different Stays.',
    /** the briefing film, as in the live APEX Way phone */
    film: { title: 'The APEX Way', clip: 'hq/screen-tall.mp4', hevc: 'hq/screen-tall-hevc.mp4', webm: 'hq/screen-tall.webm', poster: 'hq/screen-tall.jpg' } as Film,
    rows: [
      {
        num: '24',
        unit: 'Hours',
        title: '73% Influenced by Creator Content',
        text: '73% of travellers say creator or influencer recommendations have influenced their booking decisions. A personal film speaks that same language.',
        src: 'Expedia Group, 2025 Traveler Value Index [G-05]',
      },
      {
        num: '48',
        unit: 'Hours',
        title: '7 in 8 Guests Eat Dinner Elsewhere',
        text: 'Only about one in eight hotel guests eats dinner at the hotel. Reaching them before they arrive is how the table gets booked before they look anywhere else.',
        src: 'CBRE Hotels Americas, via Regulr [P05-2]',
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
  },
  old: {
    pill: 'The Wrong Way',
    label: 'Standard',
    headline: 'Stop Reminding Guests. Start Exciting Them.',
    sms: {
      kind: 'Text Message',
      when: 'Today 9:29AM',
      body: 'Hi Alex, this is a reminder of your reservation at our hotel on March 15. Your check-in time is 3:00 PM. Please confirm your arrival by replying YES or call us at 123-456-7890 if you need to make any changes.',
      input: 'Text message',
    },
    /** Monday-first, booked Mon 3 Nov, 30 days to arrival; nothing is sent on any of them. */
    calendar: { kick: 'Booking to check-in', start: Date.UTC(2025, 10, 3), days: 30 },
  },
};

/* ---- the particle-field statement ---------------------------------------- */

export const STARS = { lines: ["Don't wait on the universe to deliver.", 'We make the stars align.'] };

/* ---- How it works --------------------------------------------------------- */

export const HOW = {
  eye: 'How it works',
  headline: 'Your Team Becomes the Face of Every Arrival.',
  steps: [
    { name: 'Press play', poster: 'vsl-poster.jpg', len: '1:30', fig: 'Once', figLab: 'Your team records their voice', title: 'Ninety Seconds. The Whole Machine.', desc: 'One voice recording and your property’s own footage become a personal film for every guest who books.', foot: 'One recording session. Nothing for your team after that.' },
    { name: 'Your property, starring', poster: 'f4.jpg', len: '0:45', fig: '16', figLab: 'Clips in the matrix', title: 'See It Working Before You Sign.', desc: 'Book a private demo and we make a sample film first, so you see the format working before any contract.', foot: 'Proof first, before any contract is signed.' },
    { name: 'Your team, famous', poster: 'f1.jpg', len: '0:45', fig: '88%*', figLab: 'Trust recommendations from people they know', title: 'The Voice Your Guests Remember.', desc: 'We record your team once, with their written consent. Every welcome after that carries their own voice, cut with your property’s footage.', foot: '*Nielsen Trust in Advertising, 2021 [G-02].' },
    { name: 'Your events, sold out', poster: 'h19.jpg', len: '0:45', fig: '365', figLab: 'Days a year, one system', title: 'Your Events, Booked Before Guests Arrive.', desc: 'Galas, chef pop-ups and seasonal menus go into the films of guests whose dates overlap, weeks ahead.', foot: 'Limited-capacity events reach guests before they arrive.' },
    { name: 'In every pocket', poster: 'h5.jpg', len: '0:45', fig: '0', figLab: 'Apps, logins or portals', title: 'Your Brand, Straight to Their Phone.', desc: 'Sent from your daily arrivals export or booking emails, delivered by SMS or WhatsApp. One tap and it plays.', foot: 'Works alongside your PMS. No integration needed.' },
  ].map((s) => ({ ...s, film: watch(s.poster, s.title, s.len) })),
};

/* ---- What guests expect --------------------------------------------------- */

export const EXPECT = {
  eye: 'What guests expect',
  headline: 'This Is What Your Guests Expect. Not Another Plain-Text Email.',
  /** the live marquee's eleven clips, m0..m10, each with its poster */
  clips: Array.from({ length: 11 }, (_, i) => ({ title: `Guest film ${i + 1}`, clip: `m${i}.mp4`, poster: `m${i}.jpg` }) as Film),
};

/* ---- Who it's for --------------------------------------------------------- */

export const WHO = {
  eye: 'Who it’s for',
  headline: 'One Engine. A Different Film for Every Kind of Guest.',
  film: { ...watch('m3.jpg', 'One engine, three guest types', '0:45'), line: 'One engine, three guest types, the same property filmed three ways.' },
  when: ['The morning after booking', '48 hours later', '7 days before arrival', '48 hours before arrival'],
  guests: [
    {
      name: 'Individual',
      imgs: ['t2.jpg', 'f6.jpg', 't9.jpg', 'm2.jpg'],
      lines: ['Welcomed by name, then their room', 'A seat at the chef’s counter', 'Wellness hours built around one', 'Late checkout and lounge access'],
      data: '*Wellness travellers spend more per trip than the average tourist (GWI) [P08-5].',
    },
    {
      name: 'Couple',
      imgs: ['t2.jpg', 'f6.jpg', 't9.jpg', 'p27.jpg'],
      lines: ['Welcomed by name, then the suite upgrade', 'The candlelit tasting menu', 'Couples’ spa, side by side', 'Champagne on arrival'],
      data: '*96% of leisure travellers seek unique culinary experiences (World Food Travel Association, Food Travel Monitor 2020) [P05-3].',
    },
    {
      name: 'Family',
      imgs: ['t2.jpg', 'p23.jpg', 'm4.jpg', 't16.jpg'],
      lines: ['Welcomed by name, connecting rooms confirmed', 'Family dining, booked ahead', 'The kids’ club schedule', 'A pool cabana, reserved'],
      data: '',
    },
  ],
  cap: 'Matched to every guest by stay dates and guest profile. Nobody on your team picks the film.',
};

/* ---- Built on subtraction ------------------------------------------------- */

export const SUB = {
  eye: 'Built on subtraction',
  headline: 'Zero PMS Overhaul. No Daily Staff Work.',
  film: { ...watch('f1.jpg', 'Built on Subtraction', '1:30'), line: 'Built on Subtraction: everything we take off your plate.' },
  call: { kick: 'The whole commitment', big: ['Recorded once.', 'Runs every day.'], text: 'Your team records once. The films run on your property every single day after that.' },
  cards: [
    {
      k: 'Dream',
      title: 'Every Asset, Working.',
      stat: ['18%+*', 'of hotel income is ancillary revenue [P15-3]'],
      back: 'Every outlet filmed and put to work before arrival: the dining room, the spa, the suites, the events.',
      items: [
        ['18%+*', 'Ancillary revenue is more than 18% of total hotel income (Cloudbeds, vendor data) [P15-3].'],
        ['Every outlet.', 'Dining, spa, suites and events, each with its own film.'],
      ],
    },
    {
      k: 'Likelihood',
      title: 'Your Property, Your People.',
      stat: ['Never', 'stock footage'],
      back: 'Never stock footage. Your rooms, your outlets, and your staff as the stars.',
      items: [
        ['Your property.', 'Every frame filmed on site, at your hotel.'],
        ['Real voices.', 'Recorded by your own team, with consent, ideally the GM.'],
      ],
    },
    {
      k: 'Time',
      title: 'One Residency. Then Live.',
      stat: ['4–5 days', 'on site, one filming residency'],
      back: 'A single 4–5 day filming residency at your property. That is the whole production.',
      items: [
        ['Taster film.', 'In your hands right after signing.'],
        ['One residency.', 'No return shoots, no crew in the lobby every month.'],
      ],
    },
    {
      k: 'Effort',
      title: 'Light on Your Operation.',
      stat: ['1', 'monthly offers meeting'],
      back: "Once your manager's voice is recorded, it runs with no daily staff involvement.",
      items: [
        ['One monthly offers meeting.', 'The only ongoing commitment.'],
        ['Its own platform.', 'Works alongside your PMS. No integration needed: we work from a daily arrivals export or your booking emails.'],
      ],
    },
  ] as { k: string; title: string; stat: [string, string]; back: string; items: [string, string][] }[],
};

/* ---- What if · the four calculators -------------------------------------- */

export type Field = { id: string; label: string; pre?: string; suf?: string; min: number; max: number };
export type Calc = {
  tab: string;
  hero: string;
  tag: string;
  heroNote: string;
  vsl: { poster: string; len: string; line: string };
  why: [string, string][];
  f: Field[];
  rng: { label: string; min: number; max: number; step: number; maxFrom?: string };
  calc: (x: Record<string, number>, r: number) => { big: string; per: string; how: string };
};

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export const WHATIF = {
  eye: 'What if',
  headline: 'What If Every Offer Had Its Own TV Commercial?',
  why: 'Why this lever exists',
  numbers: 'Your numbers',
  result: 'Your result',
  fee: 'Apex takes 0% of this. Flat fee.',
  fill: 'Fill in every field and set the slider to see your result.',
  slide: 'Now set the slider.',
  modules: [
    {
      tab: 'Combat OTAs',
      hero: '15–30%',
      tag: 'G-09',
      heroNote: 'OTA commission, against 4–5% to book direct (Cloudbeds / Lighthouse) [G-09].',
      vsl: { poster: 'p30.jpg', len: '1:00', line: 'Most calculators use fake outlier rates. We think that’s garbage. Plug in your own numbers.' },
      why: [['10.6% vs 21.8%', 'Cancellation rate for direct bookings against OTA bookings. A channel fact, not a Welcome result (Cloudbeds, vendor data) [P03-6].']],
      f: [
        { id: 'rev', label: 'Annual OTA room revenue', pre: '$', min: 1, max: 1e10 },
        { id: 'rate', label: 'Your commission rate', suf: '%', min: 0.1, max: 50 },
      ],
      rng: { label: 'Commission, from your rate down to 0%', min: 0, max: 50, step: 0.5, maxFrom: 'rate' },
      calc: (x, r) => ({
        big: money((x.rev * (x.rate - r)) / 100),
        per: 'Commission kept per year',
        how: `Your OTA revenue (${money(x.rev)}) × the difference between your rate (${x.rate}%) and the new rate (${r}%).`,
      }),
    },
    {
      tab: 'Fine Dining & F&B',
      hero: '29.1%',
      tag: 'P05-1',
      heroNote: 'Hotel F&B departmental margin in H1 2025, across 2,669 US hotels (CBRE Hotels Research 2025) [P05-1].',
      vsl: { poster: 'f6.jpg', len: '0:55', line: 'Here is how your table gets booked before your guest looks anywhere else.' },
      why: [['7 in 8', 'Hotel guests eat dinner somewhere other than the hotel (CBRE Hotels Americas, via Regulr) [P05-2].']],
      f: [
        { id: 'cov', label: 'Dinner covers per month', min: 1, max: 1e7 },
        { id: 'chk', label: 'Your average check', pre: '$', min: 1, max: 1e5 },
        { id: 'seat', label: 'Restaurant seats', min: 1, max: 1e5 },
      ],
      rng: { label: 'Share of covers captured before arrival', min: 0, max: 100, step: 1 },
      calc: (x, r) => {
        const cap = x.seat * 30;
        const cov = Math.min((x.cov * r) / 100, cap);
        return {
          big: money(cov * x.chk),
          per: 'Pre-booked dinner revenue per month',
          how: `Your covers (${x.cov.toLocaleString('en-US')}) × ${r}% captured × your average check (${money(x.chk)}), capped by your ${x.seat} seats (${cap.toLocaleString('en-US')} covers a month, one sitting a night).`,
        };
      },
    },
    {
      tab: 'Spa',
      hero: '$6.8T',
      tag: 'P08-1',
      heroNote: 'The global wellness economy, forecast to reach $9.8T (Global Wellness Institute, Nov 2025) [P08-1].',
      vsl: { poster: 't9.jpg', len: '0:50', line: 'An empty treatment hour never comes back. Fill it before the guest lands.' },
      why: [
        ['50–75%', 'Ideal therapist utilisation (Cornell / Horwath) [P08-4].'],
        ['More', 'Wellness travellers spend more per trip than the average tourist (GWI) [P08-5].'],
      ],
      f: [
        { id: 'hrs', label: 'Unbooked therapist hours per month', min: 1, max: 1e6 },
        { id: 'price', label: 'Your average treatment price', pre: '$', min: 1, max: 1e5 },
        { id: 'rooms', label: 'Treatment rooms', min: 1, max: 1e4 },
      ],
      rng: { label: 'Share of hours filled in advance', min: 0, max: 100, step: 1 },
      calc: (x, r) => {
        const h = (x.hrs * r) / 100;
        return {
          big: money(h * x.price),
          per: 'Pre-booked treatment revenue per month',
          how: `Your unbooked hours (${x.hrs.toLocaleString('en-US')}) × ${r}% filled in advance × your average treatment (${money(x.price)}), across your ${x.rooms} treatment rooms.`,
        };
      },
    },
    {
      tab: 'Standby Suite Upgrades',
      hero: '18%+',
      tag: 'P15-3',
      heroNote: 'Ancillary revenue is more than 18% of total hotel income (Cloudbeds, vendor data) [P15-3].',
      vsl: { poster: 't2.jpg', len: '0:45', line: 'Your best rooms, shown before arrival, sold before check-in.' },
      why: [['11.2%', 'Higher rate for each one-point gain in review score, at the same occupancy (Cornell CHR, 2012) [G-15].']],
      f: [
        { id: 'rooms', label: 'Room count', min: 1, max: 1e5 },
        { id: 'adr', label: 'Your ADR', pre: '$', min: 1, max: 1e5 },
        { id: 'suites', label: 'Suite count', min: 1, max: 1e4 },
        { id: 'up', label: 'Upgrade price per night', pre: '$', min: 1, max: 1e5 },
      ],
      rng: { label: 'Upgrade take-up', min: 0, max: 20, step: 0.5 },
      calc: (x, r) => {
        const per = Math.min((x.rooms * r) / 100, x.suites);
        return {
          big: money(per * x.up * 30),
          per: 'Upgrade revenue per month',
          how: `Your rooms (${x.rooms}) × ${r}% take-up = ${Math.round(per * 10) / 10} upgrades a night, capped at your ${x.suites} suites, × your upgrade price (${money(x.up)}) × 30 nights. That is ${Math.round((x.up / x.adr) * 100)}% on top of your ADR.`,
        };
      },
    },
  ] as Calc[],
};

/* ---- Unlock access -------------------------------------------------------- */

export const UNLOCK = {
  eye: 'Unlock access',
  headline: 'Your Guests, Your Advertising.',
  steps: [
    { n: '1', h: 'The guest receives the film.', p: 'Their welcome, starring your team, on their phone.' },
    { n: '2', h: 'They tap Unlock Access.', p: 'A share link designed to be tracked, with the words already written:', q: 'What a welcome, can’t believe we just received this from our hotel.' },
    { n: '3', h: 'A bonus unlocks.', p: 'Sharing unlocks a bonus or a discount on their stay.' },
    { n: '4', h: 'You see every enquiry.', p: 'Your GM dashboard will show the enquiries and messages each link brings in.' },
  ] as { n: string; h: string; p: string; q?: string }[],
  dash: { title: 'GM dashboard', tag: 'Planned · Unlock Access', cols: ['Link', 'Shares', 'Clicks', 'Enquiries'], foot: 'Designed to track every shared link to the enquiry it brings.' },
  film: { ...watch('t2.jpg', 'Unlock Access', '1:00'), line: 'A forwarded film travels through a family group chat.' },
  stat: { fig: '88%*', text: 'Trust recommendations from people they know (Nielsen Trust in Advertising 2021) [G-02].' },
};

/* ---- Welcome for events --------------------------------------------------- */

export const EVENTS = {
  eye: 'Welcome for events',
  headline: 'Welcome, as a Product You Sell.',
  cards: [
    {
      k: 'Corporate & MICE',
      h: 'Every Attendee, Briefed Like a VIP.',
      p: 'The films carry the event itself, and the four touchpoints sell your extras in the month before.',
      li: ['Event info and times', 'The kick-off and what’s on', 'The location, filmed'],
      film: { ...watch('p16.jpg', 'Corporate & MICE', '1:00'), line: 'An event organiser’s welcome reaching every attendee.' },
      tag: 'Watch · 1:00 · An event organiser’s welcome reaching every attendee.',
    },
    {
      k: 'Weddings',
      h: 'Every Guest Gets the Films.',
      p: 'Welcome sits inside your wedding package. The couple shares the films through Unlock Access, and the deals are included.',
      li: ['Every guest receives the films', 'Shared by the couple', 'Deals included'],
      film: { ...watch('p2.jpg', 'Weddings', '0:45'), line: '' },
      tag: 'Wedding film · 0:45',
    },
  ],
};

/* ---- The Apex Continuum --------------------------------------------------- */

export const CONTINUUM = {
  eye: 'The Apex Continuum',
  headline: 'The Complete Guest Lifecycle. Welcome Is Just Chapter 1.',
  chapters: [
    { n: '1', when: 'Before the stay', h: 'Apex Welcome', c: '#2b59e0', p: 'Activating the silent gap between booking and arrival with personalised video touchpoints sent directly to arriving guests’ phones.' },
    { n: '2', when: 'Your storefront', h: 'Apex Atlas', c: '#2e8b8f', p: 'A digital storefront: another way to showcase your property, where everything you’ve built with Apex is revealed to guests without front-desk friction, turning guests into walking billboards.' },
    { n: '3', when: 'After the stay · Included', h: 'Apex Goodbye', c: '#6a3fa0', p: 'Included with Welcome. Day-after and one-month-later films bring guests back and collect private feedback.' },
  ],
  film: watch('h5.jpg', 'Welcome is just Chapter 1.', '0:45'),
  tag: 'Watch · 0:45 · "Welcome is just Chapter 1."',
  cta: {
    h: 'Your staff, the stars. Your property, the show.',
    plans: [
      ['Signature', '$10k'],
      ['Elite', '$25k'],
      ['Global', '$50k'],
    ] as [string, string][],
    per: 'a month.',
    setup: '$5,000 setup fee.',
    button: 'Contact sales',
    href: '/contact-sales',
  },
};

/* ---- Sources -------------------------------------------------------------- */

export const SOURCES = {
  heading: 'Sources',
  vendor: 'Vendor data.',
  brand: 'Figures marked * are listed above.',
  list: [
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
    { claim: '73% say creator or influencer recommendations have influenced their booking decisions.', src: 'Expedia Group, 2025 Traveler Value Index (May 2025), https://secure.businesswire.com/news/home/20250520512943/en/ [G-05]' },
  ] as { claim: string; src: string; vendor?: boolean }[],
};
