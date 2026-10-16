import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, INTER } from '../brand';
import { inOut, prog } from './anim';
import { Scrim } from './Titles';

/*
 * A big counting figure with a label and a source line. `value` counts from 0;
 * `range` shows "lo–hi" with the second number counting up after the first.
 * Unverified figures keep their asterisk, as on the page.
 */
export const StatCallout = ({ lo, hi, unit = '%', label, source, from, to, align = 'left', star = true, kicker }: {
  lo: number; hi?: number; unit?: string; label: string; source?: string; from: number; to: number; align?: 'left' | 'right'; star?: boolean; kicker?: string;
}) => {
  const frame = useCurrentFrame();
  const o = inOut(frame, from, to, 14, 12);
  const a = Math.round(interpolate(prog(frame, from + 4, 30), [0, 1], [0, lo]));
  const b = hi === undefined ? null : Math.round(interpolate(prog(frame, from + 14, 30), [0, 1], [lo, hi]));
  const ring = prog(frame, from, 36);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: align === 'left' ? 'flex-start' : 'flex-end', padding: '0 130px' }}>
      <Scrim side="left" opacity={o * (align === 'left' ? 1 : 0)} />
      {align === 'right' && <AbsoluteFill style={{ background: 'linear-gradient(to left, rgba(6,8,15,.8), rgba(6,8,15,0) 70%)', opacity: o }} />}
      <div style={{ position: 'relative', opacity: o, transform: `translateY(${(1 - o) * 24}px)`, maxWidth: 720, textAlign: align }}>
        {kicker && <div style={{ fontFamily: INTER, fontSize: 22, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.blue, marginBottom: 18 }}>{kicker}</div>}
        <div style={{ height: 4, width: 120, background: C.blue, transform: `scaleX(${ring})`, transformOrigin: align, marginLeft: align === 'right' ? 'auto' : 0, marginBottom: 28, borderRadius: 2 }} />
        <div style={{ fontFamily: INTER, fontSize: 168, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 0.92, color: C.white, fontVariantNumeric: 'tabular-nums' }}>
          {a}{b !== null && <>–{b}</>}<span style={{ color: C.blue }}>{unit}</span>{star && <span style={{ fontSize: '.4em', verticalAlign: 'top', color: C.muted }}>*</span>}
        </div>
        <div style={{ fontFamily: INTER, fontSize: 36, fontWeight: 500, color: C.white, marginTop: 20, lineHeight: 1.25 }}>{label}</div>
        {source && <div style={{ fontFamily: INTER, fontSize: 18, color: C.muted, marginTop: 18 }}>* {source}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* Two bars racing: the old way against ours. */
export const Compare = ({ title, rows, source, from, to }: {
  title: string; rows: { label: string; value: string; pct: number; hot?: boolean }[]; source?: string; from: number; to: number;
}) => {
  const frame = useCurrentFrame();
  const o = inOut(frame, from, to, 14, 12);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 130px' }}>
      <Scrim side="left" opacity={o} />
      <div style={{ position: 'relative', opacity: o, width: 860 }}>
        <div style={{ fontFamily: INTER, fontSize: 46, fontWeight: 700, color: C.white, letterSpacing: '-.02em', marginBottom: 40 }}>{title}</div>
        {rows.map((r, i) => {
          const p = prog(frame, from + 10 + i * 10, 34);
          return (
            <div key={i} style={{ marginBottom: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: INTER, fontSize: 26, fontWeight: 500, color: r.hot ? C.white : C.muted, marginBottom: 10 }}>
                <span>{r.label}</span>
                <span style={{ fontWeight: 800, fontSize: 34, color: r.hot ? C.blue : C.white, opacity: p }}>{r.value}</span>
              </div>
              <div style={{ height: 16, background: 'rgba(255,255,255,.14)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct * p}%`, background: r.hot ? C.blue : 'rgba(255,255,255,.55)', borderRadius: 8 }} />
              </div>
            </div>
          );
        })}
        {source && <div style={{ fontFamily: INTER, fontSize: 18, color: C.muted, marginTop: 8 }}>* {source}</div>}
      </div>
    </AbsoluteFill>
  );
};
