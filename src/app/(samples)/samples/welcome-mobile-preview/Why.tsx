import { WHY } from './data';
import { FilmCard } from './parts';

export default function Why() {
  const c = WHY.conversion;
  return (
    <section className="sec sec--paper" aria-label="Section 1, Why">
      <FilmCard film={WHY.vsl} className="film--vsl" />

      <p className="callout">{WHY.callout}</p>

      <ul className="cards">
        {WHY.cards.map((k) => (
          <li key={k.label} className="card">
            <span className="card__lab">{k.label}</span>
            <b className="card__fig">{k.fig}</b>
            <span className="card__line">{k.line}</span>
          </li>
        ))}
      </ul>

      <p className="conv">
        <span className="conv__side conv__side--apex">
          <b>{c.apex}</b>
          <span>{c.apexLab}</span>
        </span>
        <span className="conv__vs">{c.vs}</span>
        <span className="conv__side">
          <b>{c.desk}</b>
          <span>{c.deskLab}</span>
        </span>
      </p>
    </section>
  );
}
