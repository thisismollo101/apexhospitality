import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FACES } from '../brand';

/*
 * The tetrahedron assembling into its rest pose. Each face flies in from its
 * own side and settles on a spring; the last frame is the drawn artwork
 * exactly — same points, same .45 / 1 / .22 — so nothing shifts once it lands.
 */
const FROM = [
  { x: -38, y: -10, r: -14 },
  { x: 38, y: -10, r: 14 },
  { x: 0, y: 34, r: 0 },
];

export const Mark = ({ size, delay = 0, ink = C.blue }: { size: number; delay?: number; ink?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible' }}>
      {FACES.map((f, i) => {
        const s = spring({ frame: frame - delay - i * 4, fps, config: { damping: 16, mass: 0.7 } });
        const o = FROM[i];
        const t = `translate(${interpolate(s, [0, 1], [o.x, 0])} ${interpolate(s, [0, 1], [o.y, 0])}) rotate(${interpolate(s, [0, 1], [o.r, 0])} 50 50)`;
        return (
          <polygon
            key={i}
            points={f.points}
            fill={ink}
            opacity={f.opacity * Math.min(1, s * 1.6)}
            transform={t}
          />
        );
      })}
    </svg>
  );
};

/** The flat mark, for a corner bug. */
export const FlatMark = ({ size, ink = C.white }: { size: number; ink?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {FACES.map((f, i) => (
      <polygon key={i} points={f.points} fill={ink} opacity={f.opacity} />
    ))}
  </svg>
);
