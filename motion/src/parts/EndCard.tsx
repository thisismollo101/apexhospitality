import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, INTER } from '../brand';
import { Lockup } from './Lockup';
import { Mark } from './Mark';
import { prog } from './anim';

/*
 * End card on ink: the mark assembles, the lockup rises in beside it, then a
 * product line and URL. Local frame 0 is the start of the card.
 */
export const EndCard = ({ line, url = 'apexhospitality.online' }: { line: string; url?: string }) => {
  const frame = useCurrentFrame();
  const lk = prog(frame, 18, 22);
  const sub = prog(frame, 34, 20);
  const glow = prog(frame, 0, 60);

  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${C.blue}33 0%, transparent ${20 + glow * 25}%)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
        <Mark size={170} delay={2} />
        <div style={{ overflow: 'hidden', padding: '8px 0' }}>
          <div style={{ transform: `translateY(${(1 - lk) * 100}%)`, opacity: lk }}>
            <Lockup size={96} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '64%', textAlign: 'center', opacity: sub, transform: `translateY(${(1 - sub) * 16}px)` }}>
        <div style={{ fontFamily: INTER, fontSize: 30, fontWeight: 500, color: C.muted, letterSpacing: '.02em' }}>{line}</div>
        <div style={{ fontFamily: INTER, fontSize: 24, fontWeight: 600, color: C.blue, marginTop: 18, letterSpacing: '.06em' }}>{url}</div>
      </div>
    </AbsoluteFill>
  );
};
