import { SOURCES } from '../data-more';

/*
 * Sources · the live page's seventeen claims with their sources, vendor data
 * flagged, and its closing line. A sets them as a results table, B as closing
 * credits, C as a glass list.
 */

const S = SOURCES;

export function SourcesA() {
  return (
    <div className="ha ha--pad">
      <h2 className="f1-h2 f1-h2--src">{S.heading}</h2>
      <ol className="f1-card f1-card--src">
        {S.list.map((s, i) => (
          <li key={s.claim} className="f1-row">
            <b className="f1-row__fig f1-row__fig--pos">{i + 1}</b>
            <span className="f1-row__body">
              <b className="f1-row__claim">{s.claim}</b>
              <span>
                {s.src}
                {s.vendor && <i className="f1-chip">{S.vendor}</i>}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="f1-brand">
        <span>
          <b>Apex</b> Hospitality
        </span>
        <span>{S.brand}</span>
      </p>
    </div>
  );
}

export function SourcesB() {
  return (
    <div className="hb hb--pad nf-credits">
      <h2 className="nf-credits__h">{S.heading}</h2>
      <ol>
        {S.list.map((s) => (
          <li key={s.claim}>
            <b>{s.claim}</b>
            <span>
              {s.src}
              {s.vendor && <i> {S.vendor}</i>}
            </span>
          </li>
        ))}
      </ol>
      <p className="nf-credits__brand">
        <b>Apex</b> Hospitality
        <span>{S.brand}</span>
      </p>
    </div>
  );
}

export function SourcesC() {
  return (
    <div className="gl">
      <header className="gl-acct gl-acct--tight">
        <h2 className="gl-acct__bal">{S.heading}</h2>
      </header>
      <ol className="gl-list glass gl-src">
        {S.list.map((s, i) => (
          <li key={s.claim} className="gl-item">
            <span className="gl-item__ico gl-item__ico--n">{i + 1}</span>
            <span className="gl-item__txt">
              <b>{s.claim}</b>
              <span>
                {s.src}
                {s.vendor && <i className="gl-chip">{S.vendor}</i>}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="gl-along gl-along--src">
        <b>Apex Hospitality</b>
        <span>{S.brand}</span>
      </p>
    </div>
  );
}
