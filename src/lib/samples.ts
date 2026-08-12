import data from '@/data/samples.json';

export type Sample = {
  slug: string;
  label: string;
  summary: string;
  /** `live` has a page.tsx; `pending` is a reserved slot waiting on markup. */
  status: 'live' | 'pending';
};

export const samplesLabel = data.label;
export const samples = data.items as Sample[];

/** Only the ones that actually resolve — used for the header dropdown. */
export function liveSamples(): Sample[] {
  return samples.filter((s) => s.status === 'live');
}
