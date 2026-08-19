import { CITATIONS, CLOSE, TIERS } from './data';

/**
 * Components 21 and 22 — the three tiers, the restricted-intake CTA, and the
 * citations drawer.
 *
 * The drawer is a <details> so every figure on the page can be traced without
 * JavaScript and stays open for print. A page this dense with statistics that
 * cannot show its sources is the thing it is arguing against.
 */
export default function PriceTiersAndClose() {
  return (
    <>
      <div className="axtiers">
        {TIERS.map((t) => (
          <article className={`axtier${t.featured ? ' is-featured' : ''}`} key={t.name}>
            <span className="axtier-name">{t.name}</span>
            <p className="axtier-price">
              {t.price}
              <em> /mo</em>
            </p>
            <p className="axtier-note">{t.note}</p>
            <ul>
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="wclose">
        <a className="btn btn-solid wclose-cta" href={CLOSE.href}>
          {CLOSE.cta}
        </a>
        <p className="wclose-note">{CLOSE.note}</p>
      </div>

      <details className="wdrawer">
        <summary>
          Third-party verified data — every figure on this page, traced
          <span className="wdrawer-hint">{CITATIONS.length} references</span>
        </summary>
        <dl className="wsources">
          {CITATIONS.map(([name, claim]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{claim}</dd>
            </div>
          ))}
        </dl>
      </details>
    </>
  );
}
