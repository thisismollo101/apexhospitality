# apexhospitality

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind v4 installed
but **not used as utility classes** — styling is hand-written CSS on v34 design tokens.

Deployed on Vercel from the repo's default branch. `@/*` maps to `./src/*`.

---

## The things that will bite you

### 1. There are two root layouts

`src/app/(site)/layout.tsx` and `src/app/(samples)/layout.tsx` each render their own
`<html>` and `<body>`.

- **`(site)`** — Header, Footer, `globals.css`. The real site.
- **`(samples)`** — no Header, no Footer, only `samples.css`. Design references live here
  and are meant to be uncontaminated by our chrome.

**Moving between the two groups must replace the document.** A `next/link` push keeps the
origin route's stylesheet alive underneath the destination and colours it. So every link
crossing the boundary is a plain `<a>`, never `<Link>`. `Header.tsx` has a `NavLink`
wrapper that does this automatically for any `/samples*` href. ESLint's
`no-html-link-for-pages` is switched off for `src/app/(samples)/**` for this reason —
it is on everywhere else, where it is right.

A page under `(samples)` that *wants* the real chrome renders `<Header />` and
`<Footer />` itself. `welcome-two` is the worked example.

### 2. One `@import` chain per route — never sibling CSS imports

Three sibling `import './x.css'` lines on one page left Turbopack emitting a sheet it
never linked, and the rules silently did not load. The page renders unstyled with no
error.

So a route has exactly **one** stylesheet, and that file `@import`s whatever else it
needs at the top:

```css
@import '../../../globals.css';
@import '../../../(site)/products/vip-guest-services/welcome/welcome.css';
```

If a page renders unstyled, suspect this first.

### 3. Every route's CSS is scoped to a root class

`.rv1`, `.kit`, `.axpage`, `.wpage`, `.w2page` — each route's stylesheet is scoped under
its own class so it cannot reach another route. Pick a new one for a new page.

The single deliberate exception is `.w2exp*` in `welcome-two/style.css`: that layer is
portalled to `<body>` to escape transformed ancestors, so it cannot sit under the page
scope. Safe because the App Router only ships a stylesheet on the route that imports it.

### 4. No new palette, no second typeface

Everything is built on v34's tokens — `--fg`, `--bg`, `--surface`, `--surface-2`,
`--muted`, `--muted-2`, `--line`, `--line-2`, `--radius`, `--radius-sm`, `--hover`,
`--ease`, `--nav-h`, `--sales-h`. Reference files and mockups routinely arrive carrying
their own palettes; map them onto these instead of importing them.

There is no spacing scale. Spacing is hardcoded px.

### 5. `src/app/v34.css` is generated — do not hand-edit

It is produced by `scripts/extract-v34.ts` from `apexherorevealv34.html`. Edit the script
and re-run `npm run extract:v34`.

### 6. The header is two fixed bars, 126px total

`.sales` (`--sales-h`, 54px) sits at top:0, `#nav` (`--nav-h`, 72px) directly under it.
`.page` clears them with `padding-top: calc(var(--sales-h) + var(--nav-h) + 48px)`.

A full-bleed hero on a page **with** chrome is
`min-height: calc(100svh - var(--sales-h) - var(--nav-h))`, not `100svh` — otherwise
126px of it hides behind the bars.

`Header.tsx` only allows a transparent nav on `/` (`solid = pathname !== '/' || scrolled`).
Every other route gets an opaque nav from the first pixel.

---

## Where content comes from

| File | Drives |
|---|---|
| `src/data/navigation.json` | Header menus, footer clusters, **and** the `(site)/[...slug]` catch-all, which generates ~54 routes from it |
| `src/data/products.json` | 18 products, keyed by href, each with `tier` / `concept` / `math` / `quote` |
| `src/data/samples.json` | The `/samples` index and the header's Sample Pages dropdown |

**Never put a `/samples` href in `navigation.json`** — the catch-all would generate a page
that already exists as a file.

Resolve a product's display name with `breadcrumbs(href).at(-1)?.label` from
`src/lib/nav.ts` rather than restating it, so a nav rename follows through.

## Adding a sample page

1. `src/app/(samples)/samples/<slug>/page.tsx` + `style.css` beside it.
2. Add `{ slug, label, summary, status: "live" }` to `samples.json` — that one edit
   registers it in both the index and the dropdown.
3. Register it as `"pending"`, not `"live"`, until the page actually builds. A `"live"`
   slug with no working page puts a dead link in the site header.

`scripts/verify-routes.ts` reads `navigation.json` only, so it neither validates nor
blocks sample pages.

## Building a page section by section

`welcome-two` is the pattern worth copying:

- **`data.ts`** holds every string and asset name. The page itself contains no copy, so
  swapping placeholder media or rewriting a headline is a one-file edit.
- **One component per section**, `'use client'` only where it needs hooks or the DOM.
- **`page.tsx`** is just the section order.

## Media

Lives in `public/media/`, referenced root-relative.

- `/media/cards/<name>.{webm,mp4,jpg}` — 7 real clips: `welcome`, `flagship`,
  `accommodation`, `dining`, `weddings`, `corporate`, `international`. All three formats
  exist for every one.
- `/media/samples/<shape>/<1-7>.jpg` — placeholder kit, shapes `16x9 4x3 1x1 9x16 avatar`.

**Video never autoplays by attribute.** An IntersectionObserver starts it on screen and
pauses it off, and `prefers-reduced-motion` leaves the poster up and never calls `play()`.
Use `Clip.tsx` for one or two clips; for many, drive them all from a single observer on
the section (see `PostsMarquee.tsx`).

Set `muted` as a property in an effect, not just the JSX attribute — React does not
reliably emit it into the server HTML, and an unmuted clip is refused autoplay.

## Commands

```
npm run dev            # dev server
npm run build          # production build; also type-checks
npm run lint           # eslint
npm run extract:v34    # regenerate src/app/v34.css
npm run verify:routes  # needs a build first; checks navigation.json routes prerendered
```

CI runs `npm ci`, `npm run lint` and `npm run build` on every push and PR.

## Known, deliberate

- `<img>` warnings in sample pages — placeholders sized by CSS; `next/image` would re-crop
  them. Left as warnings on purpose.
- `--sans` in `v34.css` is the literal string `"Inter"`, while `next/font` registers Inter
  under a generated name. `(site)` sets `inter.variable` (defining `--font-inter`, which
  nothing references) and `(samples)` sets `inter.className`. Worth fixing properly one
  day; affects both groups the same way, so do not chase it in a single route.
