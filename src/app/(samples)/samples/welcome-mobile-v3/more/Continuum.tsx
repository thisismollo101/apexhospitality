import type { CSSProperties } from 'react';
import { CONTINUUM } from '../data-more';
import { PlayIcon, Player } from '../parts';

/*
 * The Apex Continuum · three chapters, each in its live colour, then the close:
 * the film, the line, the three plans and the setup fee, and Contact sales.
 * Contact sales leaves (samples) for the real site, so it is a plain <a>.
 */

const K = CONTINUUM;
const col = (c: string) => ({ '--c': c }) as CSSProperties;

/* ---- A · Grid: championship standings in team colours, then a dark close ---- */

export function ContinuumA() {
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{K.eye}</span>
        <h2 className="f1-h2">{K.headline}</h2>
      </header>
      <ol className="f1-card f1-card--teams">
        {K.chapters.map((c) => (
          <li key={c.n} className="f1-row" style={col(c.c)}>
            <b className="f1-row__fig">{c.n}</b>
            <span className="f1-row__body">
              <i className="f1-row__k">{c.when}</i>
              <b>{c.h}</b>
              <span>{c.p}</span>
            </span>
          </li>
        ))}
      </ol>
      <section className="ha-band ha-band--close">
        <Player film={K.film} className="f1-head f1-head--short f1-head--round">
          <span className="f1-head__shade" aria-hidden="true" />
          <span className="f1-head__in">
            <span className="f1-head__row">
              <span className="f1-pill">{K.tag}</span>
              <span className="f1-play" aria-hidden="true">
                <PlayIcon />
              </span>
            </span>
          </span>
        </Player>
        <h3 className="ha-close__h">{K.cta.h}</h3>
        <ul className="ha-plans">
          {K.cta.plans.map(([n, p]) => (
            <li key={n}>
              <b>{n}</b>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="ha-plans__note">
          {K.cta.per} {K.cta.setup}
        </p>
        <a className="ha-cta" href={K.cta.href}>
          {K.cta.button} →
        </a>
      </section>
    </div>
  );
}

/* ---- B · Billboard: the chapters as a row of season posters, the close as a billboard ---- */

export function ContinuumB() {
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{K.eye}</span>
        <h2 className="nf-rowhead__h">{K.headline}</h2>
      </header>
      <ol className="nf-row">
        {K.chapters.map((c) => (
          <li key={c.n} className="nf-season" style={col(c.c)}>
            <span className="nf-season__n">{c.n}</span>
            <span className="nf-poster__lab nf-poster__lab--top">{c.when}</span>
            <b>{c.h}</b>
            <span>{c.p}</span>
          </li>
        ))}
      </ol>
      <Player film={K.film} className="hb-card hb-card--wide hb-card--gap">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot hb-card__foot--left">
          <span className="hb-meta hb-meta--left">{K.tag}</span>
        </span>
        <span className="nf-tile__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>
      <div className="nf-close">
        <b>{K.cta.h}</b>
        <p className="nf-close__plans">
          {K.cta.plans.map(([n, p], i) => (
            <span key={n}>
              {i > 0 && ' · '}
              <b>{n}</b> {p}
            </span>
          ))}{' '}
          {K.cta.per} {K.cta.setup}
        </p>
        <a className="hb-play hb-play--link" href={K.cta.href}>
          {K.cta.button} →
        </a>
      </div>
    </div>
  );
}

/* ---- C · Glass: the chapters as stacked cards, the plans as Revolut plan cards ---- */

export function ContinuumC() {
  return (
    <div className="gl">
      <header className="gl-acct gl-acct--tight">
        <span className="gl-acct__lab">{K.eye}</span>
        <h2 className="gl-acct__bal gl-acct__bal--sm">{K.headline}</h2>
      </header>
      <ol className="gl-stack">
        {K.chapters.map((c) => (
          <li key={c.n} className="glass" style={col(c.c)}>
            <span className="gl-stack__dot">{c.n}</span>
            <div>
              <i>{c.when}</i>
              <b>{c.h}</b>
              <span>{c.p}</span>
            </div>
          </li>
        ))}
      </ol>
      <section className="gl-duo glass" aria-label={K.film.title}>
        <Player film={K.film} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <span className="gl-len">{K.tag}</span>
          <b>{K.cta.h}</b>
        </div>
      </section>
      <ul className="gl-plans">
        {K.cta.plans.map(([n, p]) => (
          <li key={n} className="glass">
            <span>{n}</span>
            <b>{p}</b>
            <small>{K.cta.per}</small>
          </li>
        ))}
      </ul>
      <p className="gl-note">{K.cta.setup}</p>
      <a className="gl-cta" href={K.cta.href}>
        {K.cta.button} →
      </a>
    </div>
  );
}
