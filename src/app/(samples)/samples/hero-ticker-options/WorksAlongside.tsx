/**
 * "Works alongside" bar — Option B, number-led (Motion Brief 04, round 2).
 * Replaces the integrations strip at the foot of the Welcome hero.
 *
 * Each third leads with its big figure; the logo sits over the caption beside
 * it. The line runs along a footer row. Behind each third its own faded figure
 * rises in a column, forever.
 *
 * Copied verbatim from the live Welcome page (welcome/WorksAlongside.tsx), not
 * imported, per CLAUDE.md. Its CSS is copied into this route's style.css under
 * .hto .wabb (on the live page, official.css under .w3page .wabb); logos live in
 * /public/media/partners/. A full-bleed banner, square at every corner.
 * Pure CSS motion, so this stays a server component:
 *  - the faded figures rise continuously (each column at its own speed);
 *  - each figure spins one full turn and lands back on its real value every 8s;
 *  - figures, logos and captions settle in once on load.
 * prefers-reduced-motion: still, real values.
 */
import type { CSSProperties } from 'react';

type System = { key: string; name: string; logo: string; w: number; h: number; figure: string; caption: string };

// Figures and captions as published by each vendor — do not change.
const SYSTEMS: System[] = [
  { key: 'oracle', name: 'Oracle', logo: '/media/partners/oracle.svg', w: 76, h: 16, figure: '236', caption: 'countries & territories live' },
  { key: 'aven', name: 'Aven Hospitality', logo: '/media/partners/aven.png', w: 58, h: 25, figure: '35,000+', caption: "hotels use Aven's solutions" },
  { key: 'agilysys', name: 'Agilysys', logo: '/media/partners/agilysys.svg', w: 46, h: 26, figure: '4,000+', caption: 'properties worldwide' },
];

/** One rolling figure: each digit is a strip 0–9 ×3 resting on its middle copy. */
function Figure({ value, index }: { value: string; index: number }) {
  let d = 0;
  return (
    <span className="wabb-fig" aria-hidden="true">
      {value.split('').map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} className={ch === '+' ? 'wabb-plus' : undefined}>
              {ch}
            </span>
          );
        }
        const style = { '--d': Number(ch), '--k': d++, '--g': index } as CSSProperties;
        return (
          <span key={i} className="wabb-digit" style={style}>
            <span className="wabb-strip">
              {Array.from({ length: 30 }, (_, n) => (
                <span key={n}>{n % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function WorksAlongside() {
  return (
    <section className="wabb" aria-label="Works alongside the systems your hotel already runs">
      <ul className="wabb-row">
        {SYSTEMS.map((s, i) => (
          <li key={s.key} className="wabb-sys" style={{ '--g': i } as CSSProperties}>
            {/* the faded figure rising behind this third */}
            <span className="wabb-rise" aria-hidden="true">
              <span className="wabb-rise-run">
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <span key={k}>{s.figure}</span>
                ))}
              </span>
            </span>
            <span className="wabb-num">
              <span className="wabb-sr">{s.figure}</span>
              <Figure value={s.figure} index={i} />
            </span>
            <span className="wabb-id">
              {/* eslint-disable-next-line @next/next/no-img-element -- official vendor logo files at fixed size */}
              <img
                className="wabb-logo"
                src={s.logo}
                alt={s.name}
                width={s.w}
                height={s.h}
                style={{ '--lh': `${s.h}px` } as CSSProperties}
              />
              <span className="wabb-cap">{s.caption}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="wabb-line">
        <span className="wabb-pair">
          <strong className="wabb-caps">Works alongside</strong>
          <i className="wabb-dot" aria-hidden="true" />
        </span>
        <span className="wabb-sentence">Built to work alongside the systems your hotel already runs.</span>
        <span className="wabb-pair">
          <i className="wabb-dot" aria-hidden="true" />
          <strong className="wabb-caps">Zero operational drag.</strong>
        </span>
      </p>
    </section>
  );
}
