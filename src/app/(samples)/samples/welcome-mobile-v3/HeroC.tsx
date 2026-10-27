'use client';

import { ALONGSIDE, BANNER, HEADLINE, PARTNERS, PHOTO, STATS, img } from './data';
import { Burger, Chevron, Film, Lockup, SoundIcon, useFilm } from './parts';

/*
 * Hero · C · Glass — Revolut and Spotify. A deep blue gradient over the hero
 * photo: the banner as a tappable glass row, a big friendly headline, the
 * phone centred like cover art with a Spotify control row under it (the
 * lockup as the artist, a scrub bar, a big round unmute), the stats as a glass
 * list of icon rows and the partners as a list with logo thumbnails.
 */
export default function HeroC() {
  const film = useFilm();
  return (
    <div className="gl gl--hero">
      <span className="gl-photo" style={{ backgroundImage: `url(${img(PHOTO)})` }} aria-hidden="true" />

      <div className="gl-nav">
        <Lockup className="lockup--on-dark" />
        <Burger className="burger--glass" />
      </div>

      <a className="gl-banner glass" href={BANNER.href}>
        <span className="gl-banner__ico" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 16.5l5-5 3.5 3.5L20 7.5M14.5 7.5H20V13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="gl-banner__txt">
          {BANNER.text}
          <b>{BANNER.link}</b>
        </span>
        <Chevron />
      </a>

      <h1 className="gl-h gl-h--hero">{HEADLINE}</h1>

      <section className="gl-np" aria-label="Film">
        <div className="gl-np__art">
          <Film videoRef={film.ref} className="gl-np__film" />
        </div>
        <div className="gl-np__ctl">
          <button type="button" className="gl-round gl-round--lg" onClick={film.toggle} aria-pressed={film.sound} aria-label={film.sound ? 'Mute' : 'Unmute'}>
            <SoundIcon on={film.sound} />
          </button>
        </div>
        <span className="gl-np__bar" aria-hidden="true">
          <span style={{ width: `${Math.round(film.progress * 1000) / 10}%` }} />
        </span>
      </section>

      <ul className="gl-list glass">
        {STATS.map((s) => (
          <li key={s.label} className="gl-item">
            <b className="gl-item__ico">{s.stat}</b>
            <span className="gl-item__txt">
              <b>{s.label}</b>
              <span>{s.copy}</span>
            </span>
          </li>
        ))}
      </ul>

      <ul className="gl-rows">
        {PARTNERS.map((p) => (
          <li key={p.key} className="gl-row">
            <span className="gl-row__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element -- vendor logo file at fixed size */}
              <img src={p.logo} alt={p.name} width={p.w} height={p.h} loading="lazy" />
            </span>
            <span className="gl-row__txt">
              <b>{p.figure}</b>
              <span>{p.caption}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="gl-along">
        <b>{ALONGSIDE.lead}</b>
        <span>{ALONGSIDE.line}</span>
        <b>{ALONGSIDE.tail}</b>
      </p>
    </div>
  );
}
