import { WHAT2 } from './data';
import { FilmCard } from './parts';

export default function WhatTwo() {
  return (
    <section className="sec sec--night" aria-label="Section 3, What, part 2">
      <FilmCard film={WHAT2.vsl} className="film--vsl" />

      <p className="callout callout--night">{WHAT2.callout}</p>

      <ul className="vals">
        {Array.from({ length: WHAT2.boxes }, (_, i) => (
          <li key={i} className="ph">
            Value box {i + 1} · content pending
          </li>
        ))}
      </ul>
    </section>
  );
}
