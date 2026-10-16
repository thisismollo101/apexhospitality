import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { FACES, INTER } from '../brand';
import { BARS, BEATS, BPM, COL, FIN_BEATS, INTRO_BEATS, POINTS, POINT_BEATS, PRODUCT, RING, TITLE, type Point, type Shape, type Word } from './welcome-reel.data';

/*
 * Apex Welcome — hero reel at 128 BPM.
 *
 *   intro    the dot opens into the tetrahedron; faces drift apart and turn; a text ring counter-rotates
 *   points   the hero, one huge word or phrase at a time. Each word slams in from the side with
 *            motion blur, holds, and is thrown out the other way; the point's shapes jump and pop
 *            behind it on every word; the full sentence runs along the bottom. Each point has its
 *            own colour and shapes, and the next one wipes in through its own shape.
 *   fin      the mark pops with confetti; Apex WELCOME slides out from behind it
 *
 * Copy, timing and colours are in welcome-reel.data.ts.
 */
export const REEL_FPS = 60;
export const REEL_FRAMES = Math.round(((BEATS * 60) / BPM) * REEL_FPS);

/* ------------------------------------------------------------------ easing */

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const seg = (b: number, a: number, d: number) => clamp((b - a) / d);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const expoIn = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const backOut = (t: number, s = 1.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

type Box = { W: number; H: number; v: number; wide: boolean; frame: number };

/* ------------------------------------------------------------- primitives */

const facePts = (i: number, x: number, y: number, s: number) =>
  FACES[i].points.split(' ').map((pt) => {
    const [gx, gy] = pt.split(',').map(Number);
    return [x + ((gx - 50) / 100) * s, y + ((gy - 50) / 100) * s] as [number, number];
  });

/**
 * The tetrahedron. `burst` moves each face out along its own direction and
 * `spin` turns it about its centroid; at burst 0, spin 0 it is the drawn
 * artwork exactly, faces at their fixed .45 / 1 / .22.
 */
const Tetra = ({ x, y, s, ink, burst = 0, spin = 0, rot = 0 }: { x: number; y: number; s: number; ink: string; burst?: number; spin?: number; rot?: number }) => {
  const dirs = [
    [-0.55, -0.25],
    [0.55, -0.25],
    [0, 0.6],
  ];
  return (
    <g transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
      {FACES.map((f, i) => {
        const pts = facePts(i, x, y, s);
        const gx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
        const gy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
        const t = burst || spin ? `translate(${dirs[i][0] * s * burst} ${dirs[i][1] * s * burst}) rotate(${spin * (i === 1 ? -1 : 1)} ${gx} ${gy})` : undefined;
        return <polygon key={i} points={pts.map((p) => p.join(',')).join(' ')} fill={ink} opacity={f.opacity} transform={t} />;
      })}
    </g>
  );
};

/** Any of the four shapes, centred at (x,y), radius r. */
const ShapeEl = ({ kind, x, y, r, fill, rot = 0, o = 1, stroke }: { kind: Shape; x: number; y: number; r: number; fill: string; rot?: number; o?: number; stroke?: number }) => {
  const paint = stroke ? { fill: 'none', stroke: fill, strokeWidth: stroke } : { fill };
  const t = `rotate(${rot} ${x} ${y})`;
  if (kind === 'circle') return <circle cx={x} cy={y} r={r} opacity={o} {...paint} />;
  if (kind === 'square') return <rect x={x - r * 0.85} y={y - r * 0.85} width={r * 1.7} height={r * 1.7} opacity={o} transform={t} {...paint} />;
  if (kind === 'plus')
    return (
      <g transform={t} opacity={o}>
        <rect x={x - r} y={y - r * 0.28} width={r * 2} height={r * 0.56} fill={fill} />
        <rect x={x - r * 0.28} y={y - r} width={r * 0.56} height={r * 2} fill={fill} />
      </g>
    );
  return <polygon points={`${x},${y - r} ${x - r * 0.87},${y + r * 0.5} ${x + r * 0.87},${y + r * 0.5}`} opacity={o} transform={t} {...paint} />;
};

/** Horizontal motion blur for HTML, via an inline SVG filter. */
const MBlur = ({ id, x }: { id: string; x: number }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <filter id={id} x="-50%" y="-20%" width="200%" height="140%">
      <feGaussianBlur stdDeviation={`${Math.max(0, x)} 0`} />
    </filter>
  </svg>
);

/** A figure set clean: the range dash drawn short, with air either side. */
const Fig = ({ text, color, accent }: { text: string; color: string; accent: string }) => {
  const unit = text.match(/[%x]$/)?.[0] ?? '';
  const num = unit ? text.slice(0, -1) : text;
  return (
    <span style={{ color, whiteSpace: 'nowrap' }}>
      {num.split('–').map((part, i) => (
        <span key={i}>
          {i > 0 && <span style={{ display: 'inline-block', width: '.24em', height: '.075em', background: 'currentColor', borderRadius: '.035em', margin: '0 .08em', verticalAlign: '.34em' }} />}
          {part}
        </span>
      ))}
      <span style={{ color: accent, marginLeft: '.02em' }}>{unit}</span>
    </span>
  );
};

const Mono = ({ children, size, color, o = 1, style }: { children: ReactNode; size: number; color: string; o?: number; style?: CSSProperties }) => (
  <div style={{ fontSize: size, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color, opacity: o, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...style }}>{children}</div>
);

/* ------------------------------------------------------------- timeline */

type Slot = { kind: 'intro' } | { kind: 'point'; p: number } | { kind: 'fin' };
const SLOTS: { at: number; len: number; slot: Slot }[] = [];
{
  let at = 0;
  SLOTS.push({ at, len: INTRO_BEATS, slot: { kind: 'intro' } });
  at += INTRO_BEATS;
  POINTS.forEach((_, p) => {
    SLOTS.push({ at, len: POINT_BEATS[p], slot: { kind: 'point', p } });
    at += POINT_BEATS[p];
  });
  SLOTS.push({ at, len: FIN_BEATS, slot: { kind: 'fin' } });
}

/** WELCOME is the one word set as texture, on yellow, like a sign the guest walks into. */
const isWelcome = (w: Word) => w.text === 'WELCOME';
const wordBg = (pt: Point, w: Word | undefined) => (w && isWelcome(w) ? COL.yellow : pt.bg);
const wordFg = (pt: Point, w: Word | undefined) => (w && isWelcome(w) ? COL.ink : pt.fg);

/* --------------------------------------------------------------- the film */

export const WelcomeReel = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const b = (frame / fps) * (BPM / 60);
  const box: Box = { W, H, v: Math.min(W, H) / 1080, wide: W > H, frame };

  let si = 0;
  for (let i = 0; i < SLOTS.length; i++) if (b >= SLOTS[i].at) si = i;
  const { at, len, slot } = SLOTS[si];
  const lb = b - at;

  let bg = COL.ink;
  let label = '00 — INTRO';
  let body: ReactNode = null;
  if (slot.kind === 'intro') body = <Intro lb={lb} E={len} box={box} />;
  if (slot.kind === 'fin') {
    label = '06 — FIN';
    body = <Fin lb={lb} box={box} />;
  }
  if (slot.kind === 'point') {
    const pt = POINTS[slot.p];
    const cur = currentWord(pt, lb);
    bg = wordBg(pt, cur?.w);
    label = pt.label;
    const nextSlot = SLOTS[si + 1];
    const next = nextSlot.slot.kind === 'point' ? POINTS[nextSlot.slot.p] : null;
    body = <PointScene pt={pt} p={slot.p} lb={lb} E={len} box={box} next={next} />;
  }

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: INTER, overflow: 'hidden' }}>
      {body}
      <Grain box={box} light={bg === COL.paper || bg === COL.yellow} />
      <Hud b={b} label={label} bg={bg} box={box} />
    </AbsoluteFill>
  );
};

function currentWord(pt: Point, lb: number) {
  let at = 0;
  for (let i = 0; i < pt.words.length; i++) {
    const w = pt.words[i];
    if (lb < at + w.beats || i === pt.words.length - 1) return { w, i, at };
    at += w.beats;
  }
  return null;
}

/* ------------------------------------------------------------------- grain */

const Grain = ({ box, light }: { box: Box; light: boolean }) => {
  const seed = Math.floor(box.frame / 2) % 97;
  return (
    <svg width={box.W} height={box.H} style={{ position: 'absolute', inset: 0, opacity: light ? 0.07 : 0.1, mixBlendMode: light ? 'multiply' : 'screen', pointerEvents: 'none' }}>
      <filter id={`g${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${seed})`} />
    </svg>
  );
};

/* --------------------------------------------------------------------- HUD */

const Hud = ({ b, label, bg, box }: { b: number; label: string; bg: string; box: Box }) => {
  const { W, H, v } = box;
  const dark = bg === COL.ink || bg === COL.blue || bg === COL.orange;
  const c = dark ? COL.white : COL.ink;
  const t = (b * 60) / BPM;
  const fr = Math.floor(t * 60);
  const tc = `00:00:${String(Math.floor(fr / 60)).padStart(2, '0')}:${String(fr % 60).padStart(2, '0')}`;
  const pad = 28 * v;
  const fs = 13 * v;
  const len = 18 * v;
  const beat = Math.floor(b) % 4;
  const bar = Math.min(BARS, Math.floor(b / 4) + 1);
  const corners: [number, number, number, number][] = [
    [pad, pad, 1, 1],
    [W - pad, pad, -1, 1],
    [pad, H - pad, 1, -1],
    [W - pad, H - pad, -1, -1],
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {corners.map(([x, y, sx, sy], i) => (
          <path key={i} d={`M${x},${y + sy * len} L${x},${y} L${x + sx * len},${y}`} stroke={c} strokeOpacity={0.7} strokeWidth={1.5} fill="none" />
        ))}
        <line x1={pad + 10 * v} x2={pad + 10 * v + (W * 0.32 * b) / BEATS} y1={H - pad - 8 * v} y2={H - pad - 8 * v} stroke={c} strokeOpacity={0.6} strokeWidth={1.5} />
      </svg>
      <div style={{ position: 'absolute', top: pad + 6 * v, left: pad + 26 * v, display: 'flex', gap: 22 * v }}>
        <Mono size={fs} color={c}>{TITLE[0]}</Mono>
        <Mono size={fs} color={c} o={0.5}>{TITLE[1]}</Mono>
      </div>
      <Mono size={fs} color={c} style={{ position: 'absolute', top: pad + 6 * v, right: pad + 26 * v }}>{label}</Mono>
      <div style={{ position: 'absolute', bottom: pad + 16 * v, left: pad + 26 * v, display: 'flex', gap: 22 * v }}>
        <Mono size={fs} color={c}>{tc}</Mono>
        <Mono size={fs} color={c} o={0.5}>60 FPS</Mono>
      </div>
      <div style={{ position: 'absolute', bottom: pad + 16 * v, right: pad + 26 * v, display: 'flex', gap: 14 * v, alignItems: 'center' }}>
        <Mono size={fs} color={c} o={0.5}>{BPM} BPM</Mono>
        <div style={{ display: 'flex', gap: 4 * v }}>
          {[0, 1, 2, 3].map((q) => (
            <div key={q} style={{ width: 9 * v, height: 9 * v, border: `1.5px solid ${c}`, background: q === beat ? c : 'transparent' }} />
          ))}
        </div>
        <Mono size={fs} color={c}>BAR {bar}/{BARS}</Mono>
      </div>
    </AbsoluteFill>
  );
};

/* =============================================================== INTRO */

function Intro({ lb, E, box }: { lb: number; E: number; box: Box }) {
  const { W, H, v } = box;
  const cx = W / 2;
  const cy = H / 2;
  const s = 320 * v;
  // one continuous move: the dot opens into the mark, the faces drift apart and
  // turn on a single eased curve, gather again, and the mark closes to a point
  const open = seg(lb, 0.4, 0.7);
  const close = seg(lb, E - 0.75, 0.6);
  const scale = backOut(open, 1.4) * (1 - expoIn(close));
  const apart = Math.sin(Math.PI * seg(lb, 1.0, E - 1.7));
  const burst = 0.22 * eio(clamp(apart));
  const spin = 90 * eio(seg(lb, 1.0, E - 1.7));
  const groupRot = 40 * eio(seg(lb, 0.4, E - 0.8));
  const ring = seg(lb, 0.9, 0.5) * (1 - seg(lb, E - 1, 0.4));
  const textR = 260 * v;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {[0, 0.6, 1.2, 1.8, 2.4].map((q) => {
          const p = seg(lb, q, 1.8);
          if (p <= 0 || p >= 1) return null;
          return <circle key={q} cx={cx} cy={cy} r={lerp(40 * v, Math.max(W, H) * 0.45, expoOut(p))} fill="none" stroke={COL.blue} strokeOpacity={0.5 * (1 - p)} strokeWidth={1.5} />;
        })}
        <circle cx={cx} cy={cy} r={36 * v} fill="none" stroke={COL.white} strokeOpacity={0.4 * (1 - seg(lb, 0.35, 0.3))} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={10 * v * (1 - seg(lb, 0.4, 0.25))} fill={COL.blue} />
        <circle cx={cx} cy={cy} r={lerp(180, 430, expoOut(seg(lb, 0.8, 1.2))) * v} fill="none" stroke={COL.white} strokeOpacity={0.2 * ring} strokeWidth={1} />
        <defs>
          <path id="ring" d={`M ${cx},${cy} m -${textR},0 a ${textR},${textR} 0 1,1 ${textR * 2},0 a ${textR},${textR} 0 1,1 -${textR * 2},0`} />
        </defs>
        <g transform={`rotate(${-lb * 22} ${cx} ${cy})`} opacity={ring}>
          <text fill={COL.white} fontFamily={INTER} fontSize={15 * v} fontWeight={600} letterSpacing={`${6 * v}`}>
            <textPath href="#ring">{RING + RING}</textPath>
          </text>
        </g>
        <g transform={`translate(${cx} ${cy}) scale(${Math.max(0.001, scale)}) translate(${-cx} ${-cy})`}>
          <Tetra x={cx} y={cy} s={s} ink={COL.blue} burst={burst} spin={spin} rot={groupRot} />
        </g>
        {close >= 0.95 && <circle cx={cx} cy={cy} r={8 * v} fill={COL.blue} />}
      </svg>
    </AbsoluteFill>
  );
}

/* =============================================================== A POINT */

function PointScene({ pt, p, lb, E, box, next }: { pt: Point; p: number; lb: number; E: number; box: Box; next: Point | null }) {
  const { W, H, v, wide } = box;
  const cur = currentWord(pt, lb)!;
  const fg = wordFg(pt, cur.w);
  // the next point wipes in through its own shape; the fin through a blue triangle
  const grow = eio(seg(lb, E - 0.5, 0.5));
  const nShape: Shape = next ? next.shape : 'triangle';
  const nBg = next ? next.bg : COL.ink;
  const nLead = next ? next.accent : COL.blue;
  const sub = seg(lb, 0, 0.4);
  const sentence = pt.sentence.split(' ');
  const said = Math.ceil(sentence.length * clamp((lb + 0.4) / (E - 0.6)));

  return (
    <AbsoluteFill>
      {isWelcome(cur.w) ? <WelcomeGrid lb={lb - cur.at} box={box} /> : <Backdrop pt={pt} p={p} lb={lb} wi={cur.i} wt={lb - cur.at} box={box} />}
      {!isWelcome(cur.w) && <BigWord key={cur.i} w={cur.w} i={cur.i} t={lb - cur.at} pt={pt} box={box} />}
      {/* the full sentence, small, read along as the words go by */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: (wide ? 84 : 120) * v, textAlign: 'center', padding: `0 ${wide ? 160 : 60}px`, opacity: sub * (1 - grow) }}>
        <div style={{ display: 'inline-block', fontSize: (wide ? 34 : 36) * v, fontWeight: 700, color: fg, letterSpacing: '-.005em', lineHeight: 1.35 }}>
          {sentence.map((word, i) => (
            <span key={i} style={{ opacity: i < said ? 1 : 0.28 }}>
              {word}{' '}
            </span>
          ))}
        </div>
      </div>
      {grow > 0 && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <ShapeEl kind={nShape === 'plus' ? 'circle' : nShape} x={W / 2} y={H / 2} r={Math.hypot(W, H) * 0.75 * expoOut(grow)} fill={nLead} rot={(1 - grow) * 60} />
          <ShapeEl kind={nShape === 'plus' ? 'circle' : nShape} x={W / 2} y={H / 2} r={Math.hypot(W, H) * 0.75 * eio(clamp(grow * 1.2 - 0.2))} fill={nBg} rot={(1 - grow) * 60} />
        </svg>
      )}
    </AbsoluteFill>
  );
}

/**
 * One word or phrase, as big as the frame allows. It slams in from the side
 * with horizontal motion blur and a stretch, holds while drifting, and is
 * thrown out the other way just before the next one lands.
 */
function BigWord({ w, i, t, pt, box }: { w: Word; i: number; t: number; pt: Point; box: Box }) {
  const { W, H, v, wide } = box;
  let raw = wide ? w.text : (w.tall ?? w.text);
  // a long one-line phrase breaks at the space nearest its middle, so it can be set bigger
  if (!raw.includes('\n') && raw.length > 10 && raw.includes(' ')) {
    const mid = raw.length / 2;
    let at = -1;
    for (let c = 0; c < raw.length; c++) if (raw[c] === ' ' && (at < 0 || Math.abs(c - mid) < Math.abs(at - mid))) at = c;
    raw = `${raw.slice(0, at)}\n${raw.slice(at + 1)}`;
  }
  const lines = raw.split('\n');
  const longest = Math.max(...lines.map((l) => l.length));
  const k = w.fig ? 0.6 : 0.7;
  const cap = w.fig ? (wide ? 440 : 400) * v : (wide ? 420 : 300) * v;
  const size = Math.min(cap, (W * 0.86) / (longest * k), (H * (wide ? 0.62 : 0.5)) / (lines.length * 0.92));
  const dir = i % 2 ? -1 : 1;
  const inP = expoOut(seg(t, 0, 0.42));
  const outP = expoIn(seg(t, w.beats - 0.22, 0.22));
  const x = lerp(dir * W * 0.9, 0, inP) - dir * W * 1.1 * outP + (t - 0.5) * -dir * 10 * v;
  const blur = (1 - inP) * 70 + outP * 70;
  const id = `bw${i}-${Math.round(blur)}`;
  const color = w.accent ? pt.accent : pt.fg;
  const dot = pt.bg === COL.yellow ? COL.orange : pt.bg === COL.orange ? COL.yellow : pt.accent;
  const dotP = backOut(seg(t, 0.3, 0.4), 2.6);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: (wide ? 40 : 80) * v }}>
      <MBlur id={id} x={blur} />
      <div style={{ transform: `translateX(${x}px) scaleX(${1 + (1 - inP) * 0.35 + outP * 0.35})`, filter: blur > 0.5 ? `url(#${id})` : undefined, textAlign: 'center' }}>
        {lines.map((line, li) => {
          const end = li === lines.length - 1 && line.endsWith('.');
          const body = end ? line.slice(0, -1) : line;
          return (
            <div key={li} style={{ fontSize: size, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 0.92, color, whiteSpace: 'nowrap' }}>
              {w.fig ? <Fig text={body} color={pt.fg} accent={pt.accent} /> : body}
              {end && <span style={{ display: 'inline-block', width: '.19em', height: '.19em', borderRadius: '50%', background: dot, marginLeft: '.04em', transform: `scale(${Math.max(0, dotP)})` }} />}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/**
 * Behind the words: one huge outlined shape turning slowly, and a handful of
 * small ones that jump to new spots and pop on every word.
 */
function Backdrop({ pt, p, lb, wi, wt, box }: { pt: Point; p: number; lb: number; wi: number; wt: number; box: Box }) {
  const { W, H, v, wide } = box;
  const kinds: Shape[] = [pt.shape, pt.shape, 'plus', pt.shape === 'circle' ? 'triangle' : 'circle', pt.shape, 'plus'];
  const pop = backOut(seg(wt, 0, 0.45), 2.2);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <ShapeEl kind={pt.shape === 'plus' ? 'circle' : pt.shape} x={W / 2} y={H / 2} r={Math.min(W, H) * 0.46 * expoOut(seg(lb, 0, 0.6))} fill={pt.fg} o={0.08} stroke={3 * v} rot={lb * 14} />
      <ShapeEl kind={pt.shape === 'plus' ? 'circle' : pt.shape} x={W / 2} y={H / 2} r={Math.min(W, H) * 0.34 * expoOut(seg(lb, 0.1, 0.6))} fill={pt.fg} o={0.06} stroke={2 * v} rot={-lb * 22} />
      {kinds.map((kind, s) => {
        const rx = random(`x${p}-${wi}-${s}`);
        const ry = random(`y${p}-${wi}-${s}`);
        // keep the small shapes to the outer bands so the words own the middle
        const x = (0.06 + rx * 0.88) * W;
        const band = s % 2 ? 0.1 + ry * (wide ? 0.14 : 0.12) : 0.68 + ry * (wide ? 0.12 : 0.1);
        const y = band * H + Math.sin(lb * 1.3 + s) * 8 * v;
        const r = (28 + random(`r${p}-${wi}-${s}`) * 46) * v * Math.max(0, pop);
        return <ShapeEl key={s} kind={kind} x={x} y={y} r={r} fill={pt.shapeCols[s % pt.shapeCols.length]} rot={lb * 40 * (s % 2 ? 1 : -1) + s * 30} />;
      })}
    </svg>
  );
}

/** WELCOME as texture: rows sliding both ways, the centre row solid and held. */
function WelcomeGrid({ lb, box }: { lb: number; box: Box }) {
  const { W, v, wide } = box;
  const rows = wide ? 5 : 9;
  const size = (wide ? 160 : 108) * v;
  const line = 'WELCOME '.repeat(8);
  const inP = expoOut(seg(lb, 0, 0.4));
  return (
    <AbsoluteFill style={{ justifyContent: 'center' }}>
      {Array.from({ length: rows }, (_, i) => {
        const mid = i === Math.floor(rows / 2);
        const dir = i % 2 ? 1 : -1;
        const x = mid ? lerp(W, -W * 0.18, inP) - lb * 30 * v : dir * (lb * 300 * v) - W * 0.4 + (1 - inP) * dir * W * 0.5;
        return (
          <div key={i} style={{ fontSize: mid ? size * 1.3 : size, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1, whiteSpace: 'nowrap', color: mid ? COL.ink : 'transparent', WebkitTextStroke: mid ? undefined : `${2 * v}px ${COL.ink}`, transform: `translateX(${x}px)`, opacity: mid ? 1 : 0.6 }}>
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/* ================================================================= FIN */

/*
 * The site's own lockup, as the nav sets it: "Apex" heavy and mixed-case, the
 * second word in capitals at .74em (Inter's x-height over cap height, so the
 * capitals stand as tall as "pex"), weight 500, +.13em tracking, brand blue.
 * The mark is brand blue, untouched, with a third of its width clear around it.
 */
function Fin({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const s = (wide ? 260 : 330) * v;
  const word = (wide ? 170 : 130) * v;
  const gapC = (s * 0.82) / 3 + 16 * v;
  const wordW = word * 7.1; // "Apex" + WELCOME in the nav treatment
  const blockW = wide ? s * 0.82 + gapC + wordW : 0;
  const mx = wide ? W / 2 - blockW / 2 + s * 0.41 : W / 2;
  const my = wide ? H / 2 : H * 0.4;
  const pop = backOut(seg(lb, 0.1, 0.55), 2.4);
  const slide = expoOut(seg(lb, 0.55, 0.7));
  const confetti = seg(lb, 0.15, 2.4);
  const kinds: Shape[] = ['triangle', 'circle', 'plus', 'square'];

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={mx} cy={my} r={s * (0.5 + 1.8 * expoOut(seg(lb, 0.1, 0.9)))} fill="none" stroke={COL.blue} strokeWidth={6 * v * (1 - seg(lb, 0.1, 0.9))} opacity={1 - seg(lb, 0.1, 0.9)} />
        {Array.from({ length: 44 }, (_, i) => {
          const a = random(`a${i}`) * Math.PI * 2;
          const d = (200 + random(`d${i}`) * (wide ? 760 : 520)) * v * expoOut(confetti);
          const x = mx + Math.cos(a) * d;
          const y = my + Math.sin(a) * d * (wide ? 0.7 : 1) + confetti * confetti * 120 * v;
          const r = (6 + random(`r${i}`) * 9) * v;
          const c = [COL.yellow, COL.white, COL.orange, COL.blue][i % 4];
          const o = confetti > 0 ? 1 - seg(lb, 2.4, 1.2) : 0;
          return <ShapeEl key={i} kind={kinds[i % 4]} x={x} y={y} r={r} fill={c} rot={lb * 200 * (i % 2 ? 1 : -1)} o={o} />;
        })}
        <g transform={`translate(${mx} ${my}) scale(${Math.max(0.001, pop)}) translate(${-mx} ${-my})`}>
          <Tetra x={mx} y={my} s={s} ink={COL.blue} />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: wide ? mx + s * 0.41 + gapC : 0, right: wide ? undefined : 0, top: wide ? my - word * 0.56 : my + s * 0.35 + (s * 0.82) / 3, textAlign: wide ? 'left' : 'center', overflow: 'hidden' }}>
        <div style={{ fontSize: word, fontWeight: 800, letterSpacing: '-.018em', lineHeight: 1.1, color: COL.white, whiteSpace: 'nowrap', transform: wide ? `translateX(${(1 - slide) * -110}%)` : `translateY(${(1 - slide) * -110}%)` }}>
          Apex
          <span style={{ fontSize: '.74em', fontWeight: 500, letterSpacing: '.13em', color: COL.blue, marginLeft: '.42em' }}>{PRODUCT.toUpperCase()}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
