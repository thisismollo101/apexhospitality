import { FALLACY, FALLACY_ANCHOR, LIFECYCLE } from './data';

/** Components 19 and 20, each its own section. */

/** Component 19 — the three lifecycle boundaries. */
export function LifecycleScope() {
  return (
    <ol className="wlife">
      {LIFECYCLE.map((p) => (
        <li key={p.phase} className={p.active ? 'is-active' : undefined}>
          <span className="wlife-phase">{p.phase}</span>
          <h3>{p.product}</h3>
          <ul>
            <li>{p.body}</li>
          </ul>
        </li>
      ))}
    </ol>
  );
}

/**
 * Component 20 — the in-house fallacy bento.
 *
 * Each widget carries its own total so the anchor line is checkable rather
 * than asserted: 1,085 + 280 + 145 + 490 is the two million it claims.
 */
export function InHouseFallacy() {
  return (
    <>
      <div className="axbento">
        {FALLACY.map((w) => (
          <article className={`axbw${w.wide ? ' is-wide' : ''}`} key={w.key}>
            <div className="axbw-top">
              <div>
                <h3>{w.title}</h3>
                <span className="axbw-sub">{w.sub}</span>
              </div>
              <span className="axbw-total">{w.total}</span>
            </div>
            <ul>
              {w.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="axcall">
        <span className="axcall-tag">[ $2,000,000 a year, fixed ]</span>
        <p>{FALLACY_ANCHOR}</p>
      </div>
    </>
  );
}
