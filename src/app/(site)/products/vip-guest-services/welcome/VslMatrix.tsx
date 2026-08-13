'use client';

import { useState } from 'react';
import Clip from './Clip';
import { CHAPTERS } from './data';
import { DEFAULT_RECAPTURE } from './math';

/**
 * Section 1B — the four-part VSL matrix.
 *
 * Three cards across: the chapter playing, the chapter queued behind it, and a
 * double-wide column carrying the written argument and the money. The middle
 * card exists to hold retention — showing the next title is what makes someone
 * watch four videos instead of one — so clicking it advances rather than opening
 * anything, and it is a real button for that reason.
 */
export default function VslMatrix() {
  const [i, setI] = useState(0);
  const chapter = CHAPTERS[i];
  const next = CHAPTERS[(i + 1) % CHAPTERS.length];

  return (
    <div className="wvsl">
      <div className="wtabs" role="tablist" aria-label="VSL chapters">
        {CHAPTERS.map((c, n) => (
          <button
            key={c.tab}
            type="button"
            role="tab"
            aria-selected={n === i}
            className={n === i ? 'is-on' : undefined}
            onClick={() => setI(n)}
          >
            <span className="wtabs-n">0{n + 1}</span>
            {c.tab}
          </button>
        ))}
      </div>

      <div className="wvsl-grid">
        <figure className="wvsl-play">
          <Clip name={chapter.clip} label={`${chapter.title} — chapter ${i + 1}`} className="wv916" />
          <figcaption>
            <span className="wdot" aria-hidden />
            ASMR audio on · Chapter {i + 1} of {CHAPTERS.length}
          </figcaption>
        </figure>

        <button type="button" className="wvsl-next" onClick={() => setI((n) => (n + 1) % CHAPTERS.length)}>
          <Clip name={next.clip} active={false} className="wv916" />
          <span className="wvsl-up">Up next</span>
          <span className="wvsl-uptitle">{next.title}</span>
        </button>

        <div className="wvsl-detail">
          <h3>{chapter.title}</h3>
          <blockquote>{chapter.hook}</blockquote>
          <p>{chapter.narrative}</p>

          <dl className="wvsl-metric">
            <div>
              <dt>{chapter.metric.label}</dt>
              <dd>{chapter.metric.value}</dd>
            </div>
            <div className="is-yield">
              <dt>Recaptured revenue, worked example</dt>
              <dd>{DEFAULT_RECAPTURE}/mo</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
