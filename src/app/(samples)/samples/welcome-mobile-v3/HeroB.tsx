'use client';

import { ALONGSIDE, BANNER, HEADLINE, PARTNERS, STATS, img } from './data';
import { Burger, Film, Lockup, SoundIcon, useFilm } from './parts';

/*
 * Hero · B · Billboard — Netflix and MasterClass. Black, cinematic: the nav on
 * black, the film as a rounded billboard card with the headline set on it and a
 * white Unmute button, its burned-in captions running as subtitles; then a row
 * of stat posters and a row of wide partner tiles, each on a darkened still
 * from the live page, swiped sideways.
 */
const STAT_STILLS = ['hq/card.jpg', 'hq/screen.jpg', 'hq/apex-reveal.jpg'];
const PARTNER_STILLS = ['t2.jpg', 'f6.jpg', 't16.jpg'];

export default function HeroB() {
  const film = useFilm();
  return (
    <div className="hb">
      <div className="hb-top">
        <Lockup />
        <Burger />
      </div>
      <p className="hb-banner">
        <span>{BANNER.text}</span>
        <a href={BANNER.href}>{BANNER.link}</a>
      </p>

      <section className="hb-card">
        <Film videoRef={film.ref} className="hb-card__film" />
        <span className="hb-card__shade" aria-hidden="true" />
        <div className="hb-card__foot">
          <h1 className="hb-h">{HEADLINE}</h1>
          <button type="button" className="hb-play" onClick={film.toggle} aria-pressed={film.sound}>
            <SoundIcon on={film.sound} />
            {film.sound ? 'Mute' : 'Unmute'}
          </button>
        </div>
      </section>

      <ul className="nf-row">
        {STATS.map((s, i) => (
          <li key={s.label} className="nf-poster" style={{ backgroundImage: `url(${img(STAT_STILLS[i])})` }}>
            <span className="nf-poster__shade" aria-hidden="true" />
            <b className="nf-poster__fig">{s.stat}</b>
            <span className="nf-poster__lab">{s.label}</span>
            <span className="nf-poster__copy">{s.copy}</span>
          </li>
        ))}
      </ul>

      <ul className="nf-row">
        {PARTNERS.map((p, i) => (
          <li key={p.key} className="nf-wide" style={{ backgroundImage: `url(${img(PARTNER_STILLS[i])})` }}>
            <span className="nf-wide__shade" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element -- vendor logo file at fixed size */}
            <img className="nf-wide__logo" src={p.logo} alt={p.name} width={p.w} height={p.h} loading="lazy" />
            <b className="nf-wide__fig">{p.figure}</b>
            <span className="nf-wide__cap">{p.caption}</span>
          </li>
        ))}
      </ul>

      <p className="nf-along">
        <b>{ALONGSIDE.lead}</b>
        <i aria-hidden="true" />
        {ALONGSIDE.line}
        <i aria-hidden="true" />
        <b>{ALONGSIDE.tail}</b>
      </p>
    </div>
  );
}
