'use client';

import { useEffect, useState } from 'react';
import Clip from './Clip';
import { CLIPS, MATRIX, PERSONAS, TOUCHPOINTS } from './data';

/** Components 17 and 18, each its own section. */

/**
 * Component 17 — the sixteen-cell grid.
 *
 * Four touchpoints down, four personas across, every cell a real button. The
 * sales argument is that all sixteen already exist as specified shoots rather
 * than as a promise to work it out later, so all sixteen are on the page.
 *
 * Escape closes the modal and focus is not trapped: this is a preview surface,
 * not a form, and a dialog that is hard to leave reads as a dark pattern.
 */
export function WelcomeMatrix() {
  const [open, setOpen] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const blueprint = open ? MATRIX[open[0]][open[1]] : null;

  return (
    <>
      <div className="axmx">
        <div className="axmx-row">
          <span className="axmx-head">Touchpoint</span>
          {PERSONAS.map((p) => (
            <span className="axmx-head" key={p}>
              {p}
            </span>
          ))}
        </div>

        {MATRIX.map((row, t) => (
          <div className="axmx-row" key={TOUCHPOINTS[t].n}>
            <span className="axmx-head">
              {t + 1}. {TOUCHPOINTS[t].title}
            </span>
            {row.map((cell, p) => (
              <button
                type="button"
                className="axmx-cell"
                key={PERSONAS[p]}
                onClick={() => setOpen([t, p])}
                aria-label={`${TOUCHPOINTS[t].title} for ${PERSONAS[p]} — open blueprint`}
              >
                <Clip name={CLIPS[(t * 4 + p) % CLIPS.length]} active={false} className="wv916" />
                <span>{cell.type}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {open && blueprint && (
        <div className="axmodal" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <div className="axmodal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{TOUCHPOINTS[open[0]].title}</h3>
            <p className="axmodal-who">{PERSONAS[open[1]]}</p>
            <dl>
              <div>
                <dt>The visual arc</dt>
                <dd>{blueprint.arc}</dd>
              </div>
              <div>
                <dt>The sensory ASMR layer</dt>
                <dd>{blueprint.asmr}</dd>
              </div>
              <div>
                <dt>On-screen typography</dt>
                <dd>{blueprint.type}</dd>
              </div>
            </dl>
            <button type="button" className="btn btn-ghost axmodal-close" onClick={() => setOpen(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Component 18 — the sixteen blueprints, laid out rather than hidden.
 *
 * Section 17 reaches these through a modal, which proves they are wired up but
 * shows one at a time. On a catalogue page the whole set has to be readable,
 * so the same data is printed here grouped by touchpoint.
 */
export function ProductionBlueprints() {
  return (
    <div className="axbps">
      {MATRIX.map((row, t) => (
        <section className="axbp-group" key={TOUCHPOINTS[t].n}>
          <h3>
            {t + 1}. {TOUCHPOINTS[t].title}
          </h3>
          <div className="axbp-rows">
            {row.map((cell, p) => (
              <details className="axbp" key={PERSONAS[p]}>
                <summary>
                  <span className="axbp-who">{PERSONAS[p]}</span>
                  <span className="axbp-type">{cell.type}</span>
                </summary>
                <dl>
                  <div>
                    <dt>Visual arc</dt>
                    <dd>{cell.arc}</dd>
                  </div>
                  <div>
                    <dt>ASMR layer</dt>
                    <dd>{cell.asmr}</dd>
                  </div>
                </dl>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
