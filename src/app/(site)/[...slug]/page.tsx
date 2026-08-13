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

/**
 * Paths that have a page.tsx of their own and must not also be generated here.
 *
 * Next resolves a static segment ahead of a catch-all at request time, but the
 * build is a different matter: both pages write into one map keyed by pathname,
 * so whichever is emitted last wins. Today the static page happens to win, and
 * only because '[' sorts before the letter the real path starts with. If that
 * ever flipped, the catch-all would overwrite the real page and the route would
 * still prerender, still pass verify:routes, and quietly serve the scaffold
 * instead of its content — a silent swap with nothing to catch it.
 *
 * So the override is declared rather than left to sort order. Add a path here
 * when you add a route file that shadows one of NAV's hrefs.
 */
const OVERRIDDEN = new Set(['/products/vip-guest-services/welcome']);

export function generateStaticParams() {
  return internalHrefs()
    .filter((href) => !OVERRIDDEN.has(href))
    .map((href) => ({ slug: href.replace(/^\//, '').split('/') }));
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
