import { WHAT1, img } from './data';
import { FilmCard } from './parts';

export default function WhatOne() {
  const f = WHAT1.films;
  return (
    <section className="sec sec--warm" aria-label="Section 2, What, part 1">
      <FilmCard film={WHAT1.vsl} className="film--vsl" />

      <ol className="rows">
        {WHAT1.rows.map((r) => (
          <li key={r.when + r.what} className="row">
            {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail sized by CSS, lazy */}
            <img className="row__img" src={img(r.img)} alt="" loading="lazy" decoding="async" />
            <span className="row__when">{r.when}</span>
            <span className="row__what">{r.what}</span>
          </li>
        ))}
      </ol>
      <p className="rows__note">{WHAT1.trigger}</p>

      <div className="phone">
        <div className="phone__screen">
          {/* eslint-disable-next-line @next/next/no-img-element -- mockup still sized by CSS, lazy */}
          <img className="phone__img" src={img(WHAT1.phone.img)} alt="" loading="lazy" decoding="async" />
          <span className="phone__btn">{WHAT1.phone.button}</span>
        </div>
      </div>

      <header className="films__head">
        <span className="eye">{f.eye}</span>
        <h2 className="h2">{f.headline}</h2>
      </header>
      <ul className="tiles">
        {f.tiles.map((t) => (
          <li key={t.clip}>
            <FilmCard film={t} className="film--tile" />
          </li>
        ))}
      </ul>
    </section>
  );
}
