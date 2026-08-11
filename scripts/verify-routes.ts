/**
 * Assert every internal href in navigation.json actually prerendered.
 *
 * Checks the build's prerender manifest rather than the filesystem: routes are
 * generated from a catch-all, so a page.tsx per route no longer exists and
 * file presence would prove nothing.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { internalHrefs } from '../src/lib/nav.ts';

const ROOT = resolve(import.meta.dirname, '..');
const MANIFEST = resolve(ROOT, '.next/prerender-manifest.json');

if (!existsSync(MANIFEST)) {
  console.error('\nverify-routes: no prerender manifest — run `npm run build` first.\n');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as { routes: Record<string, unknown> };
const prerendered = new Set(Object.keys(manifest.routes));

const expected = ['/', ...internalHrefs()];
const missing = expected.filter((href) => !prerendered.has(href));

if (missing.length) {
  console.error(`\nverify-routes: ${missing.length} of ${expected.length} route(s) did not prerender:\n`);
  missing.forEach((m) => console.error(`  ${m}`));
  process.exit(1);
}

console.log(`verify-routes: all ${expected.length} routes prerendered (${prerendered.size} total in manifest)`);
