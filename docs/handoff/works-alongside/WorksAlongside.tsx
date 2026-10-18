/**
 * "Works alongside" bar — the approved design (Motion Brief 04, round 2, Option A:
 * centred ticker). Replaces the integration banner between the bottom of the
 * Welcome hero and the top of the Potential section.
 *
 * Drop-in: copy this file and works-alongside.css next to the Welcome page,
 * then fold the CSS into that route's one stylesheet (see CLAUDE.md rule 2 —
 * never a sibling `import './x.css'`). Logos live in /public/media/partners/.
 *
 * Pure CSS motion, so this stays a server component:
 *  - the faded figures behind scroll left forever (a seamless two-copy ticker);
 *  - each figure spins one full turn and lands back on its own value, every 8s,
 *    staggered across the three systems — it always rests on the real number;
 *  - the line, logos and captions fade in once on load.
 * prefers-reduced-motion: everything is still, figures shown as plain text.
 */
import type { CSSProperties } from 'react';

type System = { key: string; name: string; logo: string; w: number; h: number; figure: string; caption: string };

// Figures and captions as published by each vendor — do not change.
const SYSTEMS: System[] = [
  { key: 'oracle', name: 'Oracle', logo: '/media/partners/oracle.svg', w: 92, h: 19, figure: '236', caption: 'countries & territories live' },
  { key: 'aven', name: 'Aven Hospitality', logo: '/media/partners/aven.png', w: 68, h: 29, figure: '35,000+', caption: "hotels use Aven's solutions" },
  { key: 'agilysys', name: 'Agilysys', logo: '/media/partners/agilysys.svg', w: 54, h: 30, figure: '4,000+', caption: 'properties worldwide' },
];

/** One rolling figure. Each digit is a strip 0–9 ×3 resting on its middle copy. */
function Figure({ value, index }: { value: string; index: number }) {
  let d = 0;
  return (
    <span className="wab-fig" aria-hidden="true">
      {value.split('').map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} className={ch === '+' ? 'wab-plus' : 'wab-sep'}>
              {ch}
            </span>
          );
        }
        const style = { '--d': Number(ch), '--k': d++, '--g': index } as CSSProperties;
        return (
          <span key={i} className="wab-digit" style={style}>
            <span className="wab-strip">
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
  const ticker = [...SYSTEMS, ...SYSTEMS];
  return (
    <section className="wab" aria-label="Works alongside the systems your hotel already runs">
      {/* faded figures, scrolling left forever: two identical halves so the loop is seamless */}
      <div className="wab-ticker" aria-hidden="true">
        <div className="wab-ticker-run">
          {[...ticker, ...ticker].map((s, i) => (
            <span key={i}>{s.figure}</span>
          ))}
        </div>
      </div>

      <p className="wab-line">
        <span className="wab-pair">
          <strong className="wab-caps">Works alongside</strong>
          <i className="wab-dot" aria-hidden="true" />
        </span>
        <span className="wab-sentence">Built to work alongside the systems your hotel already runs.</span>
        <span className="wab-pair">
          <i className="wab-dot" aria-hidden="true" />
          <strong className="wab-caps">Zero operational drag.</strong>
        </span>
      </p>

      <ul className="wab-row">
        {SYSTEMS.map((s, i) => (
          <li key={s.key} className="wab-sys" style={{ '--g': i } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element -- official vendor logo files at fixed size */}
            <img className="wab-logo" src={s.logo} alt={s.name} width={s.w} height={s.h} />
            <span className="wab-rule" aria-hidden="true" />
            <span className="wab-num">
              <span className="wab-sr">{s.figure}</span>
              <Figure value={s.figure} index={i} />
            </span>
            <span className="wab-cap">{s.caption}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
