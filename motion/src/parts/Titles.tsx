import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, INTER } from '../brand';
import { inOut, prog } from './anim';

/*
 * Kinetic headline: each line rises out of its own mask, word by word, then
 * the whole block lifts away. Bottom-left, on a soft scrim so it reads over
 * any frame.
 */
export const KineticTitle = ({ lines, from, to, kicker }: { lines: string[]; from: number; to: number; kicker?: string }) => {
  const frame = useCurrentFrame();
  const out = prog(frame, to - 14, 14);
  let w = 0;

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 120px 120px', opacity: 1 - out }}>
      <Scrim opacity={inOut(frame, from, to, 20, 14)} />
      {kicker && (
        <div style={{ position: 'relative', fontFamily: INTER, fontSize: 22, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.blue, marginBottom: 22, opacity: prog(frame, from, 16), transform: `translateY(${(1 - prog(frame, from, 16)) * 16}px)` }}>
          {kicker}
        </div>
      )}
      {lines.map((line, li) => (
        <div key={li} style={{ position: 'relative', overflow: 'hidden', paddingBottom: 6 }}>
          <div style={{ fontFamily: INTER, fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.025em', color: C.white, transform: `translateY(${-out * 40}px)` }}>
            {line.split(' ').map((word, i) => {
              const p = prog(frame, from + 6 + (w++) * 3, 18);
              return (
                <span key={i} style={{ display: 'inline-block', marginRight: '.24em', transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* A bottom gradient so white type holds on bright frames. */
export const Scrim = ({ opacity, side = 'bottom' }: { opacity: number; side?: 'bottom' | 'left' }) => (
  <AbsoluteFill
    style={{
      background:
        side === 'bottom'
          ? 'linear-gradient(to top, rgba(6,8,15,.78) 0%, rgba(6,8,15,.35) 38%, rgba(6,8,15,0) 62%)'
          : 'linear-gradient(to right, rgba(6,8,15,.8) 0%, rgba(6,8,15,.3) 45%, rgba(6,8,15,0) 70%)',
      opacity,
    }}
  />
);

/*
 * Lower third: a blue rule draws across, the kicker and title slide out from
 * behind it, and it all retracts on the way out.
 */
export const LowerThird = ({ kicker, title, sub, from, to }: { kicker: string; title: string; sub?: string; from: number; to: number }) => {
  const frame = useCurrentFrame();
  const rule = Math.min(prog(frame, from, 16), 1 - prog(frame, to - 10, 10));
  const txt = inOut(frame, from + 8, to - 4, 16, 10);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 120px 110px' }}>
      <Scrim opacity={inOut(frame, from, to, 16, 12) * 0.8} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'stretch', gap: 26 }}>
        <div style={{ width: 6, background: C.blue, transform: `scaleY(${rule})`, transformOrigin: 'bottom', borderRadius: 3 }} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ transform: `translateX(${(1 - txt) * -60}px)`, opacity: txt }}>
            <div style={{ fontFamily: INTER, fontSize: 22, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.blue }}>{kicker}</div>
            <div style={{ fontFamily: INTER, fontSize: 58, fontWeight: 700, letterSpacing: '-.02em', color: C.white, marginTop: 8 }}>{title}</div>
            {sub && <div style={{ fontFamily: INTER, fontSize: 26, fontWeight: 400, color: C.muted, marginTop: 10, maxWidth: 900 }}>{sub}</div>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* A centred statement line, letter-spaced in from wide. */
export const Statement = ({ text, from, to }: { text: string; from: number; to: number }) => {
  const frame = useCurrentFrame();
  const o = inOut(frame, from, to, 22, 16);
  const track = interpolate(prog(frame, from, 40), [0, 1], [0.3, -0.02]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: `rgba(6,8,15,${o * 0.35})` }}>
      <div style={{ fontFamily: INTER, fontSize: 64, fontWeight: 700, color: C.white, letterSpacing: `${track}em`, textAlign: 'center', maxWidth: 1400, lineHeight: 1.15, opacity: o, filter: `blur(${(1 - o) * 8}px)` }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
