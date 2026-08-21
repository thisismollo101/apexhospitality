# Apex — logo pack

The mark is a tetrahedron: three visible faces at fixed opacities, no lighting,
no gradients. Drawn on a 100×100 grid.

```
face          points                opacity
left          50,11  9,85  50,63    0.45
right         50,11  91,85 50,63    1.00
base          9,85   91,85 50,63    0.22
```

Brand blue is `#2A7BFF`.

---

## What to use where

| Need | File |
|---|---|
| Website, app, anywhere with CSS | `svg/apex-mark-currentcolor.svg` |
| Fixed blue, any size | `svg/apex-mark-blue.svg` |
| On blue, on photography | `svg/apex-mark-white.svg` |
| One-colour print, faxes, stamps | `svg/apex-mark-black.svg` |
| Nav bar, email signature | `svg/apex-lockup-horizontal.svg` |
| Title cards, merchandise, tight columns | `svg/apex-lockup-stacked.svg` |
| Browser tab | `favicon/favicon.ico` |
| iOS home screen | `favicon/apple-touch-icon.png` |
| Android / PWA | `favicon/maskable-512.png` |
| Link previews | `social/og-image.png` |
| Anything that can't take SVG | `png/` — blue, white and black at 11 sizes |

**Use the `currentcolor` SVG wherever you can.** It inherits the surrounding
text colour, so the mark follows your theme automatically — no second file for
dark mode, no swapping assets.

---

## Rules

**Clear space.** Keep a margin of one third of the mark's width on all sides.
Nothing intrudes — no text, no rules, no image edges.

**Minimum size.** 16px on screen, 6mm in print. Below that the 0.22 base face
disappears and it stops reading as a solid.

**Never** recolour individual faces, flatten the three opacities to one, add a
stroke, outline, shadow or glow, stretch it off-square, or rotate it. The mark
sits apex-up. It's a summit; upside down it means nothing.

**On busy photography** use the white mark on a darkened area, not the blue.

---

## Favicon markup

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/apex-mark-blue.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

The SVG line matters — modern browsers prefer it and it stays sharp on retina
displays where the `.ico` does not.

---

## A note on the lockup SVGs

The two lockups set the wordmark as live `<text>`, so they need Aeonik or Inter
present to render as intended; they fall back to Helvetica otherwise. For print
or anywhere the font can't be guaranteed, convert the text to outlines first.
`apex-lockup-sting.html` is the animated version of the horizontal lockup.

---

## Regenerating the rasters

Every PNG here is rendered from the same three polygons at 16× and downsampled,
which is why the 16px still has clean edges. If you need a size that isn't in
`png/`, generate it from the SVG rather than scaling an existing PNG up.
