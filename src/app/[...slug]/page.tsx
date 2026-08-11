import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import ProductDetail, { catalogue } from '@/components/ProductDetail';
import { internalHrefs, breadcrumbs } from '@/lib/nav';

/**
 * Every route below / is generated from navigation.json.
 *
 * One catch-all rather than 56 near-identical files: the nav is already the
 * single source of truth for the route tree, so the pages should be derived
 * from it rather than duplicated alongside it. dynamicParams=false means a
 * path NAV does not declare 404s instead of rendering an empty shell.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return internalHrefs().map((href) => ({ slug: href.replace(/^\//, '').split('/') }));
}

function titleFor(path: string): string {
  const trail = breadcrumbs(path);
  return trail[trail.length - 1]?.label ?? 'Apex Hospitality';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return { title: titleFor('/' + slug.join('/')) };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = '/' + slug.join('/');

  if (!internalHrefs().includes(path)) notFound();

  const product = catalogue[path];
  if (product) {
    return <ProductDetail path={path} title={titleFor(path)} product={product} />;
  }

  return (
    <PageShell
      path={path}
      title={titleFor(path)}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
