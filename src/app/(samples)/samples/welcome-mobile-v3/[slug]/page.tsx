import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SECTIONS } from '../data';
import { MORE } from '../more';

/** Every option of the eleven later sections, prerendered; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(MORE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [key, letter] = slug.split('-');
  const label = SECTIONS.find((s) => s.key === key)?.label ?? key;
  return { title: `Welcome · mobile v3 · ${label} ${letter?.toUpperCase()}` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Section = MORE[slug];
  if (!Section) notFound();
  return <Section />;
}
