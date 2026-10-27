'use client';

import { useState } from 'react';
import { WHAT1, img } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 1 · A · Grid — Formula 1. One player as the full-bleed header and an
 * onboard-camera strip that switches it between the briefing and the four
 * films (one video on the page, so nothing stacks); the heading in heavy
 * capitals; the milestones as a race-schedule card; and a dark band with the
 * phone and a floating card.
 */
const REEL = [WHAT1.vsl, ...WHAT1.films];

export default function WhatOneA() {
  const [cur, setCur] = useState(0);
  const [on, setOn] = useState(false);
  const film = REEL[cur];
  return (
    <div className="ha">
      <Player film={film} className="f1-head" on={on} onStart={() => setOn(true)}>
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__h f1-head__h--sm">{film.title}</span>
          <span className="f1-head__row">
            {film.len ? <span className="f1-pill">{film.len}</span> : <span />}
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <ul className="f1-cams" aria-label="Films">
        {REEL.map((f, i) => (
          <li key={f.clip}>
            <button
              type="button"
              className={cur === i ? 'is-on' : undefined}
              aria-pressed={cur === i}
              aria-label={`Play: ${f.title}`}
              onClick={() => {
                setCur(i);
                setOn(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- poster sized by CSS, lazy */}
              <img src={img(f.poster)} alt="" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>

      <header className="f1-heading">
        <span className="f1-eye">{WHAT1.eye}</span>
        <h2 className="f1-h2">{WHAT1.headline}</h2>
      </header>

      <ol className="f1-card f1-card--thumbs">
        {WHAT1.rows.map((r) => (
          <li key={r.when + r.what} className="f1-row">
            <b className="f1-row__fig f1-row__fig--when">{r.when}</b>
            <span className="f1-row__body">
              <b>{r.what}</b>
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
            <img className="f1-row__thumb" src={img(r.img)} alt="" loading="lazy" decoding="async" />
          </li>
        ))}
      </ol>

      <section className="ha-band ha-band--sec" aria-label="Phone">
        <div className="ha-band__stage">
          <div className="ha-phone">
            <div className="ha-phone__screen">
              {/* eslint-disable-next-line @next/next/no-img-element -- mockup still sized by CSS, lazy */}
              <img className="ha-phone__film" src={img(WHAT1.phone.img)} alt="" loading="lazy" decoding="async" />
              <span className="ha-phone__cta">{WHAT1.phone.button}</span>
            </div>
          </div>
          <p className="ha-float ha-float--when">
            <b>{WHAT1.rows[2].when}</b>
            <span>{WHAT1.rows[2].what}</span>
          </p>
        </div>
        <p className="ha-along ha-along--note">{WHAT1.trigger}</p>
      </section>
    </div>
  );
}
