import { OBJECTIONS, SOURCES } from './data';

/**
 * Section 7 — the source drawer and the departmental objections.
 *
 * Both are <details>, so they open with no JavaScript and stay open for
 * in-page search and print. This block exists to answer a room of three
 * skeptics — operations, finance, marketing — and each of them should be able
 * to find their own paragraph without reading the other two.
 */
export default function Objections() {
  return (
    <>
      <details className="wdrawer">
        <summary>
          Source verification — every figure on this page, traced
          <span className="wdrawer-hint">{SOURCES.length} references</span>
        </summary>
        <dl className="wsources">
          {SOURCES.map(([name, claim]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{claim}</dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="wobjs">
        {OBJECTIONS.map((o) => (
          <details className="wobj" key={o.who}>
            <summary>
              <span className="wobj-who">{o.who}</span>
              <span className="wobj-q">“{o.objection}”</span>
            </summary>
            <p>{o.resolution}</p>
          </details>
        ))}
      </div>
    </>
  );
}
