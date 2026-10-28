'use client';

import { useState } from 'react';
import { SUB } from '../data-more';
import { Ast, Chevron, PlayIcon, Player } from '../parts';

/*
 * Built on subtraction · the film, "the whole commitment", and four cards
 * whose backs list what is taken off the team. The live cards flip; here A and
 * C open in place and B flips.
 */

const Items = ({ items, className }: { items: [string, string][]; className: string }) => (
  <ul className={className}>
    {items.map(([b, t]) => (
      <li key={b}>
        <b>
          <Ast t={b} />
        </b>{' '}
        {t}
      </li>
    ))}
  </ul>
);

/* ---- A · Grid --------------------------------------------------------------- */

export function SubA() {
  const [open, setOpen] = useState(0);
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{SUB.eye}</span>
        <h2 className="f1-h2">{SUB.headline}</h2>
      </header>
      <Player film={SUB.film} className="f1-head f1-head--short f1-head--gap">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__kick f1-head__kick--line">{SUB.film.line}</span>
          <span className="f1-head__row">
            <span className="f1-pill">Watch · {SUB.film.len}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <div className="f1-call">
        <span>{SUB.call.kick}</span>
        <b>
          {SUB.call.big.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </b>
        <p>{SUB.call.text}</p>
      </div>

      <ol className="f1-card">
        {SUB.cards.map((c, i) => {
          const on = open === i;
          return (
            <li key={c.k} className={`f1-row f1-row--btn${on ? ' is-open' : ''}`}>
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                <span className="f1-row__fig f1-row__fig--when">
                  <Ast t={c.stat[0]} />
                </span>
                <span className="f1-row__body">
                  <i className="f1-row__k">{c.k}</i>
                  <b>{c.title}</b>
                  <span>{c.stat[1]}</span>
                </span>
                <Chevron className="ico f1-row__chev" />
              </button>
              <div className="f1-row__more" hidden={!on}>
                <p>{c.back}</p>
                <Items items={c.items} className="f1-items" />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---- B · Billboard: the film as the billboard, the four cards as flip posters ---- */

export function SubB() {
  const [flip, setFlip] = useState(-1);
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{SUB.eye}</span>
        <h2 className="nf-rowhead__h">{SUB.headline}</h2>
      </header>
      <Player film={SUB.film} className="hb-card hb-card--wide">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot hb-card__foot--left">
          <span className="hb-meta">
            <span className="hb-len">{SUB.film.len}</span>
            {SUB.film.line}
          </span>
        </span>
        <span className="nf-tile__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>

      <div className="nf-call">
        <span className="nf-eye">{SUB.call.kick}</span>
        <b>
          {SUB.call.big.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </b>
        <p>{SUB.call.text}</p>
      </div>

      <ul className="nf-row nf-row--end">
        {SUB.cards.map((c, i) => {
          const on = flip === i;
          return (
            <li key={c.k}>
              <button type="button" className={`nf-flip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => setFlip(on ? -1 : i)} aria-label={`${c.k}: ${c.title}`}>
                <span className="nf-flip__face">
                  <span className="nf-poster__lab nf-poster__lab--top">{c.k}</span>
                  <b className="nf-flip__t">{c.title}</b>
                  <span className="nf-flip__stat">
                    <b>
                      <Ast t={c.stat[0]} />
                    </b>{' '}
                    {c.stat[1]}
                  </span>
                  <span className="nf-flip__plus" aria-hidden="true">
                    +
                  </span>
                </span>
                <span className="nf-flip__back">
                  <span className="nf-flip__p">{c.back}</span>
                  <Items items={c.items} className="nf-items" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---- C · Glass: the commitment as the account balance, the cards as rows ---- */

export function SubC() {
  const [open, setOpen] = useState(0);
  return (
    <div className="gl">
      <header className="gl-acct">
        <span className="gl-acct__lab">{SUB.eye}</span>
        <h2 className="gl-acct__bal">{SUB.headline}</h2>
      </header>

      <section className="gl-commit glass">
        <span className="gl-eye">{SUB.call.kick}</span>
        <b>
          {SUB.call.big.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </b>
        <p>{SUB.call.text}</p>
      </section>

      <ul className="gl-list glass">
        {SUB.cards.map((c, i) => {
          const on = open === i;
          return (
            <li key={c.k} className="gl-item gl-item--btn">
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                <b className="gl-item__ico gl-item__ico--word">
                  <Ast t={c.stat[0]} />
                </b>
                <span className="gl-item__txt">
                  <b>{c.title}</b>
                  <span>{c.stat[1]}</span>
                </span>
                <Chevron className={`ico gl-item__chev${on ? ' is-on' : ''}`} />
              </button>
              <div className="gl-item__more" hidden={!on}>
                <p>{c.back}</p>
                <Items items={c.items} className="gl-items" />
              </div>
            </li>
          );
        })}
      </ul>

      <section className="gl-duo glass" aria-label={SUB.film.title}>
        <Player film={SUB.film} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <span className="gl-len">Watch · {SUB.film.len}</span>
          <b className="gl-duo__line">{SUB.film.line}</b>
        </div>
      </section>
    </div>
  );
}
