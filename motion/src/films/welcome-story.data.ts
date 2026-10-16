/*
 * Apex Welcome — the hero story. The Welcome page hero, told as a 15s film:
 *
 *   the leak → front desk 2–5% → Mobile Cinema 15–25% → 5x, zero staff
 *   → you're in the right place → Apex Welcome + the logo
 *
 * Copy is the hero section of /products/vip-guest-services/welcome. The two
 * conversion ranges carry the page's asterisk and its source. Times are in
 * beats at 128 BPM (1 beat = 0.46875s), so cuts land on the grid.
 */
export const BPM = 128;
export const BEATS = 32; // 15.0s

export const COL = {
  ink: '#06080F',
  blue: '#2A7BFF',
  white: '#FFFFFF',
  yellow: '#FFD84A',
  orange: '#FF6A1F',
};

export const STORY = {
  leak: { at: 0, len: 5, lines: ['This is the single', 'largest commercial leak', 'on your P&L.'] },
  desk: { at: 5, len: 5, pre: ['Front desk check-in upsells', 'convert at only'], fig: '2–5%', lit: 1 },
  cinema: { at: 10, len: 5, pre: ['Data Driven Mobile Cinema', 'converts at'], fig: '15–25%', lit: 5 },
  source: '* BookingWhizz / Akia. Sources pending verification.',
  five: { at: 15, len: 5, fig: '5x', lines: ['Your pre-arrival revenue.', 'Zero staff labour.'] },
  place: { at: 20, len: 3.5, lines: ['You’re in the', 'right place.'] },
  end: { at: 23.5, len: 8.5, product: 'Welcome', line: 'A personal film for every guest who books.', url: 'apexhospitality.online' },
};
