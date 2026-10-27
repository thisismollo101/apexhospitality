/**
 * "Works alongside" bar — Option B, number-led (Motion Brief 04, round 2).
 * Replaces the integrations strip at the foot of the Welcome hero.
 *
 * Each third leads with its big figure; the logo sits over the caption beside
 * it. The line runs along a footer row. Behind each third its own faded figure
 * rises in a column, forever.
 *
 * Its CSS is folded into official.css under .w3page .wabb.
 *
 * 27 Oct 2026: the Oracle / Aven / Agilysys logos and their figures came out.
 * Apex has no integration or partnership with any PMS vendor, and the logos
 * implied one. Each third now carries an Apex fact, with a word where the logo
 * sat, and the line states the PMS position plainly. A full-bleed banner, square at every corner.
 * Pure CSS motion, so this stays a server component:
 *  - the faded figures rise continuously (each column at its own speed);
 *  - each figure spins one full turn and lands back on its real value every 8s;
 *  - figures, logos and captions settle in once on load.
 * prefers-reduced-motion: still, real values.
 */
import type { CSSProperties } from 'react';

type System = { key: string; name: string; figure: string; caption: string };

// Apex's own facts — product facts, not market statistics.
const SYSTEMS: System[] = [
  { key: 'pms', name: 'Your PMS', figure: '0', caption: 'integrations to build' },
  { key: 'export', name: 'Arrivals export', figure: '1', caption: 'daily file, or your booking emails' },
  { key: 'apex365', name: 'Apex 365', figure: '365', caption: 'days a year, one system' },
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
    <section className="wabb" aria-label="Works alongside your PMS">
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
              <span className="wabb-word">{s.name}</span>
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
        <span className="wabb-sentence">
          Works alongside your PMS. No integration needed — we work from a daily arrivals export or your booking emails.
        </span>
        <span className="wabb-pair">
          <i className="wabb-dot" aria-hidden="true" />
          <strong className="wabb-caps">Nothing to install.</strong>
        </span>
      </p>
    </section>
  );
}
