/*
 * Motion hero engine: a 15-second loop at 128 BPM (32 beats), drawn from the
 * Apex tetrahedron. Pure functions of time — `draw(ctx, t, L)` paints the
 * canvas and `textState(t, L)` says where the few words sit — so the same
 * frame comes out whether it is played live, scrubbed, or captured.
 *
 * Units: the focal content is laid out in "u", a 1000u box centred in the
 * region the caller leaves free (L.cx, L.cy, L.u px per u). Background and
 * HUD use the full canvas.
 *
 *   beats 0–7    intro: the phone frame opens into the studio
 *   beats 7–23   four sections, 4 beats each
 *   beats 23–32  resolve into the mark + lockup + headline, close back to the phone
 */

export const BPM = 128;
export const BEAT = 60 / BPM; // 0.46875s
export const LOOP = 32 * BEAT; // 15.0s

/* Brand blue carries everything; each section adds one hot accent on top. */
export const ACCENT = { orange: '#FF6A1F', amber: '#FFB020', yellow: '#FFD84A' };

export const SECTIONS = [
  { at: 7, label: '01 COMBAT OTAs', accent: ACCENT.orange },
  { at: 11, label: '02 DINING', accent: ACCENT.amber },
  { at: 15, label: '03 SPA', accent: ACCENT.yellow },
  { at: 19, label: '04 SUITE UPGRADES', accent: ACCENT.orange },
] as const;
const END = 23;
const REST = END + 2.5; // the mark lands exactly here
const CLOSE = 31; // phone frame starts closing back to beat 0

export const REST_TIME = (END + 6) * BEAT; // a still of the resolved end card

const BLUE = '#2A7BFF';
const INK = '#06080F';
const WHITE = '#FFFFFF';

/* The mark: three faces on a 100×100 grid at fixed opacities. */
const FACES: { p: [number, number][]; a: number }[] = [
  { p: [[50, 11], [9, 85], [50, 63]], a: 0.45 },
  { p: [[50, 11], [91, 85], [50, 63]], a: 1 },
  { p: [[9, 85], [91, 85], [50, 63]], a: 0.22 },
];
const TINT = [0.45, 1, 0.22];

export type Layout = {
  W: number; // canvas css px
  H: number;
  cx: number; // focal centre, px
  cy: number;
  u: number; // px per unit
  hudTop: number; // px from top the HUD may start at
  inset: number; // HUD side inset, px
};

/* ---------------------------------------------------------------- easing */

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (b: number, a: number, d: number) => clamp((b - a) / d);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eo3 = (t: number) => 1 - Math.pow(1 - t, 3);
const eio3 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eoExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const eiExpo = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
const eob = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
/** 1 on the beat, decaying to 0 before the next. */
const pulse = (b: number) => Math.exp(-(b - Math.floor(b)) * 5);
/** A move that steps on every `step` beats, easing within each step. */
const stepped = (b: number, step: number, n: number) => {
  const k = Math.floor(b / step);
  const f = eoExpo(clamp((b / step - k) * 2.2));
  return clamp((k + f) / n);
};

/* ------------------------------------------------------------- primitives */

type V = [number, number];

function poly(ctx: CanvasRenderingContext2D, pts: V[], color: string, alpha: number) {
  if (alpha <= 0.003) return;
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** An equilateral-ish triangle centred at (x,y), side s, rotated r, apex up at r=0. */
function triAt(x: number, y: number, s: number, r: number): V[] {
  const h = (s * Math.sqrt(3)) / 2;
  const pts: V[] = [[0, -(2 / 3) * h], [-s / 2, h / 3], [s / 2, h / 3]];
  const c = Math.cos(r);
  const sn = Math.sin(r);
  return pts.map(([px, py]) => [x + px * c - py * sn, y + px * sn + py * c]);
}

type FaceMove = { dx: number; dy: number; rot: number; k: number; alpha: number };
const REST_MOVE: FaceMove = { dx: 0, dy: 0, rot: 0, k: 1, alpha: 1 };

/**
 * One face of the mark at (x,y) = grid centre, `size` px across. With
 * REST_MOVE it is the drawn artwork exactly; otherwise it is a loose facet,
 * moved, spun and scaled about its own centroid.
 */
function face(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, size: number, m: FaceMove = REST_MOVE) {
  const f = FACES[i];
  const pts = f.p.map(([gx, gy]) => [x + ((gx - 50) / 100) * size, y + ((gy - 50) / 100) * size] as V);
  const gx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
  const gy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
  const c = Math.cos(m.rot);
  const s = Math.sin(m.rot);
  const out = pts.map(([px, py]) => {
    const ox = (px - gx) * m.k;
    const oy = (py - gy) * m.k;
    return [gx + m.dx + ox * c - oy * s, gy + m.dy + ox * s + oy * c] as V;
  });
  poly(ctx, out, BLUE, f.a * m.alpha);
}

function mark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha = 1) {
  for (let i = 0; i < 3; i++) face(ctx, i, x, y, size, { ...REST_MOVE, alpha });
}

/** Regular tetrahedron, apex up, as six projected edges. */
function wireTetra(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, ay: number, ax: number, alpha: number) {
  if (alpha <= 0.003) return;
  const r = Math.sqrt(8) / 3;
  const verts = [
    [0, -1, 0],
    [r * Math.cos(Math.PI / 2), 1 / 3, r * Math.sin(Math.PI / 2)],
    [r * Math.cos((7 * Math.PI) / 6), 1 / 3, r * Math.sin((7 * Math.PI) / 6)],
    [r * Math.cos((11 * Math.PI) / 6), 1 / 3, r * Math.sin((11 * Math.PI) / 6)],
  ].map(([vx, vy, vz]) => {
    // rotate Y then X, then perspective
    const x1 = vx * Math.cos(ay) + vz * Math.sin(ay);
    const z1 = -vx * Math.sin(ay) + vz * Math.cos(ay);
    const y2 = vy * Math.cos(ax) - z1 * Math.sin(ax);
    const z2 = vy * Math.sin(ax) + z1 * Math.cos(ax);
    const p = 3.2 / (3.2 + z2);
    return [x + x1 * R * p, y + y2 * R * p] as V;
  });
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  for (const [a, b] of [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]]) {
    ctx.moveTo(verts[a][0], verts[a][1]);
    ctx.lineTo(verts[b][0], verts[b][1]);
  }
  ctx.stroke();
  // the summit point
  ctx.globalAlpha = alpha * 1.6;
  ctx.fillStyle = BLUE;
  ctx.beginPath();
  ctx.arc(verts[0][0], verts[0][1], 3, 0, Math.PI * 2);
  ctx.fill();
}

/* ------------------------------------------------------------ background */

/**
 * Triangle lattice over the whole canvas, tinted with the mark's three
 * opacities. A diagonal wave runs across it on every beat.
 */
function lattice(ctx: CanvasRenderingContext2D, b: number, L: Layout, level: number, clearR = 0) {
  if (level <= 0.003) return;
  const side = Math.max(L.W, L.H) / 13;
  const h = (side * Math.sqrt(3)) / 2;
  const cols = Math.ceil(L.W / (side / 2)) + 2;
  const rows = Math.ceil(L.H / h) + 1;
  const front = (b - Math.floor(b)) * 1.6 - 0.3; // 0..1 across the diagonal
  const diag = L.W + L.H;
  for (let r = 0; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const up = (r + c) % 2 === 0;
      const x0 = c * (side / 2);
      const y0 = r * h;
      const pts: V[] = up
        ? [[x0 + side / 2, y0], [x0, y0 + h], [x0 + side, y0 + h]]
        : [[x0, y0], [x0 + side, y0], [x0 + side / 2, y0 + h]];
      const mx = x0 + side / 2;
      const my = y0 + h / 2;
      const d = (mx + my) / diag;
      const wave = Math.exp(-Math.pow((d - front) / 0.07, 2));
      let a = TINT[(((r * 2 + c) % 3) + 3) % 3] * (0.05 + wave * 0.22 * pulse(b + 0.0)) * level;
      if (clearR > 0) {
        const dist = Math.hypot(mx - L.cx, my - L.cy) / L.u;
        a *= clamp((dist - clearR) / 160);
      }
      poly(ctx, pts, BLUE, a);
    }
  }
}

/** The summit leads each cut: three chevrons, tinted 1 / .45 / .22, sweep up. */
function chevrons(ctx: CanvasRenderingContext2D, b: number, at: number, L: Layout, accent: string) {
  const p = (b - (at - 0.5)) / 1.1;
  if (p <= 0 || p >= 1) return;
  const span = L.H * 2.4;
  const half = Math.max(L.W, L.H) * 1.3;
  for (let i = 0; i < 3; i++) {
    const q = eio3(clamp(p * 1.25 - i * 0.1));
    const apex = lerp(L.H + L.H * 0.3, -span, q);
    const band = L.H * 0.16;
    ctx.globalAlpha = [1, 1, 0.45][i];
    ctx.fillStyle = [accent, BLUE, BLUE][i];
    ctx.beginPath();
    ctx.moveTo(L.W / 2, apex);
    ctx.lineTo(L.W / 2 - half, apex + span);
    ctx.lineTo(L.W / 2 + half, apex + span);
    ctx.closePath();
    ctx.moveTo(L.W / 2, apex + band);
    ctx.lineTo(L.W / 2 + half, apex + span + band);
    ctx.lineTo(L.W / 2 - half, apex + span + band);
    ctx.closePath();
    ctx.fill('evenodd');
  }
}

/* ------------------------------------------------------------ the phone */

const PHONE = { w: 190, h: 400, r: 36 };

function phoneRect(L: Layout, open: number) {
  // open 0 = phone at the focal centre, 1 = past the canvas edges
  const w0 = PHONE.w * L.u;
  const h0 = PHONE.h * L.u;
  const w1 = L.W * 1.1 + Math.abs(L.cx - L.W / 2) * 2;
  const h1 = L.H * 1.1 + Math.abs(L.cy - L.H / 2) * 2;
  const w = lerp(w0, w1, open);
  const h = lerp(h0, h1, open);
  return { x: L.cx - w / 2, y: L.cy - h / 2, w, h, r: lerp(PHONE.r * L.u, 0, open) };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* -------------------------------------------------------------- sections */

function combatOtas(ctx: CanvasRenderingContext2D, lb: number, L: Layout, vis: number, A: string) {
  const { cx, cy, u } = L;
  const n = 14;
  const span = 860;
  const s = span / ((n + 1) / 2); // strip of alternating triangles
  const knob = stepped(lb - 0.3, 0.5, 6); // steps on every half beat
  const kx = cx + (-span / 2 + knob * span) * u;
  for (let i = 0; i < n; i++) {
    const x = cx + (-span / 2 + (i + 1) * (s / 2)) * u;
    const up = i % 2 === 0;
    const behind = x < kx;
    const enter = eo3(seg(lb, i * 0.04, 0.4));
    if (behind) {
      poly(ctx, triAt(x, cy, s * u * 0.92, up ? 0 : Math.PI), BLUE, TINT[i % 3] * vis * enter);
    } else {
      // third-party tiles: faint, and knocked away as the knob reaches them
      const hit = clamp((kx + s * u * 1.2 - x) / (s * u * 1.2));
      const fly = eo3(hit);
      poly(
        ctx,
        triAt(x + fly * 120 * u, cy - fly * (80 + i * 9) * u, s * u * 0.92 * (1 - fly * 0.6), (up ? 0 : Math.PI) + fly * 2.4),
        WHITE,
        0.16 * vis * enter * (1 - fly),
      );
    }
  }
  // the knob is a facet of the mark, carried along the track
  const bob = Math.sin(lb * Math.PI * 2) * 4 * u;
  poly(ctx, triAt(kx, cy - 150 * u + bob, 150 * u, 0), A, vis);
  poly(ctx, triAt(kx, cy - 150 * u + bob + 26 * u, 60 * u, Math.PI), INK, vis);
  // tick ladder below: abstract counter
  for (let i = 0; i < 24; i++) {
    const on = i / 24 < knob;
    const x = cx + (-span / 2 + (i / 23) * span) * u;
    ctx.globalAlpha = vis * (on ? 0.9 : 0.18);
    ctx.fillStyle = on ? (i / 24 > knob - 0.08 ? A : BLUE) : WHITE;
    const hh = (on ? 26 + 18 * pulse(lb * 2 + i * 0.07) : 14) * u;
    ctx.fillRect(x - 2 * u, cy + 110 * u, 4 * u, hh);
  }
}

function dining(ctx: CanvasRenderingContext2D, lb: number, L: Layout, vis: number, A: string) {
  const { cx, cy, u } = L;
  const n = 24;
  const R = 300;
  const fill = stepped(lb - 0.2, 0.25, 13) * n; // quarter-beat steps
  const spin = lb * 0.18;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + spin;
    const x = cx + Math.cos(a) * R * u;
    const y = cy + Math.sin(a) * R * u;
    const on = i < fill;
    const lead = on && i >= fill - 2;
    const pop = on ? eob(clamp(fill - i)) : 1;
    const enter = eo3(seg(lb, (i / n) * 0.5, 0.5));
    poly(ctx, triAt(x, y, 54 * u * pop * enter, a + Math.PI / 2), lead ? A : on ? BLUE : WHITE, (lead ? 1 : on ? TINT[i % 3] : 0.14) * vis);
  }
  // counter-rotating inner ring
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - lb * 0.35;
    poly(ctx, triAt(cx + Math.cos(a) * 170 * u, cy + Math.sin(a) * 170 * u, 30 * u, a - Math.PI / 2), BLUE, 0.22 * vis);
  }
  // the needle: a long summit pointing at the fill front
  const na = (fill / n) * Math.PI * 2 - Math.PI / 2 + spin;
  const tip: V = [cx + Math.cos(na) * 230 * u, cy + Math.sin(na) * 230 * u];
  const l: V = [cx + Math.cos(na + Math.PI / 2) * 14 * u, cy + Math.sin(na + Math.PI / 2) * 14 * u];
  const r: V = [cx + Math.cos(na - Math.PI / 2) * 14 * u, cy + Math.sin(na - Math.PI / 2) * 14 * u];
  poly(ctx, [tip, l, r], A, vis);
  mark(ctx, cx, cy + 4 * u, 90 * u * (0.9 + 0.1 * pulse(lb)), vis);
}

function spa(ctx: CanvasRenderingContext2D, lb: number, L: Layout, vis: number, A: string) {
  const { cx, cy, u } = L;
  const n = 5;
  const H = 520;
  for (let i = 0; i < n; i++) {
    const x = cx + (-360 + i * 180) * u;
    const enter = eo3(seg(lb, i * 0.12, 0.6));
    // track
    ctx.globalAlpha = 0.18 * vis * enter;
    ctx.fillStyle = WHITE;
    ctx.fillRect(x - 1.5 * u, cy - (H / 2) * u, 3 * u, H * u);
    // slow breathing level, eased sine, phase-shifted per slider
    const lvl = 0.5 + 0.36 * Math.sin((lb / 4) * Math.PI * 2 * 0.75 + i * 0.9) * enter;
    const ky = cy + (H / 2 - lvl * H) * u;
    ctx.globalAlpha = TINT[i % 3] * vis * enter;
    ctx.fillStyle = BLUE;
    ctx.fillRect(x - 5 * u, ky, 10 * u, cy + (H / 2) * u - ky);
    // knob: a facet, spun slowly
    poly(ctx, triAt(x, ky, 64 * u, Math.sin(lb * 0.8 + i) * 0.35), i === 2 ? A : BLUE, (i === 2 || i % 2 ? 1 : 0.45) * vis * enter);
  }
  // a calm wave of small facets across the base
  for (let i = 0; i < 26; i++) {
    const x = cx + (-430 + i * 34.4) * u;
    const y = cy + (H / 2 + 70 + Math.sin(lb * 1.6 + i * 0.5) * 16) * u;
    poly(ctx, triAt(x, y, 18 * u, Math.PI), i % 5 === 0 ? A : BLUE, (i % 5 === 0 ? 0.7 : 0.22) * vis * (0.6 + 0.4 * Math.sin(lb * 1.6 + i * 0.5)));
  }
}

function suites(ctx: CanvasRenderingContext2D, lb: number, L: Layout, vis: number, scatter: number, A: string) {
  const { cx, cy, u } = L;
  const rows = 6;
  const s = 96; // small triangle side, u
  const h = (s * Math.sqrt(3)) / 2;
  const top = -((rows * h) / 2) + 20;
  const built = stepped(lb - 0.1, 0.5, rows) * rows; // a row per half beat, bottom up
  for (let r = 0; r < rows; r++) {
    const rowFromBottom = rows - 1 - r;
    const on = clamp(built - rowFromBottom);
    if (on <= 0) continue;
    const y0 = cy + (top + r * h) * u;
    for (let k = 0; k < 2 * r + 1; k++) {
      const up = k % 2 === 0;
      const x = cx + (-(r * s) / 2 + (k * s) / 2) * u;
      const yc = up ? y0 + (2 / 3) * h * u : y0 + (h / 3) * u;
      const pop = eob(on);
      const id = r * 3 + k;
      // on the way out each tile is thrown toward the centre and shrinks
      const sx = Math.cos(id * 2.4) * 420 * scatter;
      const sy = Math.sin(id * 1.7) * 300 * scatter;
      poly(
        ctx,
        triAt(x + sx * u, yc + sy * u, s * u * 0.94 * pop * (1 - scatter * 0.7), (up ? 0 : Math.PI) + scatter * id * 0.3),
        BLUE,
        TINT[(r + k) % 3] * vis * (1 - scatter),
      );
    }
  }
  // the summit above the stack, rising on each row
  const sy = cy + (top - 70 - built * 6) * u;
  poly(ctx, triAt(cx, sy, 40 * u, 0), A, vis * clamp(built - 0.5) * (1 - scatter));
  // the newest row flashes in the accent as it lands
  const newest = rows - 1 - Math.min(rows - 1, Math.floor(built - 0.001));
  const flash = pulse(lb * 2) * (1 - scatter) * vis;
  if (built > 0.2 && built < rows + 0.5) {
    const y0 = cy + (top + newest * h) * u;
    for (let k = 0; k < 2 * newest + 1; k += 2) {
      const x = cx + (-(newest * s) / 2 + (k * s) / 2) * u;
      poly(ctx, triAt(x, y0 + (2 / 3) * h * u, s * u * 0.94, 0), A, flash * 0.85);
    }
  }
}

/**
 * Behind each section: one huge flat triangle in the section's accent,
 * swung in on the cut and turning slowly, so every beat has its own colour.
 */
function backdrop(ctx: CanvasRenderingContext2D, lb: number, L: Layout, vis: number, A: string, i: number) {
  // A solid accent wedge slams in from off-frame on the cut and parks in a
  // corner, turning slowly; a deep-blue counterweight sits opposite.
  const k = eoExpo(clamp(lb * 1.4));
  const side = i % 2 ? 1 : -1; // spin direction alternates
  const size = Math.min(L.W, L.H) * (L.W > L.H ? 0.62 : 0.5);
  // parked on the right edge, mid-height, clear of the HUD corners and label
  const wide = L.W > L.H;
  const restX = L.W - size * (wide ? 0.2 : 0.08);
  // on portrait the content fills the middle, so the wedge drops below it
  const restY = wide ? L.H * (i % 2 ? 0.62 : 0.4) : L.H * (i % 2 ? 0.8 : 0.84);
  const x = lerp(L.W + size, restX, k);
  const y = lerp(L.H * (i % 2 ? -0.3 : 1.3), restY, k);
  poly(ctx, triAt(x, y, size * lerp(1.8, 1, k), -Math.PI / 2 + side * (0.15 + lb * 0.06)), A, vis);
  poly(ctx, triAt(size * 0.1, L.H * (i % 2 ? 0.3 : 0.7), size * 0.8, Math.PI / 2 + side * (0.2 + lb * 0.04)), BLUE, 0.22 * vis);
}

/* ------------------------------------------------------------- end card */

/** Where the resolved mark sits, and how big: the end-card stack. */
export function endLayout(L: Layout) {
  const size = 210 * L.u;
  const markY = L.cy - 120 * L.u; // grid centre of the mark
  const bottom = markY + ((85 - 50) / 100) * size; // the base edge
  const clear = ((91 - 9) / 100) * size / 3; // one third of the drawn width
  return { size, markY, lockupY: bottom + clear + 30 * L.u, clear };
}

/* ------------------------------------------------------------------ draw */

export function draw(ctx: CanvasRenderingContext2D, t: number, L: Layout) {
  const b = (((t % LOOP) + LOOP) % LOOP) / BEAT;
  ctx.globalAlpha = 1;
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, L.W, L.H);

  const { cx, cy, u } = L;
  const E = endLayout(L);

  /* intro: phone opens (b 1→3), studio (b 3→7) */
  const open = b < CLOSE ? eio3(seg(b, 1, 2)) : 1 - eio3(seg(b, CLOSE, 1));
  const ph = phoneRect(L, open);

  ctx.save();
  roundRect(ctx, ph.x, ph.y, ph.w, ph.h, ph.r);
  ctx.clip();
  const latLevel = b < END ? 1 : b < CLOSE ? 1 - 0.6 * seg(b, END, 2) : 0.4 * (1 - seg(b, CLOSE, 1));
  lattice(ctx, b, L, latLevel * (open > 0 ? 1 : 0), b >= END ? 300 * seg(b, END, 2) : 0);

  // wireframe tetra for depth, from the studio onward
  const wireIn = seg(b, 2.5, 1.5);
  const wireOut = 1 - seg(b, END, 2.5);
  const wireR = b < 7 ? 360 : b < END ? 560 : lerp(560, 120, eio3(seg(b, END, 2.5)));
  wireTetra(ctx, cx, cy, wireR * u, b * 0.42, 0.35 + Math.sin(b * 0.2) * 0.15, (b < 7 ? 0.5 : 0.22) * wireIn * wireOut);
  ctx.restore();

  // the phone outline, fading as it opens
  ctx.globalAlpha = 0.45 * (1 - open);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 2;
  roundRect(ctx, ph.x, ph.y, ph.w, ph.h, ph.r);
  ctx.stroke();

  /* the mark: at rest in the phone at b 0, split into the studio, gone by the sections */
  if (b < 7) {
    const k = eio3(seg(b, 1, 2)); // split
    const orbit = seg(b, 3, 4);
    const exit = eiExpo(seg(b, 6.2, 0.8));
    const size = lerp(60, 190, k) * u;
    const offs = [
      [-260, -30, -0.6],
      [260, -30, 0.6],
      [0, 220, 0.25],
    ];
    for (let i = 0; i < 3; i++) {
      const a = orbit * Math.PI * 0.9 + i * 0.4;
      const ox = offs[i][0] * k;
      const oy = offs[i][1] * k;
      const rx = ox * Math.cos(a * 0.5) - oy * Math.sin(a * 0.5);
      const ry = ox * Math.sin(a * 0.5) + oy * Math.cos(a * 0.5);
      face(ctx, i, cx, cy, size, {
        dx: rx * u * (1 + exit * 3),
        dy: ry * u * (1 + exit * 3) - exit * 200 * u,
        rot: offs[i][2] * k + orbit * (i - 1) * 1.6,
        k: 1 + exit * 1.5,
        alpha: 1 - exit,
      });
    }
  }

  /* sections */
  SECTIONS.forEach((s, i) => {
    const lb = b - s.at;
    if (lb < -0.1 || lb > 4.2) return;
    const vis = clamp(lb * 6) * (i === 3 ? 1 : 1 - clamp((lb - 3.75) * 5));
    backdrop(ctx, lb, L, vis, s.accent, i);
    if (i === 0) combatOtas(ctx, lb, L, vis, s.accent);
    if (i === 1) dining(ctx, lb, L, vis, s.accent);
    if (i === 2) spa(ctx, lb, L, vis, s.accent);
    if (i === 3) suites(ctx, lb, L, vis, eio3(seg(lb, 3.6, 0.6)), s.accent);
  });
  for (const s of SECTIONS) chevrons(ctx, b, s.at, L, s.accent);

  /* resolve: facets fly in and lock into the exact mark at REST */
  if (b >= END) {
    const p = seg(b, END + 0.2, REST - END - 0.2);
    const q = eo3(p);
    const closeK = eio3(seg(b, CLOSE, 1)); // b 31→32 back into the phone
    const size = lerp(E.size, 60 * u, closeK);
    const my = lerp(E.markY, cy, closeK);
    const from = [
      [-620, -380, -2.2, 2.6],
      [640, 300, 2.8, 2.2],
      [-120, 520, -1.6, 3],
    ];
    if (p < 1) {
      for (let i = 0; i < 3; i++) {
        face(ctx, i, cx, my, size, {
          dx: from[i][0] * (1 - q) * u,
          dy: from[i][1] * (1 - q) * u,
          rot: from[i][2] * (1 - q),
          k: lerp(from[i][3], 1, q),
          alpha: clamp(p * 4),
        });
      }
      // stray tiles drawn into the summit
      for (let k = 0; k < 18; k++) {
        const a = k * 2.399;
        const d = (1 - q) * (520 + (k % 5) * 60);
        const x = cx + Math.cos(a) * d * u;
        const y = my + Math.sin(a) * d * u;
        poly(ctx, triAt(x, y, 22 * u * (1 - q), a), BLUE, TINT[k % 3] * (1 - p));
      }
    } else {
      mark(ctx, cx, my, size); // exact, untouched
    }
  }

  /* HUD frame: corner brackets and the beat ladder */
  hud(ctx, b, L);
  ctx.globalAlpha = 1;
}

function hud(ctx: CanvasRenderingContext2D, b: number, L: Layout) {
  const i = L.inset;
  const top = L.hudTop;
  const bot = L.H - i;
  const len = 22;
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const [x, y, sx, sy] of [
    [i, top, 1, 1],
    [L.W - i, top, -1, 1],
    [i, bot, 1, -1],
    [L.W - i, bot, -1, -1],
  ]) {
    ctx.moveTo(x, y + sy * len);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * len, y);
  }
  ctx.stroke();

  // beat ladder: four facets, one lit per beat, bottom right
  const step = 16;
  for (let k = 0; k < 4; k++) {
    const on = Math.floor(b) % 4 === k;
    poly(ctx, triAt(L.W - i - 26 - (3 - k) * step, bot - 44, 10, 0), on ? BLUE : WHITE, on ? 1 : 0.22);
  }
  // timeline: a thin progress line with the four section ticks
  const x0 = i + 36;
  const x1 = L.W - i - 120;
  const y = bot - 14;
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = WHITE;
  ctx.fillRect(x0, y, x1 - x0, 1);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = BLUE;
  ctx.fillRect(x0, y - 0.5, (x1 - x0) * (b / 32), 2);
  for (const s of SECTIONS) {
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = WHITE;
    ctx.fillRect(x0 + (x1 - x0) * (s.at / 32), y - 4, 1, 9);
  }
}

/* ------------------------------------------------------------------ text */

export type TextState = {
  timecode: string;
  label: string;
  labelAlpha: number;
  labelShift: number; // px
  lockup: { alpha: number; y: number; shift: number };
  headline: { alpha: number[]; y: number; shift: number[] };
  fpsBlink: number;
};

export const HEADLINE = 'A television studio in your pocket.'.split(' ');

export function textState(t: number, L: Layout): TextState {
  const tt = ((t % LOOP) + LOOP) % LOOP;
  const b = tt / BEAT;
  const frames = Math.floor(tt * 60);
  const ss = String(Math.floor(frames / 60)).padStart(2, '0');
  const ff = String(frames % 60).padStart(2, '0');

  let label = '';
  let labelAlpha = 0;
  let labelShift = 0;
  for (const s of SECTIONS) {
    const lb = b - s.at;
    if (lb >= 0 && lb < 4) {
      label = s.label;
      const inK = eo3(clamp(lb * 3));
      const outK = clamp((lb - 3.8) * 5);
      labelAlpha = inK * (1 - outK);
      labelShift = (1 - inK) * 14;
    }
  }

  const E = endLayout(L);
  const fadeOut = 1 - clamp((b - CLOSE) * 2.5);
  const lk = eo3(seg(b, REST, 1)) * fadeOut;
  const headline = HEADLINE.map((_, i) => eo3(seg(b, REST + 0.9 + i * 0.22, 0.8)) * fadeOut);

  return {
    timecode: `00:00:${ss}:${ff}`,
    label,
    labelAlpha,
    labelShift,
    lockup: { alpha: lk, y: E.lockupY, shift: (1 - lk) * 18 },
    headline: { alpha: headline, y: E.lockupY + 110 * L.u, shift: headline.map((a) => (1 - a) * 22) },
    fpsBlink: pulse(b) > 0.5 ? 1 : 0.55,
  };
}
