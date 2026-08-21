import { DEFAULTS } from './data';

export type Inputs = typeof DEFAULTS;

/**
 * Monthly OTA leakage = (R × 30 × Occ%) × OTA% × ADR × Comm%.
 *
 * Room-nights sold in a month, narrowed to the share booked through an OTA,
 * priced at rate, times the commission that share hands over. On the
 * wireframe's worked example — 150 rooms, $450, 75%, 40%, 20% — that is
 * $121,500 a month.
 */
export function leakage({ rooms, adr, occ, ota, comm }: Inputs): number {
  return rooms * 30 * (occ / 100) * (ota / 100) * adr * (comm / 100);
}

/** The 10% direct shift rule: a tenth of the leak is what a first year recovers. */
export function recaptured(inputs: Inputs): number {
  return leakage(inputs) * 0.1;
}

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const money = (n: number) => USD.format(Math.round(n));

/** Section 1B quotes the same recovery figure the calculator derives. */
export const DEFAULT_RECAPTURE = money(recaptured(DEFAULTS));
