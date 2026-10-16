import { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource-variable/inter/wght-italic.css';
import { INTER } from '../brand';
import { HEADLINE, LOOP, draw, textState, type Layout } from '../../../src/components/motion-hero/engine';

/*
 * Render wrapper for the homepage motion hero. The engine is the one the site
 * will run live (src/components/motion-hero/engine.ts); here it is only
 * sampled at frame / fps so the loop can be reviewed as a video first.
 */
export const MOTION_HERO_FPS = 60;
export const MOTION_HERO_FRAMES = Math.round(LOOP * MOTION_HERO_FPS);

const layoutFor = (W: number, H: number): Layout => {
  const inset = Math.round(Math.min(W, H) * 0.045);
  const hudBottom = 70;
  const regionH = H - inset - hudBottom - inset;
  return { W, H, cx: W / 2, cy: inset + regionH / 2 + 10, u: Math.min(W * 0.86, regionH * 0.92) / 1000, hudTop: inset, inset };
};

export const MotionHero = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const L = layoutFor(W, H);
  const t = frame / fps;

  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) draw(ctx, t, L);
  });

  const s = textState(t, L);
  const hud = { fontFamily: INTER, fontSize: Math.round(L.inset * 0.42), fontWeight: 500, letterSpacing: '.08em', color: 'rgba(255,255,255,.72)', fontVariantNumeric: 'tabular-nums' as const };
  const lockSize = 88 * L.u;

  return (
    <AbsoluteFill style={{ background: '#06080F' }}>
      <canvas ref={canvas} width={W} height={H} style={{ position: 'absolute', inset: 0 }} />

      {/* HUD */}
      <div style={{ ...hud, position: 'absolute', top: L.hudTop + 14, left: L.inset + 16 }}>{s.timecode}</div>
      <div style={{ ...hud, position: 'absolute', top: L.hudTop + 14, right: L.inset + 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: '#FF6A1F', opacity: s.fpsBlink }} />60 FPS
      </div>
      <div style={{ position: 'absolute', left: L.inset + 16, bottom: L.inset + 34, fontFamily: INTER, fontSize: Math.round(L.inset * 0.62), fontWeight: 700, letterSpacing: '.06em', color: '#fff', opacity: s.labelAlpha, transform: `translateY(${s.labelShift}px)` }}>
        {s.label}
      </div>

      {/* end card: lockup and headline */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: s.lockup.y, textAlign: 'center', opacity: s.lockup.alpha, transform: `translateY(${s.lockup.shift}px)`, fontFamily: INTER, fontSize: lockSize, color: '#fff', letterSpacing: '-.02em', lineHeight: 1 }}>
        <span style={{ fontWeight: 600 }}>Apex</span>{' '}
        <span style={{ fontWeight: 400, fontStyle: 'italic', opacity: 0.62 }}>Hospitality</span>
      </div>
      <div style={{ position: 'absolute', left: 40, right: 40, top: s.headline.y, textAlign: 'center', fontFamily: INTER, fontSize: 58 * L.u, fontWeight: 600, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.15 }}>
        {HEADLINE.map((w, i) => (
          <span key={i} style={{ display: 'inline-block', marginRight: '.26em', opacity: s.headline.alpha[i], transform: `translateY(${s.headline.shift[i]}px)` }}>{w}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
