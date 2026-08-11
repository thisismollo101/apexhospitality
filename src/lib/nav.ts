import navigation from '@/data/navigation.json';

export type NavItem = { label: string; href: string; badge?: string };
export type NavColumn = { heading: string; href: string; items: NavItem[] };
export type NavDropdown = { id: string; label: string; href?: string; panelWidth?: string; columns?: NavColumn[] };

export const nav = navigation;
export const brand = navigation.brand;

/** Every internal href NAV declares. The route-coverage test asserts against this. */
export function internalHrefs(): string[] {
  const found = new Set<string>();
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      const href = (node as { href?: unknown }).href;
      if (typeof href === 'string' && href.startsWith('/')) found.add(href);
      Object.values(node).forEach(walk);
    }
  };
  walk(navigation);
  return [...found].sort();
}

/**
 * Breadcrumb trail for a path, with labels resolved from NAV.
 * Never invents a label: if NAV does not name a segment, the segment is title-cased.
 */
export function breadcrumbs(pathname: string): NavItem[] {
  const labels = new Map<string, string>();
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      const n = node as { href?: unknown; label?: unknown; heading?: unknown };
      const name = n.label ?? n.heading;
      if (typeof n.href === 'string' && typeof name === 'string') labels.set(n.href, name);
      Object.values(node).forEach(walk);
    }
  };
  walk(navigation);

  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    return {
      href,
      label: labels.get(href) ?? seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };
  });
}
