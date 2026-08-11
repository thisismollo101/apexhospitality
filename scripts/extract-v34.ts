/**
 * Decompose apexherorevealv34.html into source files.
 *
 * v34 is the design source of truth: 9.3MB, of which ~9.24MB is base64 media
 * pasted inline and only ~76KB is real code. We take the style and the layout;
 * the inline media is exactly what this project exists to eliminate.
 *
 * Offline. Run once via `npm run extract:v34`. Parses the file — never hand-copies it.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SOURCE = resolve(ROOT, 'apexherorevealv34.html');

/** Token names v34 defines on :root. Preserved exactly — the build asserts all 33 survive. */
const EXPECTED_TOKENS = [
  'accent', 'bg', 'brandblue', 'card-gap', 'card-radius', 'card-w', 'cgap', 'dot',
  'ease', 'fg', 'hero', 'hot', 'hover', 'ink', 'line', 'line-2', 'live', 'muted',
  'muted-2', 'nav-h', 'navbg', 'open', 'radius', 'radius-sm', 'sales-a', 'sales-b',
  'sales-h', 'sans', 'sheet', 'sky', 'surface', 'surface-2', 'txt',
];

function die(message: string): never {
  console.error(`\nextract-v34: ${message}\n`);
  process.exit(1);
}

function write(relPath: string, contents: string): void {
  const full = resolve(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents, 'utf8');
  console.log(`  wrote ${relPath}  (${contents.length.toLocaleString()} chars)`);
}

/**
 * Extract a balanced `{...}` object literal starting at the first `{` at or after `from`.
 * Brace-counting rather than regex: the NAV object nests several levels deep and
 * contains braces inside string values.
 */
function extractObjectLiteral(src: string, from: number): string {
  const start = src.indexOf('{', from);
  if (start === -1) die('could not find an opening brace for the NAV object');

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return die('NAV object literal is unbalanced — braces never closed');
}

// ---------------------------------------------------------------- read source

if (!existsSync(SOURCE)) {
  die(
    'apexherorevealv34.html not found at the repo root.\n' +
    'It is the design source of truth and cannot be substituted. Commit it, then re-run.'
  );
}

const html = readFileSync(SOURCE, 'utf8');
console.log(`\nextract-v34: read ${html.length.toLocaleString()} bytes\n`);

// ------------------------------------------------------------- 1. design tokens

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) die('no <style> block found');
const css = styleMatch[1];

const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
if (!rootMatch) die('no :root block found inside <style>');

const tokens = new Map<string, string>();
// Strip CSS comments first: v34 groups tokens under /* ... */ headings, and a
// comment sitting between declarations otherwise swallows the token after it.
const rootBody = rootMatch[1].replace(/\/\*[\s\S]*?\*\//g, '');
for (const line of rootBody.split(/;\s*/)) {
  const m = line.match(/^\s*--([a-z0-9-]+)\s*:\s*([\s\S]+)$/i);
  if (m) tokens.set(m[1], m[2].trim());
}

const missing = EXPECTED_TOKENS.filter((t) => !tokens.has(t));
if (missing.length) {
  die(`expected tokens absent from :root — ${missing.join(', ')}`);
}
console.log(`  parsed ${tokens.size} design tokens (all ${EXPECTED_TOKENS.length} expected present)`);

// Everything after :root is layout/component CSS. Carried over as-is: it is the
// "look and layout" the owner asked to keep.
const componentCss = css.slice((rootMatch.index ?? 0) + rootMatch[0].length).trim();

const tokenLines = [...tokens].map(([k, v]) => `  --${k}: ${v};`).join('\n');

// Tailwind v4 keeps tokens in CSS. `@theme inline` re-exports them so utility
// classes (bg-bg, text-fg, ...) resolve to the same custom properties.
const themeLines = [...tokens]
  .map(([k]) => {
    const namespace =
      /^(bg|surface|surface-2|fg|muted|muted-2|line|line-2|accent|live|hot|open|brandblue|ink|txt|sky|sheet|navbg|dot|hero|hover|sales-a|sales-b)$/.test(k)
        ? 'color'
        : k === 'sans'
          ? 'font'
          : k === 'ease'
            ? 'ease'
            : /radius/.test(k)
              ? 'radius'
              : 'spacing';
    return `  --${namespace}-${k}: var(--${k});`;
  })
  .join('\n');

write(
  'src/app/globals.css',
  `@import 'tailwindcss';

/* ============================================================
   Apex Hospitality — design system
   Ported verbatim from apexherorevealv34.html by scripts/extract-v34.ts.
   Do not hand-edit: re-run \`npm run extract:v34\` to regenerate.
   ============================================================ */

:root {
${tokenLines}
}

/* Re-export tokens to Tailwind v4 utilities. */
@theme inline {
${themeLines}
}

/* ---- layout & components, carried over from v34 ---- */

${componentCss}
`
);

// ------------------------------------------------------------------ 2. navigation

const navIndex = html.indexOf('var NAV = {');
if (navIndex === -1) die('NAV object not found — it is the site map and cannot be reconstructed');

const navLiteral = extractObjectLiteral(html, navIndex);
let nav: unknown;
try {
  nav = JSON.parse(navLiteral);
} catch (err) {
  die(`NAV is not valid JSON: ${(err as Error).message}`);
}

write('src/data/navigation.json', JSON.stringify(nav, null, 2) + '\n');

// ------------------------------------------------------------------ 3. report

const inlineImages = (html.match(/data:image\/[a-z]+;base64/g) ?? []).length;
const inlineVideos = (html.match(/data:video\/[a-z0-9]+;base64/g) ?? []).length;
const base64Bytes = (html.match(/;base64,([A-Za-z0-9+/=]+)/g) ?? [])
  .reduce((sum, blob) => sum + blob.length, 0);

console.log(`
  skipped ${inlineImages} inline images and ${inlineVideos} inline videos
  (${(base64Bytes / 1_048_576).toFixed(2)} MB of base64 deliberately not carried over)

extract-v34: done.
`);
