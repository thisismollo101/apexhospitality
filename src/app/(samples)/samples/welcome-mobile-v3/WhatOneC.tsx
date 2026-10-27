'use client';

import { useState } from 'react';
import { WHAT1, img } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 1 · C · Glass — Revolut and Spotify. A Spotify playlist: the current
 * film as cover art (the one player), the heading and the trigger line as the
 * playlist's title and description, a big round play, and the briefing plus
 * the four milestones as tracks that load into the player. The phone closes it
 * as a Revolut card.
 */
const TRACKS = [
  { when: WHAT1.vsl.len ?? '', what: WHAT1.vsl.title, img: WHAT1.vsl.poster, film: WHAT1.vsl },
  ...WHAT1.rows.map((r, i) => ({ when: r.when, what: r.what, img: r.img, film: WHAT1.films[i] })),
];

export default function WhatOneC() {
  const [cur, setCur] = useState(0);
  const [on, setOn] = useState(false);
  const t = TRACKS[cur];
  return (
    <div className="gl gl--list">
      <Player film={t.film} className="gl-cover" on={on} onStart={() => setOn(true)}>
        <span className="gl-round gl-round--on-film" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>

      <span className="gl-eye">{WHAT1.eye}</span>
      <h2 className="gl-h gl-h--list">{WHAT1.headline}</h2>
      <div className="gl-meta">
        <p>{WHAT1.trigger}</p>
        <button type="button" className="gl-round gl-round--lg" aria-label={`Play: ${t.film.title}`} onClick={() => setOn(true)}>
          <PlayIcon />
        </button>
      </div>

      <ol className="gl-tracks">
        {TRACKS.map((r, i) => (
          <li key={r.film.clip} className={cur === i ? 'is-on' : undefined}>
            <button
              type="button"
              className="gl-tracks__btn"
              aria-label={`Play: ${r.film.title}`}
              aria-pressed={cur === i && on}
              onClick={() => {
                setCur(i);
                setOn(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
              <img className="gl-tracks__thumb" src={img(r.img)} alt="" loading="lazy" decoding="async" />
              <span className="gl-tracks__txt">
                <b>{r.when}</b>
                <span>{r.what}</span>
              </span>
              <span className="gl-tracks__eq" aria-hidden="true">
                <PlayIcon />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <section className="gl-card glass" aria-label="Phone">
        <span className="gl-mini">
          {/* eslint-disable-next-line @next/next/no-img-element -- mockup still sized by CSS, lazy */}
          <img src={img(WHAT1.phone.img)} alt="" loading="lazy" decoding="async" />
          <span className="gl-mini__btn">{WHAT1.phone.button}</span>
        </span>
        <span className="gl-card__txt">
          <b>{WHAT1.rows[2].when}</b>
          <span>{WHAT1.rows[2].what}</span>
        </span>
      </section>
    </div>
  );
}
