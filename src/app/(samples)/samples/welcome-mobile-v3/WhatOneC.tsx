'use client';

import { useState } from 'react';
import { WHAT1, img } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 1 · C · Glass — Revolut and Spotify. A playlist: the heading big and
 * friendly, one glass "now playing" card, and the briefing plus the four
 * milestones as tracks (thumbnail, title, line, round play button) that load
 * into that one player. The phone closes it as a Revolut card.
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
    <div className="gl">
      <span className="gl-eye">{WHAT1.eye}</span>
      <h2 className="gl-h gl-h--sm">{WHAT1.headline}</h2>

      <section className="gl-player glass" aria-label="Now playing">
        <Player film={t.film} className="gl-phone" on={on} onStart={() => setOn(true)}>
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <p className="gl-player__side gl-player__side--track">
          <b>{t.when}</b>
          <span className="gl-player__what">{t.what}</span>
          <span className="gl-player__note">{WHAT1.trigger}</span>
        </p>
      </section>

      <ol className="gl-tracks">
        {TRACKS.map((r, i) => (
          <li key={r.film.clip} className={cur === i ? 'is-on' : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
            <img className="gl-tracks__thumb" src={img(r.img)} alt="" loading="lazy" decoding="async" />
            <span className="gl-tracks__txt">
              <b>{r.when}</b>
              <span>{r.what}</span>
            </span>
            <button
              type="button"
              className="gl-round gl-round--sm"
              aria-label={`Play: ${r.film.title}`}
              aria-pressed={cur === i && on}
              onClick={() => {
                setCur(i);
                setOn(true);
              }}
            >
              <PlayIcon />
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
