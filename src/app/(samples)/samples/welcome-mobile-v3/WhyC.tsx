import { WHY } from './data';
import { PlayIcon, Player } from './parts';

/*
 * Why · C · Glass — Revolut and Spotify. The film's title as the big friendly
 * heading, the film in a glass "now playing" card beside the callout and a
 * round play button, the four cards as a short list of icon rows, and the
 * conversion line as a glass segmented bar.
 */
export default function WhyC() {
  const c = WHY.conversion;
  return (
    <div className="gl">
      <h2 className="gl-h">{WHY.vsl.title}</h2>

      <section className="gl-player glass" aria-label={WHY.vsl.title}>
        <Player film={WHY.vsl} className="gl-phone">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <p className="gl-player__side">
          <span className="gl-chip" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="ico">
              <path d="M5 4.5h10l4 4V19.5H5z M15 4.5v4h4 M8 12h8 M8 15.5h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          <b>{WHY.callout}</b>
        </p>
      </section>

      <ul className="gl-list glass">
        {WHY.cards.map((k) => (
          <li key={k.label} className="gl-item">
            <b className="gl-item__ico">{k.fig}</b>
            <span className="gl-item__txt">
              <b>{k.label}</b>
              <span>{k.line}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="gl-seg glass">
        <span className="gl-seg__on">
          <b>{c.apex}</b> {c.apexLab}
        </span>
        <span className="gl-seg__vs">{c.vs}</span>
        <span className="gl-seg__off">
          <b>{c.desk}</b> {c.deskLab}
        </span>
      </p>
    </div>
  );
}
