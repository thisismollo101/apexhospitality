'use client';

import { useState } from 'react';
import { WHAT1, img } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 1 · A · Grid — Formula 1. One player as the full-bleed header, an
 * onboard-camera strip under the heading to switch it between the briefing and
 * the four films (one video on the page, so nothing stacks), the milestones as
 * a schedule list, and a dark band with the phone and a floating card.
 */
const REEL = [WHAT1.vsl, ...WHAT1.films];

export default function WhatOneA() {
  const [cur, setCur] = useState(0);
  const [on, setOn] = useState(false);
  const film = REEL[cur];
  const pick = (i: number) => {
    setCur(i);
    setOn(true);
  };
  return (
    <div className="f1">
      <Player film={film} className="f1-head f1-head--tall" on={on} onStart={() => setOn(true)}>
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__h f1-head__h--sm">{film.title}</span>
          <span className="f1-head__row">
            {film.len && <span className="f1-pill">{film.len}</span>}
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <header className="f1-heading">
        <span className="f1-eye">{WHAT1.eye}</span>
        <h2 className="f1-h2">{WHAT1.headline}</h2>
      </header>

      <ul className="f1-cams">
        {REEL.map((f, i) => (
          <li key={f.clip}>
            <button type="button" className={cur === i ? 'is-on' : undefined} aria-pressed={cur === i} onClick={() => pick(i)} aria-label={`Play: ${f.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- poster sized by CSS, lazy */}
              <img src={img(f.poster)} alt="" loading="lazy" decoding="async" />
              <span>{i === 0 ? f.len : f.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <ol className="f1-sched f1-sched--plain">
        {WHAT1.rows.map((r) => (
          <li key={r.when + r.what} className="f1-sched__row">
            <b className="f1-sched__fig f1-sched__fig--when">{r.when}</b>
            <span className="f1-sched__title">{r.what}</span>
            {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
            <img className="f1-sched__thumb" src={img(r.img)} alt="" loading="lazy" decoding="async" />
          </li>
        ))}
      </ol>

      <section className="f1-band f1-band--tight" aria-label="Phone">
        <div className="f1-band__stage">
          <div className="f1-phone">
            <div className="f1-phone__screen">
              {/* eslint-disable-next-line @next/next/no-img-element -- mockup still sized by CSS, lazy */}
              <img src={img(WHAT1.phone.img)} alt="" loading="lazy" decoding="async" />
              <span className="f1-phone__btn">{WHAT1.phone.button}</span>
            </div>
          </div>
          <p className="f1-float">
            <b>{WHAT1.rows[2].when}</b>
            <span>{WHAT1.rows[2].what}</span>
          </p>
        </div>
        <p className="f1-band__note">{WHAT1.trigger}</p>
      </section>
    </div>
  );
}
