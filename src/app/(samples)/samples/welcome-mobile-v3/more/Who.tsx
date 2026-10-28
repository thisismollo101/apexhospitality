'use client';

import { useState } from 'react';
import { WHO } from '../data-more';
import { img } from '../data';
import { Ast, PlayIcon, Player } from '../parts';

/*
 * Who it's for · three guest types, each with its four moments, the film for
 * all three, and the line that nobody on the team picks the film. Each option
 * switches guest type in place, as the live tabs do.
 */

const G = WHO.guests;

/* ---- A · Grid: tabs, a dark film strip, then the guest's schedule card ------- */

export function WhoA() {
  const [g, setG] = useState(0);
  const guest = G[g];
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{WHO.eye}</span>
        <h2 className="f1-h2">{WHO.headline}</h2>
      </header>
      <div className="f1-tabs" role="tablist" aria-label="Guest type">
        {G.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={g === i} className={g === i ? 'is-on' : undefined} onClick={() => setG(i)}>
            {x.name}.
          </button>
        ))}
      </div>

      <section className="f1-strip">
        <Player film={WHO.film} className="f1-strip__film">
          <span className="f1-play f1-play--sm" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <p>
          <b>Watch · {WHO.film.len}</b>
          {WHO.film.line}
        </p>
      </section>

      <ol className="f1-card f1-card--thumbs">
        {guest.lines.map((l, i) => (
          <li key={l} className="f1-row">
            <b className="f1-row__fig f1-row__fig--when f1-row__fig--words">{WHO.when[i]}</b>
            <span className="f1-row__body">
              <span className="f1-row__line">{l}</span>
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
            <img className="f1-row__thumb" src={img(guest.imgs[i])} alt="" loading="lazy" decoding="async" />
          </li>
        ))}
      </ol>
      <div className="f1-foot">
        <p>{WHO.cap}</p>
        {guest.data && (
          <p className="f1-foot__data">
            <Ast t={guest.data} />
          </p>
        )}
      </div>
    </div>
  );
}

/* ---- B · Billboard: "who's watching?", then that guest's four posters ------- */

const AVATAR = [3, 3, 3];

export function WhoB() {
  const [g, setG] = useState(0);
  const guest = G[g];
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead nf-rowhead--c">
        <span className="nf-eye">{WHO.eye}</span>
        <h2 className="nf-rowhead__h">{WHO.headline}</h2>
      </header>
      <div className="nf-who" role="tablist" aria-label="Guest type">
        {G.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={g === i} className={g === i ? 'is-on' : undefined} onClick={() => setG(i)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- avatar sized by CSS, lazy */}
            <img src={img(x.imgs[AVATAR[i]])} alt="" loading="lazy" decoding="async" />
            <span>{x.name}.</span>
          </button>
        ))}
      </div>

      <ul className="nf-row">
        {guest.lines.map((l, i) => (
          <li key={l} className="nf-poster nf-poster--sq" style={{ backgroundImage: `url(${img(guest.imgs[i])})` }}>
            <span className="nf-poster__shade" aria-hidden="true" />
            <span className="nf-poster__lab nf-poster__lab--top">{WHO.when[i]}</span>
            <span className="nf-poster__copy nf-poster__copy--b">{l}</span>
          </li>
        ))}
      </ul>

      <Player film={WHO.film} className="hb-card hb-card--wide hb-card--gap">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot hb-card__foot--left">
          <span className="hb-meta">
            <span className="hb-len">{WHO.film.len}</span>
            {WHO.film.line}
          </span>
        </span>
        <span className="nf-tile__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>
      <p className="nf-note nf-note--plain">{WHO.cap}</p>
      {guest.data && (
        <p className="nf-note nf-note--plain nf-note--dim">
          <Ast t={guest.data} />
        </p>
      )}
    </div>
  );
}

/* ---- C · Glass: a Revolut account switch over the guest's four rows ---------- */

export function WhoC() {
  const [g, setG] = useState(0);
  const guest = G[g];
  return (
    <div className="gl gl--list">
      <span className="gl-eye">{WHO.eye}</span>
      <h2 className="gl-h gl-h--list">{WHO.headline}</h2>
      <div className="gl-seg3 glass" role="tablist" aria-label="Guest type">
        {G.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={g === i} className={g === i ? 'is-on' : undefined} onClick={() => setG(i)}>
            {x.name}.
          </button>
        ))}
      </div>

      <ul className="gl-list glass">
        {guest.lines.map((l, i) => (
          <li key={l} className="gl-item gl-item--img">
            {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
            <img src={img(guest.imgs[i])} alt="" loading="lazy" decoding="async" />
            <span className="gl-item__txt">
              <b>{l}</b>
              <span>{WHO.when[i]}</span>
            </span>
          </li>
        ))}
      </ul>

      <section className="gl-duo glass" aria-label={WHO.film.title}>
        <Player film={WHO.film} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <span className="gl-len">Watch · {WHO.film.len}</span>
          <b className="gl-duo__line">{WHO.film.line}</b>
        </div>
      </section>
      <p className="gl-note">{WHO.cap}</p>
      {guest.data && (
        <p className="gl-note gl-note--dim">
          <Ast t={guest.data} />
        </p>
      )}
    </div>
  );
}
