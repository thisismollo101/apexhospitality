/**
 * Assert every internal href in navigation.json resolves to a page.
 * Asserted against the JSON rather than clicking 57 pages by hand.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { internalHrefs } from '../src/lib/nav.ts';

const ROOT = resolve(import.meta.dirname, '..');
const missing = internalHrefs().filter(
  (href) => !existsSync(resolve(ROOT, 'src/app', href.replace(/^\//, ''), 'page.tsx'))
);

if (missing.length) {
  console.error(`\nverify-routes: ${missing.length} href(s) in navigation.json have no page:\n`);
  missing.forEach((m) => console.error(`  ${m}`));
  process.exit(1);
}

console.log(`verify-routes: all ${internalHrefs().length} navigation hrefs resolve (+ / = ${internalHrefs().length + 1} routes)`);
