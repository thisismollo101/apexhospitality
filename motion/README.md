# motion

Motion graphics burned into our films, built with [Remotion](https://remotion.dev)
(React components rendered frame by frame to MP4). Separate package from the site:
its own `package.json` and `node_modules`, and excluded from the site's tsconfig and ESLint.

```
cd motion
npm install
npm run studio                 # live preview + scrubbing in the browser
npm run render:welcome-hero    # → out/welcome-hero.mp4 (1920×1080, 30fps)
```

Footage is read from the site's own `public/media/` through a symlink
(`npm run link-media` makes it), so there is one copy of every clip.

## Layout

| Path | What |
|---|---|
| `src/brand.ts` | v34 tokens restated for video — ink, brand blue, the mark's faces, `--ease` |
| `src/parts/` | Reusable pieces: animated `Mark`, `Lockup`, `KineticTitle`, `LowerThird`, `Statement`, `StatCallout`, `Compare`, `Wipe`, `Glint`, `Grade`, `Bug`, `EndCard` |
| `src/films/<film>.tsx` | One film: the footage plus the layering order. No copy. |
| `src/films/<film>.data.ts` | Every word, figure and timing for that film |

Same rule as the site's pages: the film file holds no copy, so rewording a line or
nudging a beat onto a different cut is a one-file edit in `*.data.ts`.

Figures marked `*` are unverified, exactly as on the page they come from — keep the
two in step.

The render browser has no network, so Inter is bundled from `@fontsource-variable/inter`,
not Google Fonts. `remotion.config.ts` points at the pre-installed headless Chromium;
on a laptop, delete that line and Remotion fetches its own.
