'use client';

import { ALONGSIDE, BANNER, HEADLINE, PARTNERS, STATS } from './data';
import { Burger, Film, Lockup, SoundIcon, useFilm } from './parts';

/*
 * B · Billboard — Netflix and MasterClass. A dark page whose top is the film
 * itself, full bleed, its burned-in captions running as subtitles, with the
 * nav over it and the headline and a full-width Unmute button at its foot;
 * then a MasterClass row of square stat tiles and a Netflix row of wide
 * full-bleed partner tiles, both swiped sideways.
 */

export default function HeroB() {
  const film = useFilm();
  return (
    <div className="hb">
      <p className="hb-banner">
        <span>{BANNER.text}</span>
        <a href={BANNER.href}>{BANNER.link}</a>
      </p>

      <section className="hb-bill">
        <Film videoRef={film.ref} className="hb-bill__film" />
        <span className="hb-bill__shade" aria-hidden="true" />
        <div className="hb-nav">
          <Lockup className="lockup--over" />
          <Burger />
        </div>
      </section>

      <div className="hb-bill__foot">
        <h1 className="hb-h">{HEADLINE}</h1>
        <button type="button" className="hb-play" onClick={film.toggle} aria-pressed={film.sound}>
          <SoundIcon on={film.sound} />
          {film.sound ? 'Mute' : 'Unmute'}
        </button>
      </div>

      <ul className="hb-row hb-row--sq">
        {STATS.map((s) => (
          <li key={s.label} className="hb-sq">
            <b className="hb-sq__fig">{s.stat}</b>
            <span className="hb-sq__lab">{s.label}</span>
            <span className="hb-sq__copy">{s.copy}</span>
          </li>
        ))}
      </ul>

      <ul className="hb-row hb-row--wide">
        {PARTNERS.map((p) => (
          <li key={p.key} className="hb-wide">
            <span className="hb-wide__plate">
              {/* eslint-disable-next-line @next/next/no-img-element -- vendor logo file at fixed size */}
              <img src={p.logo} alt={p.name} width={p.w} height={p.h} loading="lazy" />
            </span>
            <b className="hb-wide__fig">{p.figure}</b>
            <span className="hb-wide__cap">{p.caption}</span>
          </li>
        ))}
      </ul>

      <p className="hb-along">
        <b>{ALONGSIDE.lead}</b> <i aria-hidden="true">•</i> {ALONGSIDE.line} <i aria-hidden="true">•</i> <b>{ALONGSIDE.tail}</b>
      </p>
    </div>
  );
}
