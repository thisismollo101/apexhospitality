/**
 * The strings and assets of the live Welcome page's Wrong Way vs APEX Way
 * section, copied from welcome/data.ts (not imported, per CLAUDE.md), plus the
 * two mini headings this sample adds.
 */

export const img = (name: string) => `/media/welcome/${name}`;

/** added: the two mini headings, Aidan's copy word for word, each headline set on two lines. */
export const HEADINGS = {
  wrong: { label: 'Wrong way, APEX way', lines: ['Stop Reminding Guests.', 'Start Exciting Them.'] },
  apex: { label: 'The difference', lines: ['Same Guest. Same Booking.', 'Two Very Different Stays.'] },
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
