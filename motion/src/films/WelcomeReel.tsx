import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource-variable/inter/wght-italic.css';
import { FACES, INTER } from '../brand';
import { BARS, BPM, COL, REEL } from './welcome-reel.data';

/*
 * Apex Welcome — hero reel. Eight bars at 128 BPM, one section per bar:
 *
 *   0 intro      the dot pops into the tetrahedron; facets burst and spin, a text ring counter-rotates
 *   1 the leak   COMMERCIAL LEAK slams up letter by letter on orange; speed-line wipe out
 *   2 calc       the four calculators race A→B on four curves; the blue dot swallows the frame
 *   3 desk       circle → triangle → square morph on blue, 2–5%; checkerboard wipe out
 *   4 cinema     Truchet field turning in waves, orange sweep, 15–25%; expo zoom past camera
 *   5 5x         dot-wireframe sphere squashing to an hourglass, 5x; white blocks slam in
 *   6 kinetic    a word per beat, then WELCOME as texture; blue iris
 *   7 fin        the mark pops, confetti, the lockup slides out from behind it
 *
 * Copy is in welcome-reel.data.ts. Every cut is on a bar line.
 */
export const REEL_FPS = 60;
export const REEL_FRAMES = Math.round(((BARS * 4 * 60) / BPM) * REEL_FPS); // 900

/* ------------------------------------------------------------------ easing */

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const seg = (b: number, a: number, d: number) => clamp((b - a) / d);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const expoIn = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
const backOut = (t: number, s = 1.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const elastic = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1);
const bounce = (t: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};
const EASES: Record<string, (t: number) => number> = { 'expo-out': expoOut, 'back-out': (t) => backOut(t, 2.2), elastic, bounce };

type Box = { W: number; H: number; v: number; wide: boolean; frame: number };

/* ------------------------------------------------------------- primitives */

const facePts = (i: number, x: number, y: number, s: number) =>
  FACES[i].points
    .split(' ')
    .map((pt) => {
      const [gx, gy] = pt.split(',').map(Number);
      return [x + ((gx - 50) / 100) * s, y + ((gy - 50) / 100) * s] as [number, number];
    });

/**
 * The tetrahedron. `burst` pushes each face out along its own direction and
 * `spin` turns it about its centroid; at burst 0, spin 0 it is the drawn
 * artwork exactly, with the faces at their fixed .45 / 1 / .22.
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
        const dx = dirs[i][0] * s * burst;
        const dy = dirs[i][1] * s * burst;
        const t = burst || spin ? `translate(${dx} ${dy}) rotate(${spin * (i === 1 ? -1 : 1)} ${gx} ${gy})` : undefined;
        return <polygon key={i} points={pts.map((p) => p.join(',')).join(' ')} fill={ink} opacity={f.opacity} transform={t} />;
      })}
    </g>
  );
};

const Tri = ({ x, y, r, fill, rot = 0, o = 1, stroke }: { x: number; y: number; r: number; fill: string; rot?: number; o?: number; stroke?: number }) => (
  <polygon
    points={`${x},${y - r} ${x - r * 0.87},${y + r * 0.5} ${x + r * 0.87},${y + r * 0.5}`}
    fill={stroke ? 'none' : fill}
    stroke={stroke ? fill : undefined}
    strokeWidth={stroke}
    opacity={o}
    transform={`rotate(${rot} ${x} ${y})`}
  />
);

const Plus = ({ x, y, r, fill, rot = 0 }: { x: number; y: number; r: number; fill: string; rot?: number }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <rect x={x - r} y={y - r * 0.28} width={r * 2} height={r * 0.56} fill={fill} />
    <rect x={x - r * 0.28} y={y - r} width={r * 0.56} height={r * 2} fill={fill} />
  </g>
);

/** Horizontal motion blur for HTML, via an inline SVG filter. */
const MBlur = ({ id, x }: { id: string; x: number }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <filter id={id} x="-50%" y="-20%" width="200%" height="140%">
      <feGaussianBlur stdDeviation={`${Math.max(0, x)} 0`} />
    </filter>
  </svg>
);

/** A figure set clean: the range dash drawn short, with air either side. */
const Fig = ({ text, color, accent, star, style }: { text: string; color: string; accent: string; star?: boolean; style?: CSSProperties }) => {
  const unit = text.match(/[%x]$/)?.[0] ?? '';
  const num = unit ? text.slice(0, -1) : text;
  return (
    <span style={{ color, fontWeight: 900, letterSpacing: '-.045em', lineHeight: 0.9, whiteSpace: 'nowrap', ...style }}>
      {num.split('–').map((part, i) => (
        <span key={i}>
          {i > 0 && <span style={{ display: 'inline-block', width: '.24em', height: '.075em', background: 'currentColor', borderRadius: '.035em', margin: '0 .08em', verticalAlign: '.34em' }} />}
          {part}
        </span>
      ))}
      <span style={{ color: accent, marginLeft: '.02em' }}>{unit}</span>
      {star && <span style={{ position: 'relative', top: '-1.45em', fontSize: '.3em', fontWeight: 600, marginLeft: '-.02em', opacity: 0.75 }}>*</span>}
    </span>
  );
};

/** Letters rise out of a mask on a 1–2 frame stagger, overshoot, then squash and settle. */
const Slam = ({ text, lb, start, size, color, step = 0.045, style }: { text: string; lb: number; start: number; size: number; color: string; step?: number; style?: CSSProperties }) => (
  <div style={{ overflow: 'hidden', fontSize: size, fontWeight: 900, lineHeight: 0.86, letterSpacing: '-.035em', color, whiteSpace: 'nowrap', padding: `${size * 0.04}px 0 ${size * 0.06}px`, ...style }}>
    {text.split('').map((ch, i) => {
      const t = seg(lb, start + i * step, 0.55);
      const y = (1 - backOut(t, 1.6)) * 105;
      // stretch on the way up, squash on landing
      const land = seg(lb, start + i * step + 0.25, 0.3);
      const sy = t < 1 ? lerp(1.25, 1, expoOut(t)) : 1;
      const sq = land > 0 && land < 1 ? 1 - 0.08 * Math.sin(land * Math.PI) : 1;
      return (
        <span key={i} style={{ display: 'inline-block', transform: `translateY(${y}%) scaleY(${sy * sq}) scaleX(${2 - sq})`, transformOrigin: '50% 100%', whiteSpace: 'pre' }}>
          {ch}
        </span>
      );
    })}
  </div>
);

/** Small uppercase HUD-style label. */
const Mono = ({ children, size, color, o = 1, style }: { children: ReactNode; size: number; color: string; o?: number; style?: CSSProperties }) => (
  <div style={{ fontSize: size, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color, opacity: o, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...style }}>{children}</div>
);

/* --------------------------------------------------------------- the film */

export const WelcomeReel = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const b = (frame / fps) * (BPM / 60); // beats
  const bar = Math.min(BARS - 1, Math.floor(b / 4));
  const lb = b - bar * 4; // beat within the bar, 0..4
  const box: Box = { W, H, v: Math.min(W, H) / 1080, wide: W > H, frame };

  const scenes = [Intro, Leak, Calc, Desk, Cinema, Five, Kinetic, Fin];
  const Scene = scenes[bar];
  const bgs = [COL.ink, COL.orange, COL.paper, COL.blue, COL.ink, COL.ink, COL.paper, COL.blue];
  // the kinetic bar flips background every beat
  const kbg = [COL.paper, COL.blue, COL.yellow, COL.ink];
  const bg = bar === 6 ? kbg[Math.min(3, Math.floor(lb))] : bgs[bar];

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: INTER, overflow: 'hidden' }}>
      <Scene lb={lb} box={box} />
      <Grain box={box} light={bg === COL.paper || bg === COL.yellow} />
      <Hud b={b} bar={bar} bg={bg} box={box} />
    </AbsoluteFill>
  );
};

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

const Hud = ({ b, bar, bg, box }: { b: number; bar: number; bg: string; box: Box }) => {
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
        {/* the reel's progress line, bottom left */}
        <line x1={pad + 10 * v} x2={pad + 10 * v + (W * 0.32 * b) / (BARS * 4)} y1={H - pad - 8 * v} y2={H - pad - 8 * v} stroke={c} strokeOpacity={0.6} strokeWidth={1.5} />
      </svg>
      <div style={{ position: 'absolute', top: pad + 6 * v, left: pad + 26 * v, display: 'flex', gap: 22 * v }}>
        <Mono size={fs} color={c}>{REEL.title[0]}</Mono>
        <Mono size={fs} color={c} o={0.5}>{REEL.title[1]}</Mono>
      </div>
      <Mono size={fs} color={c} style={{ position: 'absolute', top: pad + 6 * v, right: pad + 26 * v }}>{REEL.sections[bar]}</Mono>
      <div style={{ position: 'absolute', bottom: pad + 16 * v, left: pad + 26 * v, display: 'flex', gap: 22 * v }}>
        <Mono size={fs} color={c}>{tc}</Mono>
        <Mono size={fs} color={c} o={0.5}>60 FPS</Mono>
      </div>
      <div style={{ position: 'absolute', bottom: pad + 16 * v, right: pad + 26 * v, display: 'flex', gap: 14 * v, alignItems: 'center' }}>
        <Mono size={fs} color={c} o={0.5}>{BPM} BPM</Mono>
        <div style={{ display: 'flex', gap: 4 * v }}>
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{ width: 9 * v, height: 9 * v, border: `1.5px solid ${c}`, background: k === beat ? c : 'transparent' }} />
          ))}
        </div>
        <Mono size={fs} color={c}>BAR {bar + 1}/{BARS}</Mono>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 0 · INTRO */

function Intro({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v } = box;
  const cx = W / 2;
  const cy = H / 2;
  const s = 300 * v;
  // dot → mark through a circular mask that grows with it
  const pop = seg(lb, 0.55, 0.45);
  const scale = lb < 3.4 ? backOut(pop, 2.4) : 1 - expoIn(seg(lb, 3.4, 0.5));
  const burst = lb < 1.2 ? 0 : 0.28 * expoOut(seg(lb, 1.2, 0.5)) * (1 - expoIn(seg(lb, 3.0, 0.45))) + 0.06 * Math.exp(-((lb % 1) * 6)) * seg(lb, 1.6, 0.1);
  const spin = expoOut(seg(lb, 1.2, 1)) * 140 + lb * 30;
  const groupRot = lb > 1.1 ? (lb - 1.1) * 26 : 0;
  const dotR = lerp(9 * v, 0, seg(lb, 0.55, 0.15));
  const ringO = 1 - seg(lb, 3.1, 0.3);
  const textR = 250 * v;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {/* rings pulse out every half beat */}
        {[0, 0.5, 1, 1.5, 2, 2.5].map((k) => {
          const p = seg(lb, k, 1.4);
          if (p <= 0 || p >= 1) return null;
          return <circle key={k} cx={cx} cy={cy} r={lerp(36 * v, Math.max(W, H) * 0.42, expoOut(p))} fill="none" stroke={k % 1 ? COL.blue : COL.white} strokeOpacity={0.45 * (1 - p)} strokeWidth={k % 1 ? 2 : 1.2} />;
        })}
        {/* the starting dot in its ring */}
        <circle cx={cx} cy={cy} r={34 * v * (1 - seg(lb, 0.5, 0.2))} fill="none" stroke={COL.white} strokeOpacity={0.4} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={dotR + 4 * v * Math.sin(lb * 9)} fill={COL.blue} />
        {/* big hairline ring */}
        <circle cx={cx} cy={cy} r={lerp(150, 420, expoOut(seg(lb, 0.9, 0.9))) * v} fill="none" stroke={COL.white} strokeOpacity={0.22 * ringO * seg(lb, 0.9, 0.2)} strokeWidth={1} />
        <defs>
          <clipPath id="introMask">
            <circle cx={cx} cy={cy} r={s * 0.9 * expoOut(pop) + 1} />
          </clipPath>
          <path id="ring" d={`M ${cx},${cy} m -${textR},0 a ${textR},${textR} 0 1,1 ${textR * 2},0 a ${textR},${textR} 0 1,1 -${textR * 2},0`} />
        </defs>
        {/* the text ring turns against the mark */}
        <g transform={`rotate(${-lb * 34} ${cx} ${cy})`} opacity={seg(lb, 1.1, 0.4) * ringO}>
          <text fill={COL.white} fontFamily={INTER} fontSize={15 * v} fontWeight={600} letterSpacing={`${6 * v}`}>
            <textPath href="#ring">{REEL.ring + REEL.ring}</textPath>
          </text>
        </g>
        <g clipPath="url(#introMask)" transform={`translate(${cx} ${cy}) scale(${Math.max(0.001, scale)}) translate(${-cx} ${-cy})`}>
          <Tetra x={cx} y={cy} s={s} ink={COL.blue} burst={burst} spin={spin * seg(lb, 1.2, 0.1)} rot={groupRot} />
        </g>
        {/* collapsed to a glowing point before the hard cut */}
        {lb > 3.7 && <circle cx={cx} cy={cy} r={7 * v} fill={COL.blue} />}
      </svg>
    </AbsoluteFill>
  );
}

/* ============================================================== 1 · THE LEAK */

function Leak({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const L = REEL.leak;
  const left = wide ? 96 * v : 56 * v;
  const width = W - left * 2;
  const size = Math.min(wide ? 400 * v : 230 * v, width / (L.words[0].length * 0.7));
  const top = wide ? H * 0.2 : H * 0.36;
  const line = expoOut(seg(lb, 0, 0.8));
  const ital = expoOut(seg(lb, 1.5, 0.7));
  // exit: a speed-line wipe sweeps right to left in the next scene's paper
  const w = seg(lb, 3.35, 0.65);
  const wx = lerp(W * 1.15, -W * 0.6, expoIn(w) * 0.4 + w * 0.6);
  // the whole block drifts while it holds, so it is never still
  const drift = (lb - 2) * -6 * v;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={left} x2={left + width * line} y1={top - 30 * v} y2={top - 30 * v} stroke={COL.ink} strokeWidth={2} />
        <line x1={W - left} x2={W - left - width * expoOut(seg(lb, 1.8, 0.8))} y1={top + size * 2.05} y2={top + size * 2.05} stroke={COL.ink} strokeWidth={2} />
      </svg>
      <div style={{ position: 'absolute', left, right: left, top: top - 64 * v, display: 'flex', justifyContent: 'space-between', opacity: seg(lb, 0.3, 0.3) }}>
        <Mono size={14 * v} color={COL.ink}>{L.tagL}</Mono>
        <Mono size={14 * v} color={COL.ink}>{L.tagR}</Mono>
      </div>
      <div style={{ position: 'absolute', left, top: top - 6 * v, transform: `translateX(${drift}px)` }}>
        <div style={{ overflow: 'hidden', marginBottom: 6 * v }}>
          <div style={{ fontSize: (wide ? 44 : 38) * v, fontWeight: 800, letterSpacing: '-.01em', color: COL.ink, transform: `translateY(${(1 - expoOut(seg(lb, 0.05, 0.5))) * 110}%)` }}>{L.kicker}</div>
        </div>
        <Slam text={L.words[0]} lb={lb} start={0.3} size={size} color={COL.ink} />
        <Slam text={L.words[1]} lb={lb} start={0.75} size={size} color={COL.ink} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: (wide ? 92 : 74) * v, fontStyle: 'italic', fontWeight: 500, letterSpacing: '-.02em', color: COL.white, transform: `translateX(${(1 - ital) * 40}%)`, opacity: ital, marginTop: 4 * v }}>{L.italic}</div>
        </div>
      </div>
      {w > 0 && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="speed" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={COL.paper} stopOpacity={0} />
              <stop offset="0.35" stopColor={COL.paper} stopOpacity={1} />
            </linearGradient>
          </defs>
          <rect x={wx} y={0} width={W * 2} height={H} fill="url(#speed)" />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={wx - (40 + random(`sl${i}`) * 260) * v} y={(random(`sy${i}`) * 0.96 + 0.02) * H} width={(120 + random(`sw${i}`) * 380) * v} height={(2 + random(`sh${i}`) * 4) * v} fill={COL.paper} opacity={0.8} />
          ))}
          {/* the trail of black dots */}
          {Array.from({ length: 6 }, (_, i) => {
            const x = wx + (40 + i * 150) * v;
            const sz = (14 - i * 1.4) * v;
            return <ellipse key={i} cx={x} cy={H * (wide ? 0.5 : 0.55) + Math.sin(i * 1.3) * 16 * v} rx={sz * (1 + 2.2 * w)} ry={sz} fill={COL.ink} />;
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
}

/* ============================================================== 2 · CALC */

function Calc({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const C = REEL.calc;
  const left = wide ? 110 * v : 60 * v;
  const title = expoOut(seg(lb, 0, 0.6));
  const labelW = wide ? 360 * v : 330 * v;
  const iconW = 54 * v;
  const tx0 = left + labelW + iconW + 40 * v;
  const tx1 = W - left - 20 * v;
  const top = wide ? H * 0.36 : H * 0.32;
  const gap = wide ? 150 * v : 210 * v;
  const race = seg(lb, 0.8, 1.7);
  const cols = [COL.blue, COL.orange, COL.ink, COL.blue];
  // exit: the blue COMBAT OTAs dot punches up and swallows the frame
  const punch = expoIn(seg(lb, 3.35, 0.65));

  return (
    <AbsoluteFill>
      <MBlur id="tBlur" x={(1 - title) * 30} />
      <div style={{ position: 'absolute', left, top: wide ? H * 0.12 : H * 0.12, transform: `translateX(${(1 - title) * -260 * v}px)`, filter: 'url(#tBlur)' }}>
        <div style={{ fontSize: (wide ? 84 : 70) * v, fontStyle: 'italic', fontWeight: 500, letterSpacing: '-.025em', color: COL.ink }}>{C.title}</div>
      </div>
      <Mono size={13 * v} color={COL.ink} o={0.55 * seg(lb, 0.4, 0.3)} style={{ position: 'absolute', right: left, top: wide ? H * 0.15 : H * 0.2 }}>{C.note}</Mono>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <text x={tx0} y={top - 50 * v} fill={COL.ink} fontFamily={INTER} fontSize={13 * v} fontWeight={700} opacity={seg(lb, 0.4, 0.3)}>A</text>
        <text x={tx1} y={top - 50 * v} fill={COL.ink} fontFamily={INTER} fontSize={13 * v} fontWeight={700} textAnchor="end" opacity={seg(lb, 0.4, 0.3)}>B</text>
        {C.rows.map((r, i) => {
          const y = top + i * gap;
          const ease = EASES[r.ease];
          const rowIn = expoOut(seg(lb, 0.2 + i * 0.08, 0.6));
          const p = ease(race);
          const pPrev = ease(clamp(race - 0.03));
          const vel = Math.abs(p - pPrev) * 30;
          const x = lerp(tx0, tx1, p);
          const dotR = 22 * v;
          // icon: the curve itself
          const ix = left + labelW;
          const iw = iconW;
          const curve = Array.from({ length: 24 }, (_, k) => {
            const q = k / 23;
            return `${ix + q * iw},${y + 16 * v - ease(q) * 32 * v}`;
          }).join(' ');
          const isPunch = i === 0 && punch > 0;
          return (
            <g key={i} opacity={rowIn}>
              <text x={left} y={y + 7 * v} fill={COL.orange} fontFamily={INTER} fontSize={18 * v} fontWeight={800}>{r.n}</text>
              <text x={left + 50 * v} y={y + 9 * v} fill={COL.ink} fontFamily={INTER} fontSize={(wide ? 26 : 28) * v} fontWeight={800} letterSpacing=".04em">{r.label}</text>
              <polyline points={curve} fill="none" stroke={COL.ink} strokeWidth={2} />
              <circle cx={ix + clamp(race) * iw} cy={y + 16 * v - p * 32 * v} r={3.5 * v} fill={cols[i]} />
              <line x1={tx0} x2={lerp(tx0, tx1, rowIn)} y1={y} y2={y} stroke={COL.ink} strokeOpacity={0.25} strokeWidth={1.5} />
              <line x1={tx1} x2={tx1} y1={y - 12 * v} y2={y + 12 * v} stroke={COL.ink} strokeOpacity={0.5} strokeWidth={1.5} />
              {/* ticks left behind */}
              {Array.from({ length: 12 }, (_, k) => {
                const q = k / 12;
                const tq = ease(clamp(q));
                if (race < q || q === 0) return null;
                const kx = lerp(tx0, tx1, tq);
                return <line key={k} x1={kx} x2={kx} y1={y - 8 * v} y2={y - 3 * v} stroke={COL.ink} strokeOpacity={0.35} strokeWidth={1.2} />;
              })}
              {/* echo trail */}
              {[0.06, 0.12, 0.18].map((d, k) => {
                const gx = lerp(tx0, tx1, ease(clamp(race - d)));
                return <circle key={k} cx={gx} cy={y} r={dotR * (1 - k * 0.15)} fill={cols[i]} opacity={race > d && race < 1 + d ? 0.16 - k * 0.04 : 0} />;
              })}
              {!isPunch && <ellipse cx={x} cy={y} rx={dotR * (1 + Math.min(1.6, vel * 0.9))} ry={dotR * (1 - Math.min(0.35, vel * 0.2))} fill={cols[i]} />}
            </g>
          );
        })}
        {punch > 0 && (
          <circle cx={lerp(tx1, W / 2, punch)} cy={lerp(top, H / 2, punch)} r={15 * v + punch * Math.hypot(W, H) * 0.62} fill={COL.blue} />
        )}
      </svg>
    </AbsoluteFill>
  );
}

/* ============================================================== 3 · DESK */

const shapePts = (kind: 'circle' | 'triangle' | 'square', n: number, r: number): [number, number][] => {
  if (kind === 'circle') return Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2 - Math.PI / 2) * r, Math.sin((i / n) * Math.PI * 2 - Math.PI / 2) * r]);
  const k = kind === 'triangle' ? 3 : 4;
  const off = kind === 'triangle' ? -Math.PI / 2 : -Math.PI / 4;
  const R = kind === 'triangle' ? r * 1.25 : r * 1.2;
  const verts = Array.from({ length: k }, (_, i) => [Math.cos(off + (i / k) * Math.PI * 2) * R, Math.sin(off + (i / k) * Math.PI * 2) * R]);
  return Array.from({ length: n }, (_, i) => {
    const f = (i / n) * k;
    const e = Math.floor(f);
    const t = f - e;
    const a = verts[e % k];
    const c = verts[(e + 1) % k];
    return [lerp(a[0], c[0], t), lerp(a[1], c[1], t)];
  });
};

function Desk({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const D = REEL.desk;
  const cx = wide ? W * 0.68 : W / 2;
  const cy = wide ? H / 2 : H * 0.33;
  const r = (wide ? 170 : 190) * v;
  const n = 72;
  // anticipate, snap to triangle, then snap to square, elastic every time
  const antic = 1 - 0.18 * Math.sin(Math.PI * seg(lb, 0.15, 0.35));
  const toTri = elastic(seg(lb, 0.5, 0.9));
  const toSq = elastic(seg(lb, 2.1, 0.9));
  const circ = shapePts('circle', n, r);
  const tri = shapePts('triangle', n, r);
  const sq = shapePts('square', n, r);
  const pts = circ.map((p, i) => {
    const a = [lerp(p[0], tri[i][0], toTri), lerp(p[1], tri[i][1], toTri)];
    return [lerp(a[0], sq[i][0], toSq), lerp(a[1], sq[i][1], toSq)] as [number, number];
  });
  const rot = toSq > 0 ? lerp(360 * 0.9, -90, backOut(seg(lb, 2.1, 0.9), 2)) : backOut(seg(lb, 0.5, 1.4), 2) * 330;
  const exit = expoIn(seg(lb, 3.25, 0.45));
  const sc = antic * (1 - exit);
  const path = (k: number) => `M ${pts.map(([x, y]) => `${cx + x * sc * k},${cy + y * sc * k}`).join(' L ')} Z`;
  const orbitShape = toSq > 0.5 ? 'sq' : toTri > 0.5 ? 'tri' : 'dot';
  const figIn = seg(lb, 0.9, 0.6);
  const pre = expoOut(seg(lb, 0.4, 0.5));
  // exit: checkerboard mask of the next scene's ink
  const cw = Math.max(W, H) / 12;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {/* crosshair and readouts */}
        <line x1={cx - r * 2.2} x2={cx + r * 2.2} y1={cy} y2={cy} stroke={COL.white} strokeOpacity={0.25} />
        <line x1={cx} x2={cx} y1={cy - r * 2.2} y2={cy + r * 2.2} stroke={COL.white} strokeOpacity={0.25} />
        <text x={cx - r * 2.2} y={cy - 10 * v} fill={COL.white} opacity={0.6} fontFamily={INTER} fontSize={11 * v} fontWeight={600} letterSpacing=".14em">MORPH  {toSq > 0.5 ? 'TRIANGLE → SQUARE' : 'CIRCLE → TRIANGLE'}</text>
        <text x={cx + r * 2.2} y={cy + 22 * v} fill={COL.white} opacity={0.6} fontFamily={INTER} fontSize={11 * v} fontWeight={600} textAnchor="end" letterSpacing=".14em">T {(lb / 4).toFixed(2)}  ROT {Math.round(((rot % 360) + 360) % 360)}°</text>
        {/* orbiters: dots, then triangles, then squares */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 + lb * (toSq > 0 ? -0.9 : 0.9);
          const R = r * 1.75 * (1 - exit) * expoOut(seg(lb, 0.1 + i * 0.02, 0.6));
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          const s = 11 * v;
          if (orbitShape === 'dot') return <circle key={i} cx={x} cy={y} r={s} fill={COL.white} />;
          if (orbitShape === 'tri') return <Tri key={i} x={x} y={y} r={s * 1.3} fill={COL.white} rot={(a * 180) / Math.PI + 90} />;
          return <rect key={i} x={x - s} y={y - s} width={s * 2} height={s * 2} fill={COL.yellow} transform={`rotate(${lb * -90} ${x} ${y})`} />;
        })}
        {/* echo outlines lag the spin */}
        {[1, 2, 3].map((k) => (
          <path key={k} d={path(1)} fill="none" stroke={COL.orange} strokeWidth={2} opacity={0.55 - k * 0.14} transform={`rotate(${rot - k * 9 * (toSq > 0 ? -1 : 1)} ${cx} ${cy})`} />
        ))}
        <path d={path(1)} fill={COL.white} transform={`rotate(${rot} ${cx} ${cy})`} />
      </svg>
      <div style={{ position: 'absolute', left: wide ? 110 * v : 0, right: wide ? undefined : 0, top: wide ? H * 0.32 : H * 0.6, textAlign: wide ? 'left' : 'center', opacity: 1 - exit }}>
        <div style={{ overflow: 'hidden' }}>
          <Mono size={(wide ? 24 : 24) * v} color={COL.white} style={{ transform: `translateY(${(1 - pre) * 110}%)`, whiteSpace: wide ? 'nowrap' : 'normal', padding: wide ? 0 : `0 ${60 * v}px`, lineHeight: 1.5 }}>{D.pre}</Mono>
        </div>
        <div style={{ overflow: 'hidden', marginTop: 10 * v }}>
          <div style={{ fontSize: (wide ? 300 : 270) * v, transform: `translateY(${(1 - backOut(figIn, 1.7)) * 100}%) scale(${lerp(1.15, 1, expoOut(figIn))})`, transformOrigin: wide ? 'left bottom' : 'center bottom' }}>
            <Fig text={D.fig} color={COL.white} accent={COL.yellow} star />
          </div>
        </div>
        <Mono size={12 * v} color={COL.white} o={0.6 * seg(lb, 1.6, 0.4)} style={{ marginTop: 18 * v }}>{REEL.source}</Mono>
      </div>
      {lb > 3.45 && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: Math.ceil(W / cw) * Math.ceil(H / cw) }, (_, i) => {
            const cols = Math.ceil(W / cw);
            const x = (i % cols) * cw;
            const y = Math.floor(i / cols) * cw;
            const odd = (Math.floor(i / cols) + (i % cols)) % 2;
            const p = expoOut(seg(lb, 3.45 + odd * 0.18 + ((i % cols) / cols) * 0.12, 0.25));
            const s = cw * p;
            return <rect key={i} x={x + (cw - s) / 2} y={y + (cw - s) / 2} width={s + 0.5} height={s + 0.5} fill={COL.ink} />;
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
}

/* ============================================================ 4 · CINEMA */

function Cinema({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const C = REEL.cinema;
  const T = (wide ? 104 : 108) * v;
  const cols = Math.ceil(W / T) + 1;
  const rows = Math.ceil(H / T) + 1;
  const ox = (W - cols * T) / 2;
  const oy = (H - rows * T) / 2;
  // slow push, then an expo-in zoom straight past the camera
  const zoom = lerp(1, 1.08, seg(lb, 0, 3.3)) * (1 + 7 * expoIn(seg(lb, 3.3, 0.7)));
  const fade = 1 - seg(lb, 3.7, 0.3);
  const sweep = expoOut(seg(lb, 0.4, 1.6)) * Math.hypot(W, H) * 0.65;
  const sweep2 = expoOut(seg(lb, 1.9, 1.4)) * Math.hypot(W, H) * 0.65;
  const figIn = seg(lb, 0.7, 0.6);
  const plate = expoOut(seg(lb, 0.5, 0.5));
  const tiles: ReactNode[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = ox + i * T;
      const y = oy + j * T;
      const type = random(`t${i}-${j}`) < 0.5 ? 0 : 1;
      const d = (i + j) / (cols + rows);
      // a wave of quarter turns runs across the field on every beat
      let turns = 0;
      for (let k = 0; k < 4; k++) turns += backOut(seg(lb, k + d * 0.9, 0.35), 1.4);
      const rot = (type + turns) * 90;
      const dist = Math.hypot(x + T / 2 - W / 2, y + T / 2 - H / 2);
      const col = dist < sweep2 ? COL.yellow : dist < sweep ? COL.orange : COL.white;
      const h = T / 2;
      tiles.push(
        <g key={`${i}-${j}`} transform={`rotate(${rot} ${x + h} ${y + h})`}>
          <path d={`M ${x + h},${y} A ${h},${h} 0 0 1 ${x},${y + h} M ${x + T},${y + h} A ${h},${h} 0 0 0 ${x + h},${y + T}`} fill="none" stroke={col} strokeWidth={T * 0.13} strokeLinecap="butt" />
        </g>,
      );
    }
  }
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${zoom}) translate(${-W / 2} ${-H / 2})`}>{tiles}</g>
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${zoom})` }}>
        <div style={{ background: COL.ink, padding: `${30 * v}px ${50 * v}px ${40 * v}px`, transform: `scaleY(${plate})`, textAlign: 'center', maxWidth: W * 0.92 }}>
          <div style={{ overflow: 'hidden' }}>
            <Mono size={(wide ? 26 : 24) * v} color={COL.white} style={{ transform: `translateY(${(1 - expoOut(seg(lb, 0.55, 0.5))) * 110}%)`, whiteSpace: 'normal', lineHeight: 1.5 }}>{C.pre}</Mono>
          </div>
          <div style={{ overflow: 'hidden', marginTop: 6 * v }}>
            <div style={{ fontSize: (wide ? 290 : 240) * v, transform: `translateY(${(1 - backOut(figIn, 1.7)) * 100}%)` }}>
              <Fig text={C.fig} color={COL.white} accent={COL.yellow} star />
            </div>
          </div>
          <Mono size={12 * v} color={COL.white} o={0.6 * seg(lb, 1.4, 0.4)} style={{ marginTop: 14 * v }}>{REEL.source}</Mono>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ================================================================ 5 · 5X */

function Five({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const F = REEL.five;
  const cx = wide ? W * 0.7 : W / 2;
  const cy = wide ? H * 0.48 : H * 0.3;
  const R = (wide ? 300 : 330) * v;
  const lat = 14;
  const lon = 26;
  const ay = lb * 0.9;
  const ax = 0.35;
  const squash = 0.55 * Math.pow(Math.sin(Math.PI * seg(lb, 0.4, 2.6)), 2);
  const inK = backOut(seg(lb, 0, 0.7), 1.5);
  const P = (i: number, j: number) => {
    const th = (i / (lat - 1)) * Math.PI;
    const ph = (j / lon) * Math.PI * 2;
    const k = 1 - squash * Math.pow(Math.sin(th), 6) * 0.9; // pinch the equator: hourglass
    let x = Math.sin(th) * Math.cos(ph) * k;
    const y = Math.cos(th);
    let z = Math.sin(th) * Math.sin(ph) * k;
    const x1 = x * Math.cos(ay) + z * Math.sin(ay);
    z = -x * Math.sin(ay) + z * Math.cos(ay);
    x = x1;
    const y2 = y * Math.cos(ax) - z * Math.sin(ax);
    const z2 = y * Math.sin(ax) + z * Math.cos(ax);
    const p = 3.5 / (3.5 + z2);
    return { x: cx + x * R * p * inK, y: cy + y2 * R * p * inK, z: z2 };
  };
  const pts = Array.from({ length: lat }, (_, i) => Array.from({ length: lon }, (_, j) => P(i, j)));
  // exit: white blocks slam in from the right
  const blocks = [0.24, 0.16, 0.3, 0.12, 0.22];
  const figIn = seg(lb, 0.25, 0.6);

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {pts.map((row, i) => (
          <polyline key={`a${i}`} points={[...row, row[0]].map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={COL.white} strokeOpacity={0.16} strokeWidth={1} />
        ))}
        {Array.from({ length: lon }, (_, j) => (
          <polyline key={`o${j}`} points={pts.map((row) => `${row[j].x},${row[j].y}`).join(' ')} fill="none" stroke={COL.white} strokeOpacity={0.12} strokeWidth={1} />
        ))}
        {pts.flatMap((row, i) =>
          row.map((p, j) => {
            const flash = (i * 7 + j * 3 + Math.floor(lb * 6)) % 13 === 0;
            const c = flash ? ((i + j) % 2 ? COL.blue : COL.yellow) : COL.white;
            return <circle key={`${i}-${j}`} cx={p.x} cy={p.y} r={(flash ? 3.6 : 2.2) * v * (1 - p.z * 0.35)} fill={c} opacity={flash ? 1 : 0.5 - p.z * 0.3} />;
          }),
        )}
        <text x={cx} y={cy + R * 1.25} fill={COL.white} opacity={0.5} fontFamily={INTER} fontSize={11 * v} fontWeight={600} textAnchor="middle" letterSpacing=".16em">
          GUESTS {lat * lon} · EVERY ONE A FILM · ROT.Y {Math.round(((ay * 180) / Math.PI) % 360)}°
        </text>
      </svg>
      <div style={{ position: 'absolute', left: wide ? 110 * v : 0, right: wide ? undefined : 0, top: wide ? H * 0.27 : H * 0.58, textAlign: wide ? 'left' : 'center' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: (wide ? 380 : 330) * v, transform: `translateY(${(1 - backOut(figIn, 1.8)) * 100}%) scaleY(${lerp(1.3, 1, expoOut(figIn))})`, transformOrigin: 'center bottom' }}>
            <Fig text={F.fig} color={COL.white} accent={COL.blue} />
          </div>
        </div>
        {F.lines.map((l, i) => {
          const p = expoOut(seg(lb, 0.8 + i * 0.2, 0.6));
          return (
            <div key={i} style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: (wide ? 56 : 52) * v, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.15, color: i ? COL.yellow : COL.white, transform: `translateY(${(1 - p) * 110}%)` }}>{l}</div>
            </div>
          );
        })}
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {blocks.map((wf, i) => {
          const p = expoOut(seg(lb, 3.4 + i * 0.07, 0.4));
          const x0 = blocks.slice(0, i).reduce((a, c) => a + c, 0) * W;
          const x = lerp(W + 40, x0, p);
          return p > 0 ? <rect key={i} x={x} y={0} width={wf * W + 4} height={H} fill={COL.paper} /> : null;
        })}
      </svg>
    </AbsoluteFill>
  );
}

/* ============================================================ 6 · KINETIC */

function Kinetic({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const k = Math.min(3, Math.floor(lb));
  const t = lb - k; // 0..1 within the beat
  const word = REEL.kinetic[k];
  const fit = (s: string, f = 0.7) => Math.min((wide ? 420 : 300) * v, (W * 0.88) / (s.length * f));

  if (k === 0 || k === 1) {
    // a single word slams in from the side with motion blur, then drifts
    const p = expoOut(seg(t, 0, 0.45));
    const fromX = (k === 0 ? 1 : -1) * W * 0.8;
    const x = lerp(fromX, 0, p) + (t - 0.5) * -30 * v;
    const blur = (1 - p) * 60;
    const color = k === 0 ? COL.blue : COL.paper;
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <MBlur id={`k${k}`} x={blur} />
        <div style={{ transform: `translateX(${x}px) scaleX(${1 + (1 - p) * 0.4})`, filter: 'url(#k' + k + ')', fontSize: fit(word, 0.74), fontWeight: 900, letterSpacing: '-.04em', color, lineHeight: 0.9 }}>
          {word.replace('.', '')}
          {word.endsWith('.') && <span style={{ display: 'inline-block', width: '.2em', height: '.2em', borderRadius: '50%', background: COL.yellow, marginLeft: '.04em', transform: `scale(${backOut(seg(t, 0.3, 0.4), 2.5)})` }} />}
        </div>
      </AbsoluteFill>
    );
  }

  if (k === 2) {
    // WELCOME as texture: rows sliding both ways, the centre row solid and held
    const rows = wide ? 5 : 9;
    const size = (wide ? 150 : 104) * v;
    const line = `${word} `.repeat(8);
    return (
      <AbsoluteFill style={{ justifyContent: 'center' }}>
        {Array.from({ length: rows }, (_, i) => {
          const mid = i === Math.floor(rows / 2);
          const dir = i % 2 ? 1 : -1;
          const x = mid ? -W * 0.18 : dir * (t * 340 * v) - W * 0.4;
          return (
            <div
              key={i}
              style={{
                fontSize: mid ? size * 1.25 : size,
                fontWeight: 900,
                letterSpacing: '-.03em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                color: mid ? COL.ink : 'transparent',
                WebkitTextStroke: mid ? undefined : `${2 * v}px ${COL.ink}`,
                transform: `translateX(${x}px)`,
                opacity: mid ? 1 : 0.6,
              }}
            >
              {line}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  // RIGHT PLACE. on ink, a line graph drawing up behind it; then a blue iris on the bar line
  const p = expoOut(seg(t, 0, 0.4));
  const iris = expoIn(seg(t, 0.55, 0.45));
  const gx0 = W * 0.18;
  const gx1 = W * 0.82;
  const gy0 = H * 0.72;
  const gy1 = H * 0.3;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke={COL.white} strokeOpacity={0.2} />
        <line x1={gx0} y1={gy0} x2={gx1} y2={gy0} stroke={COL.white} strokeOpacity={0.2} />
        <line x1={gx0} y1={gy0} x2={lerp(gx0, gx1, expoOut(seg(t, 0, 0.6)))} y2={lerp(gy0, gy1, expoOut(seg(t, 0, 0.6)))} stroke={COL.white} strokeWidth={2} />
        <text x={gx1} y={gy1 - 14 * v} fill={COL.white} opacity={0.6} fontFamily={INTER} fontSize={12 * v} fontWeight={600} textAnchor="end" letterSpacing=".14em">f(t) = 5x</text>
      </svg>
      <div style={{ fontSize: fit(word, 0.66), fontWeight: 900, letterSpacing: '-.035em', color: COL.paper, transform: `scale(${lerp(1.25, 1, p)})`, opacity: p, lineHeight: 0.9 }}>
        {word.replace('.', '')}
        <span style={{ color: COL.orange }}>.</span>
      </div>
      {iris > 0 && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={W / 2} cy={H / 2} r={iris * Math.hypot(W, H) * 0.55} fill={COL.blue} />
        </svg>
      )}
    </AbsoluteFill>
  );
}

/* ================================================================= 7 · FIN */

function Fin({ lb, box }: { lb: number; box: Box }) {
  const { W, H, v, wide } = box;
  const F = REEL.fin;
  const s = (wide ? 230 : 300) * v;
  const word = (wide ? 150 : 112) * v;
  // the mark sits left of the wordmark on wide, above it on portrait
  const gapC = (s * 0.82) / 3 + 12 * v; // clear space: a third of the drawn width
  const blockW = wide ? s * 0.82 + gapC + word * 7.4 : 0;
  const mx = wide ? W / 2 - blockW / 2 + s * 0.41 : W / 2;
  const my = wide ? H * 0.43 : H * 0.36;
  const pop = backOut(seg(lb, 0.1, 0.55), 2.6);
  const slide = expoOut(seg(lb, 0.55, 0.7));
  const ital = expoOut(seg(lb, 1.1, 0.6));
  const rule = expoOut(seg(lb, 1.3, 0.8));
  const confetti = seg(lb, 0.15, 2.2);

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {/* a shock ring on the hit */}
        <circle cx={mx} cy={my} r={s * (0.5 + 1.6 * expoOut(seg(lb, 0.1, 0.8)))} fill="none" stroke={COL.white} strokeWidth={6 * v * (1 - seg(lb, 0.1, 0.8))} opacity={1 - seg(lb, 0.1, 0.8)} />
        {Array.from({ length: 40 }, (_, i) => {
          const a = random(`a${i}`) * Math.PI * 2;
          const d = (180 + random(`d${i}`) * (wide ? 720 : 520)) * v * expoOut(confetti);
          const x = mx + Math.cos(a) * d;
          const y = my + Math.sin(a) * d * (wide ? 0.7 : 1) + confetti * confetti * 120 * v;
          const r = (6 + random(`r${i}`) * 9) * v;
          const c = [COL.yellow, COL.white, COL.orange, COL.ink][i % 4];
          const o = confetti > 0 ? 1 - seg(lb, 2.4, 1.2) : 0;
          const rot = lb * 200 * (i % 2 ? 1 : -1);
          if (i % 3 === 0) return <Tri key={i} x={x} y={y} r={r} fill={c} rot={rot} o={o} />;
          if (i % 3 === 1) return <circle key={i} cx={x} cy={y} r={r * 0.7} fill={c} opacity={o} />;
          return <g key={i} opacity={o}><Plus x={x} y={y} r={r * 0.8} fill={c} rot={rot} /></g>;
        })}
        <g transform={`translate(${mx} ${my}) scale(${Math.max(0.001, pop)}) translate(${-mx} ${-my})`}>
          <Tetra x={mx} y={my} s={s} ink={COL.white} />
        </g>
      </svg>
      {/* the wordmark slides out from behind the mark */}
      <div
        style={{
          position: 'absolute',
          left: wide ? mx + s * 0.41 + gapC : 0,
          right: wide ? undefined : 0,
          top: wide ? my - word * 0.62 : my + s * 0.35 + (s * 0.82) / 3,
          textAlign: wide ? 'left' : 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: word, letterSpacing: '-.03em', lineHeight: 1.05, color: COL.white, whiteSpace: 'nowrap', transform: wide ? `translateX(${(1 - slide) * -110}%)` : `translateY(${(1 - slide) * -110}%)` }}>
          <span style={{ fontWeight: 600 }}>Apex</span> <span style={{ fontWeight: 400, fontStyle: 'italic', opacity: 0.62 }}>Hospitality</span>
        </div>
        <div style={{ fontSize: (wide ? 40 : 38) * v, fontStyle: 'italic', fontWeight: 500, color: COL.white, opacity: ital, transform: `translateY(${(1 - ital) * 20 * v}px)`, marginTop: 8 * v, padding: wide ? 0 : `0 ${50 * v}px`, whiteSpace: wide ? 'nowrap' : 'normal' }}>{F.line}</div>
        <div style={{ height: 2, background: COL.white, opacity: 0.8, marginTop: 22 * v, width: wide ? `${rule * 100}%` : `${rule * 80}%`, marginLeft: wide ? 0 : 'auto', marginRight: wide ? 0 : 'auto' }} />
        <div style={{ display: 'flex', gap: 22 * v, marginTop: 14 * v, justifyContent: wide ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
          {F.meta.map((m, i) => (
            <Mono key={m} size={12 * v} color={COL.white} o={seg(lb, 1.5 + i * 0.1, 0.3)}>{m}</Mono>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 * v, marginTop: 22 * v, justifyContent: wide ? 'flex-start' : 'center' }}>
          {F.tags.map((tg, i) => {
            const p = backOut(seg(lb, 1.8 + i * 0.15, 0.5), 2);
            return (
              <div key={tg} style={{ padding: `${10 * v}px ${22 * v}px`, borderRadius: 999, fontSize: 18 * v, fontWeight: 800, letterSpacing: '.14em', background: i ? 'transparent' : COL.yellow, color: i ? COL.white : COL.ink, border: i ? `2px solid ${COL.white}` : `2px solid ${COL.yellow}`, transform: `translateY(${(1 - p) * 40 * v}px)`, opacity: clamp(p) }}>
                {tg}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

