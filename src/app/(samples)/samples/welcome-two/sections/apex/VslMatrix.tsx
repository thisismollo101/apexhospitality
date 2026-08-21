'use client';

import { useState } from 'react';
import Clip from './Clip';
import { CHAPTERS, PROMISE, TRANSCRIPT_NOTE } from './data';
import { DEFAULT_RECAPTURE } from './math';

/** Components 6, 7 and 8, each its own section. */

/** Component 6 — the three-column player dashboard. */
export function VslDashboard() {
  const [i, setI] = useState(0);
  const chapter = CHAPTERS[i];
  const next = CHAPTERS[(i + 1) % CHAPTERS.length];

  return (
    <>
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
            <span className="wtabs-n">0{c.n}</span>
            {c.tab}
          </button>
        ))}
      </div>

      <div className="axvsl">
        <figure className="axvsl-play">
          <Clip name={chapter.clip} label={`${chapter.title} — chapter ${chapter.n}`} className="wv916" />
          <div className="axseek" aria-hidden>
            <span style={{ width: `${((i + 1) / CHAPTERS.length) * 100}%` }} />
          </div>
          <figcaption className="axasmr">Active ASMR layer</figcaption>
        </figure>

        {/* Naming what is queued is what makes someone watch four chapters
            instead of one, so the thumbnail advances the player rather than
            opening anything. */}
        <div className="axnext">
          <span className="axnext-lab">Up next</span>
          <button type="button" className="axthumb" onClick={() => setI((n) => (n + 1) % CHAPTERS.length)}>
            <Clip name={next.clip} active={false} className="wv916" />
            <span>
              <strong>Chapter {next.n}</strong>
              <em>{next.title}</em>
            </span>
          </button>
          {CHAPTERS.filter((_, n) => n !== i && n !== (i + 1) % CHAPTERS.length).map((c) => (
            <button key={c.n} type="button" className="axthumb" onClick={() => setI(CHAPTERS.indexOf(c))}>
              <Clip name={c.clip} active={false} className="wv916" />
              <span>
                <strong>Chapter {c.n}</strong>
                <em>{c.tab}</em>
              </span>
            </button>
          ))}
        </div>

        <div className="axproof">
          <h3>{chapter.title}</h3>
          <dl className="axmetric">
            <dt>{chapter.metric.label}</dt>
            <dd>{chapter.metric.value}</dd>
          </dl>
          <dl className="axmetric is-yield">
            <dt>Recaptured revenue, worked example</dt>
            <dd>{DEFAULT_RECAPTURE}/mo</dd>
          </dl>
          <article className="wproof">
            <h3>Chapter proof</h3>
            <ul>
              {chapter.proof.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </>
  );
}

/**
 * Component 7 — the four teleprompter scripts.
 *
 * All four are on the page at once rather than following the player's state:
 * a GM reading along wants the set, and <details> keeps them searchable and
 * printable without JavaScript.
 */
export function TeleprompterScripts() {
  return (
    <div className="axscripts">
      {CHAPTERS.map((c) => (
        <details className="axscript-row" key={c.n}>
          <summary>
            <span className="axscript-n">Chapter {c.n}</span>
            <span className="axscript-t">{c.title}</span>
          </summary>
          <p>{c.transcript}</p>
        </details>
      ))}
      <p className="axscript-note">{TRANSCRIPT_NOTE}</p>
    </div>
  );
}

/** Component 8 — the zero-risk promise. */
export function UnbeatablePromise() {
  return (
    <div className="axcall">
      <span className="axcall-tag">{PROMISE.tag}</span>
      <p>{PROMISE.copy}</p>
    </div>
  );
}
