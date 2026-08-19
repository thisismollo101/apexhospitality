'use client';

import { useEffect, useState } from 'react';
import Clip from './Clip';
import { CLIPS, MATRIX, PERSONAS, TOUCHPOINTS } from './data';

/**
 * Components 17 and 18 — the sixteen-cell Welcome Matrix and the production
 * blueprint behind each cell.
 *
 * Four touchpoints down, four personas across. Every cell is a real button
 * opening the blueprint for that exact combination, because the sales argument
 * is that all sixteen already exist as specified shoots rather than as a
 * promise to work it out later.
 *
 * Escape closes the modal and focus is not trapped: this is a preview surface,
 * not a form, and a dialog that is hard to leave reads as a dark pattern.
 */
export default function WelcomeMatrixGrid() {
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
