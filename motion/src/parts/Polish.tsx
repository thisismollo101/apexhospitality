import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from 'remotion';
import { C } from '../brand';
import { FlatMark } from './Mark';
import { prog } from './anim';

/*
 * Branded wipe: an ink panel led by a brand-blue edge sweeps across. `dir`
 * 'in' uncovers the picture (panel leaves), 'out' covers it (panel arrives).
 */
export const Wipe = ({ at, dur = 18, dir }: { at: number; dur?: number; dir: 'in' | 'out' }) => {
  const frame = useCurrentFrame();
  // Only on screen while it moves; before an 'in' / after an 'out' the frame is ink.
  if (dir === 'in' && frame > at + dur) return null;
  if (dir === 'out' && frame < at) return null;
  const p = interpolate(frame, [at, at + dur], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Panel overhangs 40% each side to cover the skew; travel far enough to clear the frame.
  const x = dir === 'in' ? p * 180 : (p - 1) * 180;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%) skewX(-12deg)` }}>
      <AbsoluteFill style={{ background: C.ink, left: '-40%', right: '-40%', width: 'auto' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, [dir === 'in' ? 'left' : 'right']: '-40%', width: 26, marginLeft: dir === 'in' ? -26 : 0, marginRight: dir === 'out' ? -26 : 0, background: C.blue, boxShadow: `0 0 80px 20px ${C.blue}66` }} />
    </AbsoluteFill>
  );
};

/* A soft diagonal light sweep across the picture — a cut accent. */
export const Glint = ({ at, dur = 22 }: { at: number; dur?: number }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '-30%', bottom: '-30%', width: '28%', left: `${-30 + p * 140}%`, transform: 'rotate(14deg)', background: 'linear-gradient(90deg, transparent, rgba(120,170,255,.22), rgba(255,255,255,.18), rgba(120,170,255,.22), transparent)' }} />
    </AbsoluteFill>
  );
};

/* Grade layer: vignette and a whisper of animated grain over the footage. */
export const Grade = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  return (
    <>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(6,8,15,.55) 100%)' }} />
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${Math.floor(random(seed) * 1000)}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }} />
    </>
  );
};

/* Corner bug: flat mark top-right, fades in after the open and out before the end. */
export const Bug = ({ from, to }: { from: number; to: number }) => {
  const frame = useCurrentFrame();
  const o = Math.min(prog(frame, from, 20), 1 - prog(frame, to - 12, 12)) * 0.85;
  return (
    <div style={{ position: 'absolute', top: 64, right: 72, opacity: o }}>
      <FlatMark size={56} />
    </div>
  );
};
