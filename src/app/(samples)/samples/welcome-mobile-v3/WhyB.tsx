import { WHY, img } from './data';
import { Mark, PlayIcon, Player } from './parts';

/*
 * Why · B · Billboard — Netflix and MasterClass. The film as a rounded
 * billboard card with its title and the callout set on it like a show's, a
 * row of four stat posters on darkened stills, and the conversion line as one
 * wide split tile.
 */
const STILLS = ['t2.jpg', 'f6.jpg', 't9.jpg', 't16.jpg'];

export default function WhyB() {
  const c = WHY.conversion;
  return (
    <div className="hb hb--sec">
      <Player film={WHY.vsl} className="hb-card hb-card--sq">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot">
          <span className="hb-h">{WHY.vsl.title}</span>
          <span className="hb-meta">
            <Mark />
            {WHY.callout}
          </span>
          <span className="hb-play">
            <PlayIcon />
          </span>
        </span>
      </Player>

      <ul className="nf-row">
        {WHY.cards.map((k, i) => (
          <li key={k.label} className="nf-poster" style={{ backgroundImage: `url(${img(STILLS[i])})` }}>
            <span className="nf-poster__shade" aria-hidden="true" />
            <span className="nf-poster__lab nf-poster__lab--top">{k.label}</span>
            <b className="nf-poster__fig">{k.fig}</b>
            <span className="nf-poster__copy">{k.line}</span>
          </li>
        ))}
      </ul>

      <p className="nf-split">
        <span className="nf-split__half nf-split__half--lead">
          <b>{c.apex}</b>
          {c.apexLab}
        </span>
        <span className="nf-split__vs">{c.vs}</span>
        <span className="nf-split__half">
          <b>{c.desk}</b>
          {c.deskLab}
        </span>
      </p>
    </div>
  );
}
