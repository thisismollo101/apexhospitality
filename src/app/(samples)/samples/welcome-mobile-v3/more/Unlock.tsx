import { UNLOCK } from '../data-more';
import { Ast, PlayIcon, Player } from '../parts';

/*
 * Unlock access · four steps from the film to the enquiry, the planned GM
 * dashboard (empty bars: nothing is tracked yet), the film, and the Nielsen
 * figure.
 */

const U = UNLOCK;

/** The planned GM dashboard: its columns and three rows of empty bars, as on the live page. */
function Dash({ cls }: { cls: string }) {
  return (
    <div className={`dash ${cls}`}>
      <div className="dash__bar">
        <i />
        <i />
        <i />
        <b>{U.dash.title}</b>
        <span>{U.dash.tag}</span>
      </div>
      <table>
        <thead>
          <tr>
            {U.dash.cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((r) => (
            <tr key={r}>
              {U.dash.cols.map((c) => (
                <td key={c}>
                  <i />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="dash__foot">{U.dash.foot}</p>
    </div>
  );
}

/* ---- A · Grid --------------------------------------------------------------- */

export function UnlockA() {
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{U.eye}</span>
        <h2 className="f1-h2">{U.headline}</h2>
      </header>
      <ol className="f1-card f1-card--steps">
        {U.steps.map((s) => (
          <li key={s.n} className="f1-row">
            <b className="f1-row__fig">{s.n}</b>
            <span className="f1-row__body">
              <b>{s.h}</b>
              <span>{s.p}</span>
              {s.q && <q className="f1-q">{s.q}</q>}
            </span>
          </li>
        ))}
      </ol>
      <Dash cls="dash--f1" />
      <Player film={U.film} className="f1-head f1-head--short f1-head--gap">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__kick f1-head__kick--line">{U.film.line}</span>
          <span className="f1-head__row">
            <span className="f1-pill">Watch · {U.film.len}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>
      <p className="f1-stat">
        <b>
          <Ast t={U.stat.fig} />
        </b>
        <span>{U.stat.text}</span>
      </p>
    </div>
  );
}

/* ---- B · Billboard: the steps as a swiped row of numbered posters ------------- */

export function UnlockB() {
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{U.eye}</span>
        <h2 className="nf-rowhead__h">{U.headline}</h2>
      </header>
      <ol className="nf-row">
        {U.steps.map((s) => (
          <li key={s.n} className="nf-step">
            <span className="nf-step__n" aria-hidden="true">
              {s.n}
            </span>
            <b>{s.h}</b>
            <span>{s.p}</span>
            {s.q && <q>{s.q}</q>}
          </li>
        ))}
      </ol>
      <Player film={U.film} className="hb-card hb-card--wide hb-card--gap">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot hb-card__foot--left">
          <span className="hb-meta hb-meta--left">
            <span className="hb-len">{U.film.len}</span>
            {U.film.line}
          </span>
        </span>
        <span className="nf-tile__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>
      <Dash cls="dash--nf" />
      <p className="nf-badge2">
        <b>
          <Ast t={U.stat.fig} />
        </b>
        <span>{U.stat.text}</span>
      </p>
    </div>
  );
}

/* ---- C · Glass: a vertical timeline, the quote as a chat bubble -------------- */

export function UnlockC() {
  return (
    <div className="gl">
      <header className="gl-acct gl-acct--tight">
        <span className="gl-acct__lab">{U.eye}</span>
        <h2 className="gl-acct__bal">{U.headline}</h2>
      </header>
      <ol className="gl-time">
        {U.steps.map((s) => (
          <li key={s.n}>
            <span className="gl-time__n">{s.n}</span>
            <div className="gl-time__txt">
              <b>{s.h}</b>
              <span>{s.p}</span>
              {s.q && <q className="gl-bubble">{s.q}</q>}
            </div>
          </li>
        ))}
      </ol>
      <section className="gl-duo glass" aria-label={U.film.title}>
        <Player film={U.film} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <span className="gl-len">Watch · {U.film.len}</span>
          <b className="gl-duo__line">{U.film.line}</b>
        </div>
      </section>
      <Dash cls="dash--glass glass" />
      <p className="gl-stat glass">
        <b>
          <Ast t={U.stat.fig} />
        </b>
        <span>{U.stat.text}</span>
      </p>
    </div>
  );
}
