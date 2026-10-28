'use client';

import { useState } from 'react';
import { HOW } from '../data-more';
import { img } from '../data';
import { Ast, PlayIcon, Player } from '../parts';

/*
 * How it works · the five steps of the live reel, each with its film, figure
 * and footnote. A and B show one step's film at a time in a single player;
 * C swipes the steps sideways, each card with its own film.
 */

/* ---- A · Grid: session tabs over one header player and the step's card ------ */

export function HowA() {
  const [cur, setCur] = useState(0);
  const [on, setOn] = useState(false);
  const s = HOW.steps[cur];
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{HOW.eye}</span>
        <h2 className="f1-h2">{HOW.headline}</h2>
      </header>
      <div className="f1-tabs f1-tabs--n" role="tablist" aria-label="Steps">
        {HOW.steps.map((x, i) => (
          <button
            key={x.name}
            type="button"
            role="tab"
            aria-selected={cur === i}
            aria-label={`Step 0${i + 1}: ${x.name}`}
            className={cur === i ? 'is-on' : undefined}
            onClick={() => {
              setCur(i);
              setOn(false);
            }}
          >
            0{i + 1}
          </button>
        ))}
      </div>

      <Player film={s.film} className="f1-head f1-head--short" on={on} onStart={() => setOn(true)}>
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__kick">{s.name}</span>
          <span className="f1-head__row">
            <span className="f1-pill">Watch · {s.len}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <article className="f1-step">
        <h3 className="f1-step__h">{s.title}</h3>
        <p className="f1-step__p">{s.desc}</p>
        <p className="f1-step__stat">
          <b>
            <Ast t={s.fig} />
          </b>
          <span>{s.figLab}</span>
        </p>
        <p className="f1-step__foot">
          <Ast t={s.foot} />
        </p>
      </article>
    </div>
  );
}

/* ---- B · Billboard: a Netflix title page, the player on top and the steps as episodes ---- */

export function HowB() {
  const [cur, setCur] = useState(0);
  const [on, setOn] = useState(false);
  const s = HOW.steps[cur];
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{HOW.eye}</span>
        <h2 className="nf-rowhead__h">{HOW.headline}</h2>
      </header>
      <Player film={s.film} className="hb-card hb-card--wide" on={on} onStart={() => setOn(true)}>
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="nf-tile__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>
      <div className="nf-now">
        <span className="hb-meta">
          <span className="hb-len">{s.len}</span>
          {s.name}
        </span>
        <b className="nf-now__h">{s.title}</b>
        <p>{s.desc}</p>
        <p className="nf-now__stat">
          <b>
            <Ast t={s.fig} />
          </b>
          <span>{s.figLab}</span>
        </p>
        <small>
          <Ast t={s.foot} />
        </small>
      </div>

      <ol className="nf-epi">
        {HOW.steps.map((x, i) => (
          <li key={x.name} className={cur === i ? 'is-on' : undefined}>
            <button
              type="button"
              aria-pressed={cur === i}
              onClick={() => {
                setCur(i);
                setOn(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- poster sized by CSS, lazy */}
              <img src={img(x.poster)} alt="" loading="lazy" decoding="async" />
              <span className="nf-epi__txt">
                <b>
                  {i + 1}. {x.name}
                </b>
                <span>{x.len}</span>
              </span>
              <span className="nf-epi__play" aria-hidden="true">
                <PlayIcon />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---- C · Glass: the five steps as swiped glass cards, each with its film ---- */

export function HowC() {
  return (
    <div className="gl gl--list">
      <span className="gl-eye">{HOW.eye}</span>
      <h2 className="gl-h gl-h--list">{HOW.headline}</h2>
      <ol className="gl-cards">
        {HOW.steps.map((s, i) => (
          <li key={s.name} className="gl-cardx glass">
            <Player film={s.film} className="gl-cardx__film">
              <span className="gl-round gl-round--on-film" aria-hidden="true">
                <PlayIcon />
              </span>
              <span className="gl-cardx__len">{s.len}</span>
            </Player>
            <span className="gl-cardx__n">
              0{i + 1} · {s.name}
            </span>
            <b className="gl-cardx__h">{s.title}</b>
            <p className="gl-cardx__p">{s.desc}</p>
            <p className="gl-cardx__stat">
              <b>
                <Ast t={s.fig} />
              </b>
              <span>{s.figLab}</span>
            </p>
            <small className="gl-cardx__foot">
              <Ast t={s.foot} />
            </small>
          </li>
        ))}
      </ol>
    </div>
  );
}
