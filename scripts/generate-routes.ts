/**
 * Scaffold a page for every internal href in navigation.json.
 *
 * Standing the whole tree up before templates land surfaces breadcrumb and
 * active-state bugs immediately rather than on page 40. Never overwrites a page
 * that already exists — hand-built templates win.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { internalHrefs, breadcrumbs } from '../src/lib/nav.ts';

const ROOT = resolve(import.meta.dirname, '..');

const hrefs = internalHrefs();
let created = 0;
let skipped = 0;

for (const href of hrefs) {
  const file = resolve(ROOT, 'src/app', href.replace(/^\//, ''), 'page.tsx');
  if (existsSync(file)) { skipped++; continue; }

  const trail = breadcrumbs(href);
  const title = trail[trail.length - 1]?.label ?? 'Apex Hospitality';

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(
    file,
    `import PageShell from '@/components/PageShell';

export const metadata = { title: ${JSON.stringify(title)} };

export default function Page() {
  return (
    <PageShell
      path=${JSON.stringify(href)}
      title={${JSON.stringify(title)}}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
`,
    'utf8'
  );
  created++;
}

console.log(`generate-routes: ${created} created, ${skipped} already present, ${hrefs.length} total`);
