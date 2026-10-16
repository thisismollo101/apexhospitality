import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource-variable/inter/wght-italic.css';
import { FACES, INTER } from '../brand';
import { BEATS, BPM, COL, STORY } from './welcome-story.data';

/*
 * Apex Welcome — the hero story, as a 15s film. Copy and timing live in
 * welcome-story.data.ts. Motion is deliberately calm: everything eases out,
 * nothing overshoots or pulses, and each figure is revealed whole rather than
 * counted, so the number on screen is always the real one.
 */
export const STORY_FPS = 60;
export const STORY_FRAMES = Math.round((BEATS * 60 * STORY_FPS) / BPM);

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const seg = (b: number, a: number, d: number) => clamp((b - a) / d);
const eo3 = (t: number) => 1 - Math.pow(1 - t, 3);
const eio3 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eoExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Box = { W: number; H: number; v: number; wide: boolean };
type Shape = 'circle' | 'square' | 'triangle';

/* ------------------------------------------------------------------ the mark */

const facePts = (i: number, x: number, y: number, s: number) =>
  FACES[i].points
    .split(' ')
    .map((pt) => {
      const [gx, gy] = pt.split(',').map(Number);
      return `${x + ((gx - 50) / 100) * s},${y + ((gy - 50) / 100) * s}`;
    })
    .join(' ');

/** The mark, assembling: faces glide in and land on the exact drawn artwork at p = 1. */
const Mark = ({ x, y, s, p = 1, ink = COL.blue }: { x: number; y: number; s: number; p?: number; ink?: string }) => {
  const from = [
    [-1.4, -0.7, -40],
    [1.4, -0.4, 40],
    [0, 1.2, 0],
  ];
  return (
    <>
      {FACES.map((f, i) => {
        const q = eo3(clamp(p * 1.3 - i * 0.15));
        const [dx, dy, r] = from[i];
        return (
          <polygon
            key={i}
            points={facePts(i, x, y, s)}
            fill={ink}
            opacity={f.opacity * clamp(q * 2.5)}
            transform={q >= 1 ? undefined : `translate(${dx * s * (1 - q)} ${dy * s * (1 - q)}) rotate(${r * (1 - q)} ${x} ${y})`}
          />
        );
      })}
    </>
  );
};

/* ----------------------------------------------------------------- the film */

export const WelcomeStory = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const b = (frame / fps) * (BPM / 60);
  const box: Box = { W, H, v: Math.min(W, H) / 1080, wide: W > H };
  const S = STORY;

  // background follows the story; each cut is a shape growing in the next colour
  const scenes = [
    { at: S.leak.at, bg: COL.ink },
    { at: S.desk.at, bg: COL.white, shape: 'circle' as Shape, lead: COL.orange },
    { at: S.cinema.at, bg: COL.blue, shape: 'square' as Shape, lead: COL.yellow },
    { at: S.five.at, bg: COL.yellow, shape: 'triangle' as Shape, lead: COL.blue },
    { at: S.place.at, bg: COL.ink, shape: 'circle' as Shape, lead: COL.yellow },
    { at: S.end.at, bg: COL.ink },
  ];
  let k = 0;
  for (let i = 0; i < scenes.length; i++) if (b >= scenes[i].at) k = i;
  const nx = scenes[k + 1];
  const grow = nx && nx.shape ? eio3(seg(b, nx.at - 0.75, 0.75)) : 0;

  return (
    <AbsoluteFill style={{ background: scenes[k].bg, fontFamily: INTER, overflow: 'hidden' }}>
      {k === 0 && <Leak lb={b - S.leak.at} box={box} />}
      {(k === 1 || k === 2) && <Conversion b={b} box={box} />}
      {k === 3 && <Five lb={b - S.five.at} box={box} />}
      {k === 4 && <Place lb={b - S.place.at} box={box} />}
      {k === 5 && <End lb={b - S.end.at} box={box} />}
      {nx && nx.shape && grow > 0 && <Grow shape={nx.shape} p={grow} color={nx.bg} lead={nx.lead!} box={box} />}
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- shape morph cut */

const Grow = ({ shape, p, color, lead, box }: { shape: Shape; p: number; color: string; lead: string; box: Box }) => {
  const { W, H } = box;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.hypot(W, H) * 0.62;
  const draw = (r: number, fill: string, rot: number, key: string) => {
    if (shape === 'circle') return <circle key={key} cx={cx} cy={cy} r={r} fill={fill} />;
    if (shape === 'square') return <rect key={key} x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={fill} transform={`rotate(${rot} ${cx} ${cy})`} />;
    const rr = r * 2.1;
    const pts = [0, 1, 2].map((i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
      return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
    });
    return <polygon key={key} points={pts.join(' ')} fill={fill} transform={`rotate(${rot} ${cx} ${cy})`} />;
  };
  const a = eo3(p);
  const c = eio3(clamp(p * 1.2 - 0.2));
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      {draw(R * a, lead, (1 - a) * 45, 'lead')}
      {draw(R * c, color, (1 - c) * 45, 'fill')}
    </svg>
  );
};

/* ------------------------------------------------------------ kinetic type */

/** Words rise out of a mask one after another. Ease-out only, no overshoot. */
const Words = ({ lines, lb, start, step = 0.09, size, weight = 700, color, accentLast, v }: {
  lines: string[]; lb: number; start: number; step?: number; size: number; weight?: number; color?: string; accentLast?: string; v: number;
}) => {
  let w = 0;
  const total = lines.reduce((n, l) => n + l.split(' ').length, 0);
  return (
    <>
      {lines.map((line, li) => (
        <div key={li} style={{ overflow: 'hidden', fontSize: size, fontWeight: weight, letterSpacing: '-.03em', lineHeight: 1.08, paddingBottom: 0.08 * size, color }}>
          {line.split(' ').map((word, i) => {
            const idx = w++;
            const p = eo3(seg(lb, start + idx * step, 0.5));
            return (
              <span key={i} style={{ display: 'inline-block', marginRight: '.24em', transform: `translateY(${(1 - p) * 105}%)`, color: accentLast && idx === total - 1 ? accentLast : undefined }}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
};

/** A figure revealed whole: it slides up out of a mask as a finished number. */
const Figure = ({ text, lb, start, size, color, accent, star, v }: { text: string; lb: number; start: number; size: number; color: string; accent: string; star?: boolean; v: number }) => {
  const p = eoExpo(seg(lb, start, 0.9));
  const unit = text.match(/[%x]$/)?.[0] ?? '';
  const num = unit ? text.slice(0, -1) : text;
  return (
    <div style={{ overflow: 'hidden', paddingBottom: 0.04 * size }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-.05em', lineHeight: 0.92, color, transform: `translateY(${(1 - p) * 100}%)`, fontVariantNumeric: 'lining-nums' }}>
        {num.split('–').map((part, i) => (
          <span key={i}>
            {i > 0 && (
              // the range dash is drawn, not typed: Inter's en dash at this
              // weight and tracking runs into the digits either side
              <span style={{ display: 'inline-block', width: '.24em', height: '.07em', background: 'currentColor', borderRadius: '.035em', margin: '0 .07em', verticalAlign: '.34em' }} />
            )}
            {part}
          </span>
        ))}
        <span style={{ color: accent, marginLeft: '.02em' }}>{unit}</span>
        {star && <span style={{ position: 'relative', top: '-1.45em', fontSize: '.3em', fontWeight: 600, marginLeft: '-.02em', opacity: 0.7 }}>*</span>}
      </div>
    </div>
  );
};

/** Calm floating shapes, kept to the edges so the copy owns the middle. */
const Drift = ({ lb, box, cols, spots }: { lb: number; box: Box; cols: string[]; spots: { s: Shape; x: number; y: number; r: number }[] }) => {
  const { W, H, v } = box;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      {spots.map((d, i) => {
        const p = eo3(seg(lb, 0.2 + i * 0.25, 1));
        const x = d.x * W + Math.sin(lb * 0.5 + i * 2) * 10 * v;
        const y = d.y * H + Math.cos(lb * 0.4 + i) * 10 * v + (1 - p) * 60 * v;
        const r = d.r * v;
        const rot = lb * 12 * (i % 2 ? 1 : -1);
        const fill = cols[i % cols.length];
        const o = p;
        if (d.s === 'circle') return <circle key={i} cx={x} cy={y} r={r} fill={fill} opacity={o} />;
        if (d.s === 'square') return <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={fill} opacity={o} transform={`rotate(${rot} ${x} ${y})`} />;
        return <polygon key={i} points={`${x},${y - r * 1.15} ${x - r},${y + r * 0.6} ${x + r},${y + r * 0.6}`} fill={fill} opacity={o} transform={`rotate(${rot} ${x} ${y})`} />;
      })}
    </svg>
  );
};

const textBlock = (box: Box, topWide: number, topTall: number) => ({
  position: 'absolute' as const,
  left: box.wide ? 150 * box.v : 70 * box.v,
  right: box.wide ? undefined : 70 * box.v,
  top: box.wide ? box.H * topWide : box.H * topTall,
  textAlign: (box.wide ? 'left' : 'center') as 'left' | 'center',
});

/* -------------------------------------------------------- 1 · the leak */

const Leak = ({ lb, box }: { lb: number; box: Box }) => {
  const { W, H, v, wide } = box;
  // an inverted triangle, a funnel, spilling coloured shapes from its point
  const cx = wide ? W * 0.77 : W / 2;
  const cy = wide ? H * 0.42 : H * 0.26;
  const s = (wide ? 400 : 460) * v;
  const inK = eo3(seg(lb, 0, 0.9));
  const tip = cy + s * 0.5;
  const drops = Array.from({ length: 22 }, (_, i) => {
    const t0 = 0.6 + i * 0.19;
    const q = lb - t0;
    if (q < 0) return null;
    const fall = q * q * 260 * v + q * 120 * v; // gravity
    const x = cx + Math.sin(i * 2.7) * 26 * v + q * Math.sin(i * 1.3) * 40 * v;
    const y = tip + 10 * v + fall;
    // on portrait the copy sits under the funnel, so the spill fades out above it
    const floor = wide ? H + 60 : H * 0.5;
    if (y > floor) return null;
    const r = (10 + (i % 3) * 6) * v;
    const col = [COL.yellow, COL.orange, COL.blue, COL.white][i % 4];
    const rot = q * 120 * (i % 2 ? 1 : -1);
    const o = wide ? 1 : clamp((floor - y) / (120 * v));
    if (i % 3 === 0) return <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={o} />;
    if (i % 3 === 1) return <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={col} opacity={o} transform={`rotate(${rot} ${x} ${y})`} />;
    return <polygon key={i} points={`${x},${y - r * 1.15} ${x - r},${y + r * 0.6} ${x + r},${y + r * 0.6}`} fill={col} opacity={o} transform={`rotate(${rot} ${x} ${y})`} />;
  });
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <polygon
          points={`${cx - s * 0.58},${cy - s * 0.5} ${cx + s * 0.58},${cy - s * 0.5} ${cx},${tip}`}
          fill={COL.blue}
          opacity={inK}
          transform={`translate(0 ${(1 - inK) * -80 * v})`}
        />
        <polygon points={`${cx - s * 0.4},${cy - s * 0.38} ${cx + s * 0.4},${cy - s * 0.38} ${cx},${cy + s * 0.28}`} fill={COL.ink} opacity={0.22 * inK} />
        {drops}
      </svg>
      <div style={textBlock(box, 0.3, 0.55)}>
        <Words lines={STORY.leak.lines} lb={lb} start={0.3} step={0.11} size={(wide ? 96 : 80) * v} weight={800} color={COL.white} accentLast={COL.orange} v={v} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------- 2–3 · front desk vs Mobile Cinema */

/*
 * One scene in two halves. The grid of twenty guests holds still across the
 * cut, so the change reads as the same guests answering differently: one of
 * them at the desk, five once the film reaches them first.
 */
const Conversion = ({ b, box }: { b: number; box: Box }) => {
  const { W, H, v, wide } = box;
  const desk = b < STORY.cinema.at;
  const d = desk ? STORY.desk : STORY.cinema;
  const lb = b - d.at;
  const fg = desk ? COL.ink : COL.white;
  const accent = desk ? COL.orange : COL.yellow;

  const cell = (wide ? 104 : 120) * v;
  const gx = wide ? W * 0.77 : W / 2;
  const gy = wide ? H * 0.47 : H * 0.27;
  const lit = desk ? 1 : 5;
  const order = [12, 0, 6, 18, 9]; // which squares light, in turn

  return (
    <AbsoluteFill>
      <Drift
        lb={lb}
        box={box}
        cols={desk ? [COL.blue, COL.yellow] : [COL.yellow, COL.white]}
        spots={wide ? [{ s: 'circle', x: 0.93, y: 0.12, r: 46 }, { s: 'triangle', x: 0.5, y: 0.86, r: 34 }] : [{ s: 'circle', x: 0.88, y: 0.06, r: 40 }, { s: 'triangle', x: 0.1, y: 0.5, r: 30 }]}
      />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const r = Math.floor(i / 5);
          const c = i % 5;
          const x = gx - 2.5 * cell + c * cell + cell * 0.09;
          const y = gy - 2 * cell + r * cell + cell * 0.09;
          const n = order.indexOf(i);
          const on = n >= 0 && n < lit ? eo3(seg(lb, 1.2 + n * 0.28, 0.6)) : 0;
          // on the cut into Mobile Cinema, the desk's one orange square is already lit
          const carry = !desk && n === 0 ? 1 : on;
          const enter = desk ? eo3(seg(lb, i * 0.025, 0.6)) : 1;
          const s = cell * 0.82 * enter;
          return (
            <g key={i}>
              <rect x={x + (cell * 0.82 - s) / 2} y={y + (cell * 0.82 - s) / 2} width={s} height={s} rx={10 * v} fill={fg} opacity={0.12} />
              {carry > 0 && <rect x={x} y={y} width={cell * 0.82} height={cell * 0.82} rx={10 * v} fill={accent} opacity={carry} />}
            </g>
          );
        })}
      </svg>
      <div style={textBlock(box, 0.22, 0.52)}>
        <Words lines={d.pre} lb={lb} start={0.15} step={0.08} size={(wide ? 54 : 50) * v} weight={600} color={fg} v={v} />
        <div style={{ marginTop: 18 * v }}>
          <Figure text={d.fig} lb={lb} start={0.9} size={Math.min((wide ? 260 : 220) * v, (wide ? W * 0.36 : W * 0.8) / (d.fig.length * 0.62))} color={fg} accent={accent} star v={v} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: wide ? 150 * v : 0, right: wide ? undefined : 0, bottom: 70 * v, textAlign: wide ? 'left' : 'center', fontSize: 20 * v, fontWeight: 500, color: fg, opacity: 0.55 * eo3(seg(lb, 1.6, 0.6)) }}>
        {STORY.source}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- 4 · 5x */

const Five = ({ lb, box }: { lb: number; box: Box }) => {
  const { W, H, v, wide } = box;
  const bw = (wide ? 130 : 150) * v;
  const unit = (wide ? 104 : 110) * v;
  const cx = wide ? W * 0.73 : W / 2;
  const base = wide ? H * 0.78 : H * 0.47;
  const one = unit * eo3(seg(lb, 0.4, 0.8));
  const five = unit * 5 * eoExpo(seg(lb, 0.9, 1.6));
  const x1 = cx - bw * 1.3;
  const x5 = cx + bw * 0.3;
  const lab = (x: number, t: string, o: number) => (
    <text x={x} y={base + 44 * v} fill={COL.ink} opacity={o} fontFamily={INTER} fontSize={24 * v} fontWeight={700} textAnchor="middle" letterSpacing=".06em">
      {t}
    </text>
  );
  return (
    <AbsoluteFill>
      <Drift lb={lb} box={box} cols={[COL.orange, COL.blue]} spots={wide ? [{ s: 'square', x: 0.46, y: 0.14, r: 30 }, { s: 'circle', x: 0.94, y: 0.2, r: 40 }] : [{ s: 'square', x: 0.12, y: 0.07, r: 28 }, { s: 'circle', x: 0.9, y: 0.12, r: 36 }]} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <rect x={x1} y={base - one} width={bw} height={one} fill={COL.ink} opacity={0.22} />
        <rect x={x5} y={base - five} width={bw} height={five} fill={COL.blue} />
        <polygon points={`${x5 + bw / 2},${base - five - bw * 0.62} ${x5},${base - five} ${x5 + bw},${base - five}`} fill={COL.ink} opacity={seg(lb, 2, 0.4)} />
        <line x1={cx - bw * 1.8} x2={cx + bw * 1.8} y1={base} y2={base} stroke={COL.ink} strokeWidth={4} />
        {lab(x1 + bw / 2, 'TODAY', 0.6 * seg(lb, 0.6, 0.4))}
        {lab(x5 + bw / 2, 'APEX WELCOME', seg(lb, 1.2, 0.4))}
      </svg>
      <div style={textBlock(box, 0.24, 0.55)}>
        <Figure text={STORY.five.fig} lb={lb} start={0.1} size={(wide ? 340 : 300) * v} color={COL.ink} accent={COL.blue} v={v} />
        <div style={{ marginTop: 22 * v }}>
          <Words lines={STORY.five.lines} lb={lb} start={0.7} step={0.09} size={(wide ? 58 : 54) * v} weight={700} color={COL.ink} v={v} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------- 5 · you're in the right place */

const Place = ({ lb, box }: { lb: number; box: Box }) => {
  const { W, H, v, wide } = box;
  // shapes drift in from the edges toward the centre, where the mark will form
  const n = 14;
  const gather = eio3(seg(lb, 2.4, 1.1));
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2 + 0.3;
          const R0 = Math.hypot(W, H) * 0.42;
          const R1 = Math.min(W, H) * (wide ? 0.36 : 0.5);
          const R = lerp(lerp(R0, R1, eo3(seg(lb, 0, 1.4))), 0, gather);
          const x = W / 2 + Math.cos(a + lb * 0.12) * R * (wide ? 1.35 : 0.9);
          const y = H / 2 + Math.sin(a + lb * 0.12) * R * (wide ? 0.8 : 1.5);
          const r = (14 + (i % 3) * 8) * v * (1 - gather * 0.7);
          const col = [COL.blue, COL.yellow, COL.orange, COL.white][i % 4];
          const o = 1 - gather;
          if (i % 3 === 0) return <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={o} />;
          if (i % 3 === 1) return <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={col} opacity={o} transform={`rotate(${lb * 20 + i * 30} ${x} ${y})`} />;
          return <polygon key={i} points={`${x},${y - r * 1.15} ${x - r},${y + r * 0.6} ${x + r},${y + r * 0.6}`} fill={col} opacity={o} transform={`rotate(${lb * -20 + i * 30} ${x} ${y})`} />;
        })}
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 1 - eio3(seg(lb, 2.6, 0.8)) }}>
        <Words lines={STORY.place.lines} lb={lb} start={0.15} step={0.13} size={(wide ? 150 : 128) * v} weight={800} color={COL.white} accentLast={COL.yellow} v={v} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* -------------------------------------------- 6 · Apex Welcome and the logo */

const End = ({ lb, box }: { lb: number; box: Box }) => {
  const { W, H, v, wide } = box;
  const E = STORY.end;
  const s = (wide ? 300 : 380) * v;
  const cx = W / 2;
  const cy = H / 2 - (wide ? 160 : 300) * v;
  const lk = eo3(seg(lb, 1.2, 0.9));
  const pill = eo3(seg(lb, 1.8, 0.8));
  const url = eo3(seg(lb, 3.6, 0.9));
  const out = eio3(seg(lb, E.len - 0.6, 0.6));
  // four shapes settle around the mark, outside its clear space, and keep turning slowly
  const ring = [
    // all above the lockup line, so nothing ever crosses the wordmark
    { s: 'circle' as Shape, c: COL.yellow, r: 30, a: -1.57 },
    { s: 'square' as Shape, c: COL.orange, r: 22, a: -0.35 },
    { s: 'triangle' as Shape, c: COL.white, r: 24, a: -2.75 },
    { s: 'circle' as Shape, c: COL.blue, r: 16, a: 0.2 },
  ];
  const inK = eo3(seg(lb, 0.5, 1.4));
  const R = s * 0.9;

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {ring.map((o, i) => {
          const a = o.a + Math.sin(lb * 0.5 + i) * 0.12;
          const x = cx + Math.cos(a) * R * lerp(2.5, 1, inK);
          const y = cy + Math.sin(a) * R * 0.75 * lerp(2.5, 1, inK);
          const r = o.r * v;
          if (o.s === 'circle') return <circle key={i} cx={x} cy={y} r={r} fill={o.c} opacity={inK} />;
          if (o.s === 'square') return <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={o.c} opacity={inK} transform={`rotate(${lb * 18} ${x} ${y})`} />;
          return <polygon key={i} points={`${x},${y - r * 1.15} ${x - r},${y + r * 0.6} ${x + r},${y + r * 0.6}`} fill={o.c} opacity={inK} transform={`rotate(${lb * -15} ${x} ${y})`} />;
        })}
        <Mark x={cx} y={cy} s={s} p={seg(lb, 0, 1.4)} />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy + 0.35 * s + (0.82 * s) / 3, textAlign: 'center', color: COL.white }}>
        <div style={{ fontSize: (wide ? 112 : 104) * v, letterSpacing: '-.025em', lineHeight: 1, opacity: lk, transform: `translateY(${(1 - lk) * 30 * v}px)` }}>
          <span style={{ fontWeight: 600 }}>Apex</span> <span style={{ fontWeight: 400, fontStyle: 'italic', opacity: 0.62 }}>Hospitality</span>
        </div>
        <div style={{ display: 'inline-block', marginTop: 30 * v, padding: `${10 * v}px ${28 * v}px`, borderRadius: 999, background: COL.blue, fontSize: 30 * v, fontWeight: 700, letterSpacing: '.14em', opacity: pill, transform: `translateY(${(1 - pill) * 20 * v}px)` }}>
          {E.product.toUpperCase()}
        </div>
        <div style={{ marginTop: 32 * v, padding: `0 ${60 * v}px` }}>
          <Words lines={wide ? [E.line] : ['A personal film for every', 'guest who books.']} lb={lb} start={2.4} step={0.08} size={46 * v} weight={600} color={COL.white} v={v} />
        </div>
        <div style={{ marginTop: 22 * v, fontSize: 26 * v, fontWeight: 600, letterSpacing: '.08em', color: COL.yellow, opacity: url }}>{E.url}</div>
      </div>
    </AbsoluteFill>
  );
};
