'use client';

import { useState } from 'react';
import { EVENTS } from '../data-more';
import { PlayIcon, Player } from '../parts';

/*
 * Welcome for events · two packages, Corporate & MICE and Weddings, each with
 * its film, line and three inclusions. A and C switch between them; B swipes.
 */

const E = EVENTS;

const Ticks = ({ li, cls }: { li: string[]; cls: string }) => (
  <ul className={cls}>
    {li.map((l) => (
      <li key={l}>{l}</li>
    ))}
  </ul>
);

/* ---- A · Grid --------------------------------------------------------------- */

export function EventsA() {
  const [cur, setCur] = useState(0);
  const c = E.cards[cur];
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{E.eye}</span>
        <h2 className="f1-h2">{E.headline}</h2>
      </header>
      <div className="f1-tabs" role="tablist" aria-label="Package">
        {E.cards.map((x, i) => (
          <button key={x.k} type="button" role="tab" aria-selected={cur === i} className={cur === i ? 'is-on' : undefined} onClick={() => setCur(i)}>
            {x.k}
          </button>
        ))}
      </div>
      <Player key={cur} film={c.film} className="f1-head f1-head--short">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__row">
            <span className="f1-pill">{c.tag}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>
      <article className="f1-step">
        <span className="f1-step__k">{c.k}</span>
        <h3 className="f1-step__h">{c.h}</h3>
        <p className="f1-step__p">{c.p}</p>
        <Ticks li={c.li} cls="f1-ticks" />
      </article>
    </div>
  );
}

/* ---- B · Billboard: two large package tiles, swiped ------------------------- */

export function EventsB() {
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{E.eye}</span>
        <h2 className="nf-rowhead__h">{E.headline}</h2>
      </header>
      <ul className="nf-row nf-row--pkg nf-row--end">
        {E.cards.map((c) => (
          <li key={c.k} className="nf-pkg">
            <Player film={c.film} className="nf-pkg__film">
              <span className="hb-card__shade" aria-hidden="true" />
              <span className="nf-tile__play" aria-hidden="true">
                <PlayIcon />
              </span>
              <span className="nf-pkg__tag">{c.tag}</span>
            </Player>
            <div className="nf-pkg__txt">
              <span className="nf-poster__lab nf-poster__lab--top">{c.k}</span>
              <b>{c.h}</b>
              <p>{c.p}</p>
              <Ticks li={c.li} cls="nf-ticks" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- C · Glass --------------------------------------------------------------- */

export function EventsC() {
  const [cur, setCur] = useState(0);
  const c = E.cards[cur];
  return (
    <div className="gl gl--list">
      <span className="gl-eye">{E.eye}</span>
      <h2 className="gl-h gl-h--list">{E.headline}</h2>
      <div className="gl-seg2 glass" role="tablist" aria-label="Package">
        {E.cards.map((x, i) => (
          <button key={x.k} type="button" role="tab" aria-selected={cur === i} className={cur === i ? 'is-on' : undefined} onClick={() => setCur(i)}>
            {x.k}
          </button>
        ))}
      </div>
      <section className="gl-duo glass" aria-label={c.k}>
        <Player key={cur} film={c.film} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <span className="gl-len">{c.tag}</span>
          <b>{c.h}</b>
        </div>
      </section>
      <section className="gl-box glass">
        <p className="gl-box__p">{c.p}</p>
        <Ticks li={c.li} cls="gl-ticks" />
      </section>
    </div>
  );
}
