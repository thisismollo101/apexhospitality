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

## Brand

The mark is a tetrahedron, apex-up: three faces on a 100×100 grid at fixed
opacities — left `.45`, right `1.0`, base `.22`. Never recolour a face on its own,
flatten the opacities, add a stroke or shadow, stretch it off-square, or rotate it.
Clear space is one third of its width; minimum size 16px.

| Where | What |
|---|---|
| Browser tab, iOS, link previews | `src/app/{favicon.ico,icon.svg,apple-icon.png}` and `src/app/(site)/opengraph-image.png` — Next's file conventions emit the tags |

The three icons carry the mark on its own `#06080F` ground, not on transparency:
the `.45` and `.22` faces wash out to nothing against a light browser tab.
`icon.svg` is the source of truth — `favicon.ico` is six PNG frames rendered from
it (16/32/48/64/128/256) and re-rendering is a headless-Chromium screenshot per
size, assembled into an ICO.
| The nav, and anywhere the mark should move | `src/components/ApexMark.tsx` |
| Anywhere else | `public/brand/svg/` and `public/brand/png/` (blue, white, black, currentcolor; 11 raster sizes) |

**The wordmark is a lockup, not one run of type.** "Apex" is heavy (800) and
mixed-case; HOSPITALITY is `0.74em`, weight 500, `+0.2em` tracking, brand blue.
That `0.74` is `.54/.73` — Inter's x-height over its cap height — so the capitals
stand exactly as tall as the "pex" beside them, top and bottom.
The words carry the weight and the blue carries the name. It runs at three
sizes — 37px in welcome-two's section 2, 19px in the nav, 17px in the footer —
so every ratio is in `em` and only the root size changes. `v34.css` still has
the old treatment (16px/900/uppercase/`+.11em`); `globals.css` restates that
half of `.brand` after the import, the same way it does `--brandblue`.

The one exception is the transparent nav over the hero, where HOSPITALITY stays
white at `.72`: the ground there is whatever video frame is playing, and brand
blue lands on a mid blue in most of them.

**Prefer the `currentcolor` mark.** It inherits the surrounding text colour, so it
follows the theme with no second file — which is exactly how the nav mark goes
white over the hero and dark once the nav turns solid.

`opengraph-image.png` sits in `(site)`, not at the app root. Icons resolve from
`src/app/` but the OG convention needs a segment that actually has a layout, and
`src/app/` has none — both layouts live inside route groups.

`ApexMark` is the pack's 3D mark: the tetrahedron tumbles, folds or shatters into
its rest pose, and the rest pose is the drawn artwork to a fraction of a pixel, so
it drops in wherever the flat mark was without shifting anything. The nav plays
`tumble` once on arrival. Under `prefers-reduced-motion` it renders one static
frame in the rest pose.

It server-renders the flat mark through `dangerouslySetInnerHTML`, so the logo is
correct in the HTML before any JS runs — and because React does not diff that
subtree, the effect is free to rewrite it. Everything is torn down on unmount;
`reactStrictMode` is on, so a leaked rAF loop would double on every dev mount.

**Brand blue is `#2A7BFF`.** v34 was built on `#5f9bef`, so `globals.css`
overrides `--brandblue` after the `v34.css` import. Do **not** "fix" it in
`v34.css` — that file is generated from the v34 export, which really does contain
`#5f9bef`, and the next `npm run extract:v34` would put it back. `#2A7BFF` on
white is ~4.0:1, under AA for 16px text; the pack's light-ground variant
`#1E56D6` clears it at ~6.4:1 if contrast beats exact hue.

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
