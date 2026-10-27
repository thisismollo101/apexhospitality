'use client';

import { ALONGSIDE, BANNER, HEADLINE, PARTNERS, PHOTO, STATS, img } from './data';
import { Burger, Chevron, Film, Lockup, SoundIcon, useFilm } from './parts';

/*
 * C · Glass — Revolut and Spotify. The hero photo behind a dark glass screen:
 * the banner as a tappable glass row (icon, line, link, arrow), a big friendly
 * headline, the phone in a "now playing" glass card with a scrub bar and a
 * round unmute button, the stats as a short list of icon rows, and the
 * partners as a Spotify list with logo thumbnails.
 */

export default function HeroC() {
  const film = useFilm();
  return (
    <div className="hc3">
      <span className="hc3-photo" style={{ backgroundImage: `url(${img(PHOTO)})` }} aria-hidden="true" />

      <div className="hc3-nav">
        <Lockup />
        <Burger className="burger--glass" />
      </div>

      <a className="hc3-banner glass" href={BANNER.href}>
        <span className="hc3-banner__ico" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 16.5l5-5 3.5 3.5L20 7.5M14.5 7.5H20V13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="hc3-banner__txt">
          {BANNER.text}
          <b>{BANNER.link}</b>
        </span>
        <Chevron />
      </a>

      <h1 className="hc3-h">{HEADLINE}</h1>

      <section className="hc3-player glass" aria-label="Film">
        <div className="hc3-phone">
          <Film videoRef={film.ref} className="hc3-phone__film" />
        </div>
        <div className="hc3-ctl">
          <Lockup className="lockup--sm" />
          <span className="hc3-bar" aria-hidden="true">
            <span style={{ width: `${Math.round(film.progress * 1000) / 10}%` }} />
          </span>
          <button type="button" className="hc3-round" onClick={film.toggle} aria-pressed={film.sound} aria-label={film.sound ? 'Mute' : 'Unmute'}>
            <SoundIcon on={film.sound} />
          </button>
          <span className="hc3-round__lab" aria-hidden="true">
            {film.sound ? 'Mute' : 'Unmute'}
          </span>
        </div>
      </section>

      <ul className="hc3-list glass">
        {STATS.map((s) => (
          <li key={s.label} className="hc3-stat">
            <b className="hc3-stat__ico">{s.stat}</b>
            <span className="hc3-stat__txt">
              <b>{s.label}</b>
              <span>{s.copy}</span>
            </span>
          </li>
        ))}
      </ul>

      <ul className="hc3-tracks">
        {PARTNERS.map((p) => (
          <li key={p.key} className="hc3-track">
            <span className="hc3-track__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element -- vendor logo file at fixed size */}
              <img src={p.logo} alt={p.name} width={p.w} height={p.h} loading="lazy" />
            </span>
            <span className="hc3-track__txt">
              <b>{p.figure}</b>
              <span>{p.caption}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="hc3-along glass">
        <b>{ALONGSIDE.lead}</b>
        <span>{ALONGSIDE.line}</span>
        <b>{ALONGSIDE.tail}</b>
      </p>
    </div>
  );
}
