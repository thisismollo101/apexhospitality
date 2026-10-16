import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { FACES, INTER } from '../brand';
import { BPM, COL, END, SECTIONS, type Section, type Shape } from './welcome-ad.data';

/*
 * Apex Welcome — a 15s motion ad for the Welcome page hero. 128 BPM: six
 * figure sections of four beats, then an eight-beat end card, looping.
 * Everything is a function of the beat, so every cut lands on one.
 *
 * Copy and figures are in welcome-ad.data.ts.
 */
export const AD_FPS = 60;
export const AD_FRAMES = 900; // 32 beats at 128 BPM = 15.0s

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const seg = (b: number, a: number, d: number) => clamp((b - a) / d);
const eo3 = (t: number) => 1 - Math.pow(1 - t, 3);
const eio3 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eoExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const pulse = (b: number) => (b < 0 ? 0 : Math.exp(-(b - Math.floor(b)) * 6));
const bez = (p: [number, number, number, number]) => Easing.bezier(...p);

export const WelcomeAd = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const b = (frame / fps) * (BPM / 60);
  const wide = W > H;
  const v = Math.min(W, H) / 1080;

  const idx = Math.min(6, Math.floor(b / 4));
  const lb = b - idx * 4;
  const sec = SECTIONS[idx] as Section | undefined;
  const bg = sec ? sec.bg : COL.ink;
  const fg = sec ? sec.fg : COL.white;

  // the next section's shape grows out of the centre over the last ~2/3 beat
  const next = idx < 5 ? SECTIONS[idx + 1] : null;
  const grow = eio3(seg(lb, 3.35, 0.65));
  const nextBg = next ? next.bg : COL.ink;

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: INTER, overflow: 'hidden' }}>
      {sec ? <SectionView sec={sec} i={idx} lb={lb} W={W} H={H} v={v} wide={wide} /> : <EndCard lb={lb} W={W} H={H} v={v} wide={wide} />}
      {idx < 6 && grow > 0 && <Grow shape={next ? next.shape : 'triangle'} p={grow} color={nextBg} W={W} H={H} />}
      <Hud b={b} idx={idx} lb={lb} color={grow > 0.5 ? (next ? next.fg : COL.white) : fg} W={W} H={H} v={v} sec={grow > 0.5 ? next : sec} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------- shape morph cut */

const Grow = ({ shape, p, color, W, H }: { shape: Shape; p: number; color: string; W: number; H: number }) => {
  const R = Math.hypot(W, H) * 0.62 * p;
  const cx = W / 2;
  const cy = H / 2;
  const rot = (1 - p) * 90;
  let el: ReactNode;
  if (shape === 'circle') el = <circle cx={cx} cy={cy} r={R} fill={color} />;
  else if (shape === 'square') el = <rect x={cx - R} y={cy - R} width={R * 2} height={R * 2} fill={color} transform={`rotate(${rot} ${cx} ${cy})`} />;
  else {
    const r = R * 2.1;
    const pts = [0, 1, 2].map((k) => {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / 3;
      return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
    });
    el = <polygon points={pts.join(' ')} fill={color} transform={`rotate(${rot * 0.5} ${cx} ${cy})`} />;
  }
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      {el}
    </svg>
  );
};

/* ---------------------------------------------------------------- section */

const SectionView = ({ sec, i, lb, W, H, v, wide }: { sec: Section; i: number; lb: number; W: number; H: number; v: number; wide: boolean }) => {
  const ease = bez(sec.ease.bez);
  const count = ease(seg(lb, 0.2, 1.6)); // the figure runs on the section's own curve
  const lo = sec.fig.to[0];
  const hi = sec.fig.to[1];
  const a = Math.round(lo * Math.min(1, count * (hi ? 1.25 : 1)));
  // a range counts its low end first, then the high end rolls on from it
  const bb = hi && count >= 0.8 ? Math.round(lo + (hi - lo) * clamp((count - 0.8) / 0.2)) : null;
  const punch = 1 + 0.035 * pulse(lb);
  const figIn = eoExpo(seg(lb, 0, 0.5));
  const exit = eio3(seg(lb, 3.5, 0.5));

  const chars = `${hi ?? lo}${hi ? `${lo}–` : ''}${sec.fig.unit}`.length + (sec.fig.star ? 0.4 : 0);
  const figSize = Math.min(300 * v, (wide ? W * 0.44 : W * 0.86) / (chars * 0.64));
  const textX = wide ? 150 * v : 0;
  const words = sec.lines.map((l) => l.split(' '));
  let w = 0;

  const G = 520 * v;
  const gx = wide ? W * 0.74 : W / 2;
  const gy = wide ? H / 2 + 10 * v : H * 0.33;

  return (
    <AbsoluteFill style={{ color: sec.fg, transform: `translateY(${-exit * 60 * v}px)`, opacity: 1 - exit * 0.6 }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Graphic kind={sec.graphic} lb={lb} cx={gx} cy={gy} G={G} sec={sec} count={count} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: textX,
          right: wide ? undefined : 0,
          top: wide ? H * 0.27 : H * 0.6,
          textAlign: wide ? 'left' : 'center',
        }}
      >
        <div
          style={{
            fontSize: figSize,
            fontWeight: 800,
            letterSpacing: '-.055em',
            lineHeight: 0.9,
            fontVariantNumeric: 'tabular-nums',
            transform: `scale(${punch}) translateY(${(1 - figIn) * 80 * v}px)`,
            transformOrigin: wide ? 'left bottom' : 'center bottom',
            opacity: figIn,
          }}
        >
          {a}
          {bb !== null && <>–{bb}</>}
          <span style={{ color: sec.accent }}>{sec.fig.unit}</span>
          {sec.fig.star && <span style={{ fontSize: '.32em', verticalAlign: 'top', opacity: 0.7 }}>*</span>}
        </div>
        <div style={{ marginTop: 34 * v }}>
          {words.map((line, li) => (
            <div key={li} style={{ overflow: 'hidden', fontSize: 54 * v, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.18, paddingBottom: 4 * v }}>
              {line.map((word, k) => {
                const p = eo3(seg(lb, 0.55 + w++ * 0.125, 0.45));
                return (
                  <span key={k} style={{ display: 'inline-block', marginRight: '.25em', transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>
                    {word}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {sec.source && (
          <div style={{ marginTop: 26 * v, fontSize: 20 * v, fontWeight: 500, opacity: 0.6 * eo3(seg(lb, 1.6, 0.5)), letterSpacing: '.01em' }}>
            {sec.fig.star ? '* ' : 'Source: '}
            {sec.source}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- graphics */

const Graphic = ({ kind, lb, cx, cy, G, sec, count }: { kind: Section['graphic']; lb: number; cx: number; cy: number; G: number; sec: Section; count: number }) => {
  const fg = sec.fg;
  const A = sec.accent;
  const enter = eoExpo(seg(lb, 0, 0.6));

  if (kind === 'ring') {
    // 100 ticks round a dial; 52 light up on the section's curve
    const R = (G / 2) * (0.85 + 0.15 * enter);
    const lit = Math.round(52 * count);
    return (
      <g transform={`rotate(${lb * 8} ${cx} ${cy})`}>
        {Array.from({ length: 100 }, (_, k) => {
          const a = (k / 100) * Math.PI * 2 - Math.PI / 2;
          const on = k < lit;
          const len = on ? 46 + 18 * pulse(lb * 2 - k * 0.01) : 26;
          return (
            <line
              key={k}
              x1={cx + Math.cos(a) * (R - len)}
              y1={cy + Math.sin(a) * (R - len)}
              x2={cx + Math.cos(a) * R}
              y2={cy + Math.sin(a) * R}
              stroke={on ? A : fg}
              strokeOpacity={on ? 1 : 0.18}
              strokeWidth={on ? 7 : 4}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={R * 0.42 * enter} fill={A} opacity={0.12 + 0.1 * pulse(lb)} />
      </g>
    );
  }

  if (kind === 'slowbar' || kind === 'fastbar') {
    // 20 guests as squares. The front desk reaches one of them; Apex reaches five.
    const n = 20;
    const cols = 5;
    const cell = G / 5.4;
    const reach = kind === 'slowbar' ? 1 : 5;
    const lit = reach * count;
    return (
      <g>
        {Array.from({ length: n }, (_, k) => {
          const r = Math.floor(k / cols);
          const c = k % cols;
          const x = cx - (cols * cell) / 2 + c * cell + cell * 0.08;
          const y = cy - (4 * cell) / 2 + r * cell + cell * 0.08;
          const on = clamp(lit - k);
          const pop = kind === 'fastbar' ? 1 + 0.25 * Math.sin(on * Math.PI) : 1;
          const s = cell * 0.84 * eo3(seg(lb, k * 0.02, 0.4)) * pop;
          return (
            <rect
              key={k}
              x={x + (cell * 0.84 - s) / 2}
              y={y + (cell * 0.84 - s) / 2}
              width={s}
              height={s}
              rx={kind === 'slowbar' ? 0 : 6}
              fill={on > 0 ? A : fg}
              fillOpacity={on > 0 ? 0.25 + 0.75 * on : 0.12}
            />
          );
        })}
      </g>
    );
  }

  if (kind === 'plates') {
    // eight plates; seven leave the building
    return (
      <g>
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2 - Math.PI / 2;
          const R = G * 0.36;
          const leave = k === 0 ? 0 : eio3(seg(lb, 1.2 + k * 0.12, 0.9));
          const d = R + leave * G * 1.4;
          const x = cx + Math.cos(a) * d;
          const y = cy + Math.sin(a) * d;
          const r = G * 0.085 * enter;
          return (
            <g key={k} opacity={1 - leave * 0.4}>
              <circle cx={x} cy={y} r={r} fill={k === 0 ? A : fg} />
              <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke={k === 0 ? sec.bg : sec.bg} strokeWidth={3} strokeOpacity={0.5} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={G * 0.14 * enter} fill="none" stroke={fg} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="6 10" transform={`rotate(${lb * 30} ${cx} ${cy})`} />
      </g>
    );
  }

  if (kind === 'phone') {
    // a phone plays a personal film; four tiles stack beside the one email
    const pw = G * 0.46;
    const ph = pw * 2.05;
    const px = cx - pw / 2;
    const py = cy - ph / 2 + (1 - enter) * 120;
    const play = eo3(seg(lb, 0.6, 2.4));
    return (
      <g>
        <rect x={px} y={py} width={pw} height={ph} rx={pw * 0.16} fill="none" stroke={fg} strokeWidth={5} />
        <rect x={px + pw * 0.08} y={py + pw * 0.08} width={pw * 0.84} height={ph - pw * 0.16} rx={pw * 0.1} fill={A} opacity={0.14} />
        <polygon
          points={`${cx - pw * 0.1},${cy - pw * 0.14} ${cx - pw * 0.1},${cy + pw * 0.14} ${cx + pw * 0.15},${cy}`}
          fill={A}
          transform={`scale(${1 + 0.12 * pulse(lb)})`}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        <rect x={px + pw * 0.16} y={py + ph * 0.82} width={pw * 0.68} height={6} rx={3} fill={fg} opacity={0.25} />
        <rect x={px + pw * 0.16} y={py + ph * 0.82} width={pw * 0.68 * play} height={6} rx={3} fill={A} />
        {Array.from({ length: 4 }, (_, k) => {
          const p = eoExpo(seg(lb, 0.5 + k * 0.5, 0.5));
          return <rect key={k} x={cx + pw * 0.75} y={cy + ph * 0.42 - (k + 1) * pw * 0.3 + (1 - p) * 60} width={pw * 0.32} height={pw * 0.24} rx={6} fill={A} opacity={p} />;
        })}
        <rect x={cx - pw * 1.07} y={cy + ph * 0.42 - pw * 0.3} width={pw * 0.32} height={pw * 0.24} rx={6} fill={fg} opacity={0.3 * enter} />
      </g>
    );
  }

  // two bars: today's pre-arrival revenue, and five times it; the summit rides the tall one
  const bw = G * 0.26;
  const base = cy + G * 0.42;
  const unit = G * 0.15;
  const ease = Easing.bezier(...sec.ease.bez);
  const h1 = unit * ease(seg(lb, 0.2, 0.8));
  const h5 = unit * 5 * ease(seg(lb, 0.5, 1.6));
  const x1 = cx - bw * 1.3;
  const x5 = cx + bw * 0.3;
  return (
    <g>
      <rect x={x1} y={base - h1} width={bw} height={h1} fill={fg} opacity={0.3} />
      <rect x={x5} y={base - h5} width={bw} height={h5} fill={A} />
      <polygon points={`${x5 + bw / 2},${base - h5 - bw * 0.62} ${x5},${base - h5 - 6} ${x5 + bw},${base - h5 - 6}`} fill={fg} opacity={clamp(h5 / unit - 0.5)} />
      <line x1={cx - G * 0.5} x2={cx + G * 0.5} y1={base} y2={base} stroke={fg} strokeWidth={4} />
      {[1, 2, 3, 4, 5].map((k) => (
        <line key={k} x1={cx - G * 0.5} x2={cx + G * 0.5} y1={base - unit * k} y2={base - unit * k} stroke={fg} strokeOpacity={0.12} strokeWidth={2} strokeDasharray="4 8" />
      ))}
    </g>
  );
};

/* ---------------------------------------------------------------- end card */

const EndCard = ({ lb, W, H, v, wide }: { lb: number; W: number; H: number; v: number; wide: boolean }) => {
  const size = 230 * v;
  const cx = W / 2;
  const cy = H / 2 - (wide ? 110 : 200) * v;
  const from = [
    [-700, -300, -160],
    [700, 260, 200],
    [0, 600, 90],
  ];
  const lk = eo3(seg(lb, 1.9, 0.8));
  const line = eo3(seg(lb, 2.6, 0.8));
  const url = eo3(seg(lb, 3.2, 0.8));
  const out = eio3(seg(lb, 7.4, 0.6));

  return (
    <AbsoluteFill style={{ background: COL.ink, color: COL.white, opacity: 1 - out }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {FACES.map((f, i) => {
          const p = eo3(seg(lb, 0.15 + i * 0.18, 1.3));
          const [dx, dy, r] = from[i];
          const pts = f.points
            .split(' ')
            .map((pt) => {
              const [x0, y0] = pt.split(',').map(Number);
              return `${cx + ((x0 - 50) / 100) * size},${cy + ((y0 - 50) / 100) * size}`;
            })
            .join(' ');
          return (
            <polygon
              key={i}
              points={pts}
              fill={COL.blue}
              opacity={f.opacity * clamp(p * 3)}
              transform={p >= 1 ? undefined : `translate(${dx * (1 - p) * v} ${dy * (1 - p) * v}) rotate(${r * (1 - p)} ${cx} ${cy})`}
            />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy + 0.35 * size + (0.82 * size) / 3 + 10 * v, textAlign: 'center' }}>
        <div style={{ fontSize: 104 * v, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1, opacity: lk, transform: `translateY(${(1 - lk) * 30 * v}px)` }}>
          Apex
          <span style={{ fontSize: '.74em', fontWeight: 500, letterSpacing: '.13em', color: COL.blue, marginLeft: '.42em' }}>{END.product.toUpperCase()}</span>
        </div>
        <div style={{ marginTop: 34 * v, fontSize: 44 * v, fontWeight: 600, letterSpacing: '-.015em', opacity: line, transform: `translateY(${(1 - line) * 24 * v}px)`, padding: '0 40px' }}>
          {END.line}
        </div>
        <div style={{ marginTop: 26 * v, fontSize: 26 * v, fontWeight: 600, letterSpacing: '.08em', color: COL.yellow, opacity: url }}>{END.url}</div>
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- HUD */

const Hud = ({ b, idx, lb, color, W, H, v, sec }: { b: number; idx: number; lb: number; color: string; W: number; H: number; v: number; sec: Section | null | undefined }) => {
  const t = (b * 60) / BPM;
  const fr = Math.floor(t * 60);
  const tc = `00:00:${String(Math.floor(fr / 60)).padStart(2, '0')}:${String(fr % 60).padStart(2, '0')}`;
  const pad = 46 * v;
  const fs = 19 * v;
  const base = { position: 'absolute' as const, fontSize: fs, fontWeight: 600, letterSpacing: '.12em', color, fontVariantNumeric: 'tabular-nums' as const };
  const n = Math.min(7, idx + 1);
  const label = idx < 6 ? SECTIONS[idx].label : 'APEX WELCOME';
  const labelIn = eo3(seg(lb, 0, 0.35));

  // the current section's easing curve, drawn, with a dot riding it
  const ez = sec ? sec.ease : { name: 'apex', bez: [0.2, 0.7, 0.2, 1] as [number, number, number, number] };
  const bw = 120 * v;
  const [x1, y1, x2, y2] = ez.bez;
  const prog = seg(lb, 0.2, 1.6);
  const ep = Easing.bezier(...ez.bez)(prog);
  const path = `M0,${bw} C${x1 * bw},${bw - y1 * bw} ${x2 * bw},${bw - y2 * bw} ${bw},0`;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {[
          [pad, pad, 1, 1],
          [W - pad, pad, -1, 1],
          [pad, H - pad, 1, -1],
          [W - pad, H - pad, -1, -1],
        ].map(([x, y, sx, sy], k) => (
          <path key={k} d={`M${x},${y + sy * 26 * v} L${x},${y} L${x + sx * 26 * v},${y}`} stroke={color} strokeOpacity={0.6} strokeWidth={2} fill="none" />
        ))}
      </svg>
      <div style={{ ...base, top: pad + 18 * v, left: pad + 18 * v }}>{tc}</div>
      <div style={{ ...base, top: pad + 18 * v, right: pad + 18 * v, display: 'flex', alignItems: 'center', gap: 14 * v }}>
        <span>60 FPS</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{BPM} BPM</span>
        <span style={{ display: 'flex', gap: 5 * v }}>
          {[0, 1, 2, 3].map((k) => (
            <span key={k} style={{ width: 9 * v, height: 9 * v, borderRadius: 5 * v, background: color, opacity: Math.floor(b) % 4 === k ? 1 : 0.22 }} />
          ))}
        </span>
      </div>
      <div style={{ ...base, bottom: pad + 18 * v, left: pad + 18 * v, display: 'flex', gap: 18 * v, opacity: labelIn, transform: `translateX(${(1 - labelIn) * -20 * v}px)` }}>
        <span style={{ opacity: 0.55 }}>0{n} / 07</span>
        <span>{label}</span>
      </div>
      <svg width={bw + 4} height={bw + 4} style={{ position: 'absolute', right: pad + 18 * v, bottom: pad + 44 * v, overflow: 'visible' }}>
        <rect x={0} y={0} width={bw} height={bw} fill="none" stroke={color} strokeOpacity={0.18} />
        <path d={path} stroke={color} strokeWidth={2} fill="none" strokeOpacity={0.85} />
        <circle cx={prog * bw} cy={bw - ep * bw} r={5 * v} fill={sec ? sec.accent : COL.blue} stroke={color} strokeWidth={1.5} />
      </svg>
      <div style={{ ...base, bottom: pad + 18 * v, right: pad + 18 * v, fontSize: fs * 0.85, opacity: 0.75 }}>{ez.name.toUpperCase()}</div>
    </AbsoluteFill>
  );
};
