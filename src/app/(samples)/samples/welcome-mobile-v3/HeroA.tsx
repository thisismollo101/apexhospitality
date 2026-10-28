'use client';

import { useState } from 'react';
import { ALONGSIDE, BANNER, HEADLINE, PARTNERS, PHOTO, STATS, img } from './data';
import { Burger, Chevron, Film, Lockup, SoundIcon, useFilm } from './parts';

/*
 * Hero · A · Grid — Formula 1. A full-bleed photo header with the headline in
 * heavy white capitals and the banner's link as a pill-outlined button; the
 * three stats as a race-schedule card (figure in the date column, a hairline,
 * then the title and its line); then the dark timing band: the phone with the
 * film, a floating card overlapping it, and the partners as white icon tabs
 * with the active one underlined.
 */

function Timing() {
  const film = useFilm();
  const [tab, setTab] = useState(1);
  const p = PARTNERS[tab];
  return (
    <section className="ha-band" aria-label="Works alongside">
      <div className="ha-band__stage">
        <div className="ha-phone">
          <div className="ha-phone__screen">
            <Film videoRef={film.ref} className="ha-phone__film" />
            <button type="button" className="ha-snd" onClick={film.toggle} aria-pressed={film.sound}>
              <SoundIcon on={film.sound} />
              <span>{film.sound ? 'Mute' : 'Unmute'}</span>
            </button>
          </div>
        </div>
        <div className="ha-float" aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element -- vendor logo file at fixed size */}
          <img src={p.logo} alt={p.name} width={p.w} height={p.h} />
          <b>{p.figure}</b>
          <span>{p.caption}</span>
        </div>
      </div>

      <div className="ha-tabs" role="tablist" aria-label="Systems">
        {PARTNERS.map((s, i) => (
          <button key={s.key} type="button" role="tab" aria-selected={tab === i} className={tab === i ? 'is-on' : undefined} onClick={() => setTab(i)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- vendor logo file at fixed size */}
            <img src={s.logo} alt={s.name} width={s.w} height={s.h} loading="lazy" />
          </button>
        ))}
      </div>

      <p className="ha-along">
        <b>{ALONGSIDE.lead}</b>
        <span>{ALONGSIDE.line}</span>
        <b>{ALONGSIDE.tail}</b>
      </p>
    </section>
  );
}

export default function HeroA() {
  return (
    <div className="ha">
      <p className="ha-banner">{BANNER.text}</p>

      <section className="ha-head" style={{ backgroundImage: `url(${img(PHOTO)})` }}>
        <div className="ha-nav">
          <Lockup className="lockup--over" />
          <Burger />
        </div>
        <h1 className="ha-h">{HEADLINE}</h1>
        <a className="ha-pill" href={BANNER.href}>
          {BANNER.link}
          <Chevron />
        </a>
      </section>

      <ol className="f1-card">
        {STATS.map((s) => (
          <li key={s.label} className="f1-row">
            <b className="f1-row__fig">{s.stat}</b>
            <span className="f1-row__body">
              <b>{s.label}</b>
              <span>{s.copy}</span>
            </span>
          </li>
        ))}
      </ol>

      <Timing />
    </div>
  );
}
