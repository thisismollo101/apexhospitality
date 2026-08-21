import { DEFAULTS } from './data';

export type Inputs = typeof DEFAULTS;

/** 30.4 days a month, not 30 — the spec's figure, and it matters at scale. */
const DAYS = 30.4;

/** Room-nights sold, priced at rate. */
export function revenue({ rooms, adr, occupancy }: Inputs): number {
  return rooms * DAYS * (occupancy / 100) * adr;
}

/** The red card: what the OTA share hands over in commission each month. */
export function leak(v: Inputs): number {
  return revenue(v) * (v.otaShare / 100) * (v.otaCommission / 100);
}

/** The green card: a deliberately conservative 15% shift back to direct. */
export function recaptured(v: Inputs): number {
  return leak(v) * 0.15;
}

/** The gold card: automated touchpoint flows generated a month, four per guest. */
export function touchpoints({ rooms, occupancy }: Inputs): number {
  return rooms * (occupancy / 100) * DAYS * 4;
}

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const money = (n: number) => USD.format(Math.round(n));
export const count = (n: number) => Math.round(n).toLocaleString('en-US');

/** Section 3 quotes what section 4 computes, rather than restating it. */
export const DEFAULT_RECAPTURE = money(recaptured(DEFAULTS));
