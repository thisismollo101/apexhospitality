import { WHAT1, img } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 1 · B · Billboard — Netflix and MasterClass. The heading as the row
 * title over one Netflix row of large full-bleed film tiles (the briefing
 * first, then the four films), swiped sideways; then a row of milestone
 * posters ending on the phone.
 */
const REEL = [WHAT1.vsl, ...WHAT1.films];

export default function WhatOneB() {
  return (
    <div className="hb hb--sec hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{WHAT1.eye}</span>
        <h2 className="nf-rowhead__h">{WHAT1.headline}</h2>
      </header>

      <ul className="nf-row nf-row--films">
        {REEL.map((f) => (
          <li key={f.clip}>
            <Player film={f} className="nf-tile">
              <span className="nf-tile__shade" aria-hidden="true" />
              <span className="nf-tile__play" aria-hidden="true">
                <PlayIcon />
              </span>
              <span className="nf-tile__cap">
                <b>{f.title}</b>
                {f.len && <i>{f.len}</i>}
              </span>
            </Player>
          </li>
        ))}
      </ul>

      <ul className="nf-row">
        {WHAT1.rows.map((r) => (
          <li key={r.when + r.what} className="nf-poster nf-poster--sq" style={{ backgroundImage: `url(${img(r.img)})` }}>
            <span className="nf-poster__shade" aria-hidden="true" />
            <b className="nf-poster__fig nf-poster__fig--when">{r.when}</b>
            <span className="nf-poster__copy">{r.what}</span>
          </li>
        ))}
        <li className="nf-poster nf-poster--sq nf-poster--phone">
          <span className="nf-mini">
            {/* eslint-disable-next-line @next/next/no-img-element -- mockup still sized by CSS, lazy */}
            <img src={img(WHAT1.phone.img)} alt="" loading="lazy" decoding="async" />
            <span className="nf-mini__btn">{WHAT1.phone.button}</span>
          </span>
        </li>
      </ul>

      <p className="nf-note">{WHAT1.trigger}</p>
    </div>
  );
}
