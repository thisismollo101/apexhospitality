import { WHY } from './data';
import { PlayIcon, Player } from './parts';

/*
 * Why · A · Grid — Formula 1. The film as the full-bleed header, its title in
 * heavy white capitals and the Expedia callout in the outlined pill; the four
 * cards as a race-schedule card; the conversion line as a dark timing board.
 */
export default function WhyA() {
  const c = WHY.conversion;
  return (
    <div className="ha">
      <Player film={WHY.vsl} className="f1-head">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__h">{WHY.vsl.title}</span>
          <span className="f1-head__row">
            <span className="f1-pill">{WHY.callout}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <ol className="f1-card">
        {WHY.cards.map((k) => (
          <li key={k.label} className="f1-row">
            <b className="f1-row__fig">{k.fig}</b>
            <span className="f1-row__body">
              <b>{k.label}</b>
              <span>{k.line}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="f1-board">
        <p className="f1-board__row f1-board__row--lead">
          <b>{c.apex}</b>
          <span>{c.apexLab}</span>
        </p>
        <p className="f1-board__row">
          <b>{c.desk}</b>
          <span>{c.deskLab}</span>
        </p>
        <span className="f1-board__vs">{c.vs}</span>
      </div>
    </div>
  );
}
