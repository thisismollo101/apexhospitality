'use client';

import { useState } from 'react';
import Clip from './Clip';
import { CHAPTERS, PROMISE, TRANSCRIPT_NOTE } from './data';
import { DEFAULT_RECAPTURE } from './math';

/**
 * Components 6, 7 and 8 — the three-column VSL dashboard, the teleprompter
 * transcripts, and the zero-risk promise beneath it.
 *
 * Column B shows what is queued rather than what has played. Naming the next
 * chapter is what makes someone watch four videos instead of one, so the
 * thumbnail is a real button that advances the player.
 *
 * The transcript is a <details> so it opens with no JavaScript and stays open
 * for in-page search — a GM reading along at 115 WPM is a stated use case,
 * and a caption track that cannot be searched does not serve it.
 */
export default function VslMatrix() {
  const [i, setI] = useState(0);
  const chapter = CHAPTERS[i];
  const next = CHAPTERS[(i + 1) % CHAPTERS.length];
  const advance = () => setI((n) => (n + 1) % CHAPTERS.length);

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

        <div className="axnext">
          <span className="axnext-lab">Up next</span>
          <button type="button" className="axthumb" onClick={advance}>
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

          <details className="axscript">
            <summary>Read the transcript</summary>
            <p>{chapter.transcript}</p>
            <p className="axscript-note">{TRANSCRIPT_NOTE}</p>
          </details>
        </div>
      </div>

      <div className="axcall">
        <span className="axcall-tag">{PROMISE.tag}</span>
        <p>{PROMISE.copy}</p>
      </div>
    </>
  );
}
