import { WHAT2 } from './data';
import { PlayIcon, Player } from './parts';

/*
 * What · 2 · B · Billboard — Netflix and MasterClass. The film as the dark
 * billboard, its burned-in captions running as subtitles, the title and length
 * set like a show's, the callout as the badge line, and the four value boxes as
 * a swiped row of square placeholder tiles.
 */
export default function WhatTwoB() {
  return (
    <div className="nf">
      <Player film={WHAT2.vsl} className="nf-bill">
        <span className="nf-bill__shade" aria-hidden="true" />
        <span className="nf-bill__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>
      <div className="nf-title">
        <h2 className="nf-title__h">
          {WHAT2.vsl.title} <span className="nf-len">{WHAT2.vsl.len}</span>
        </h2>
        <p className="nf-badge">
          <svg className="nf-badge__mark" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,11 9,85 50,63" fill="currentColor" opacity=".45" />
            <polygon points="50,11 91,85 50,63" fill="currentColor" />
            <polygon points="9,85 91,85 50,63" fill="currentColor" opacity=".22" />
          </svg>
          {WHAT2.callout}
        </p>
      </div>

      <ul className="nf-row nf-row--last">
        {WHAT2.boxes.map((b) => (
          <li key={b} className="nf-sq ph ph--dark">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
