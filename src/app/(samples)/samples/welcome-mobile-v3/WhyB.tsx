import { WHY } from './data';
import { PlayIcon, Player } from './parts';

/*
 * Why · B · Billboard — Netflix and MasterClass. The film as a dark billboard
 * with its title set like a show's, the callout as a ranked badge line, the
 * four cards as a MasterClass row of square tiles, and the conversion line as
 * one wide split tile.
 */
export default function WhyB() {
  const c = WHY.conversion;
  return (
    <div className="nf">
      <Player film={WHY.vsl} className="nf-bill">
        <span className="nf-bill__shade" aria-hidden="true" />
        <span className="nf-bill__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>
      <div className="nf-title">
        <h2 className="nf-title__h">{WHY.vsl.title}</h2>
        <p className="nf-badge">
          <svg className="nf-badge__mark" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,11 9,85 50,63" fill="currentColor" opacity=".45" />
            <polygon points="50,11 91,85 50,63" fill="currentColor" />
            <polygon points="9,85 91,85 50,63" fill="currentColor" opacity=".22" />
          </svg>
          {WHY.callout}
        </p>
      </div>

      <ul className="nf-row">
        {WHY.cards.map((k) => (
          <li key={k.label} className="nf-sq">
            <span className="nf-sq__lab">{k.label}</span>
            <b className="nf-sq__fig">{k.fig}</b>
            <span className="nf-sq__copy">{k.line}</span>
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
