'use client';

import { useState } from 'react';
import { ARSENAL, DEFAULTS, FIELDS, PAYBACK } from './data';
import { count, leak, money, recaptured, touchpoints, type Inputs } from './math';

/** Components 9, 10 and 11, each its own section. */

/**
 * Component 9 — the joint risk calculator.
 *
 * Ranges rather than text boxes: a GM is not looking up their exact ADR to two
 * decimals, they drag until it looks like their property, and the drag is what
 * makes the scale land. Three outcomes — the leak, the conservative recovery,
 * and the flow volume, which answers the operational objection rather than the
 * financial one.
 */
export function JointRiskCalculator() {
  const [v, setV] = useState<Inputs>(DEFAULTS);

  return (
    <div className="wroi">
      <div className="wcalc">
        <div className="wcalc-fields">
          {FIELDS.map((f) => {
            const value = v[f.key as keyof Inputs];
            return (
              <label className="wfield" key={f.key}>
                <span className="wfield-top">
                  <span className="wfield-label">
                    {f.label} <em>{f.hint}</em>
                  </span>
                  <output>
                    {f.unit === '$' && '$'}
                    {value.toLocaleString('en-US')}
                    {f.unit === '%' && '%'}
                  </output>
                </span>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={value}
                  onChange={(e) => setV({ ...v, [f.key]: Number(e.target.value) })}
                />
              </label>
            );
          })}
        </div>
        <p className="axcalc-formula">
          Room-nights sold a month at 30.4 days, narrowed to the OTA share, priced at rate, times the commission that
          share hands over.
        </p>
      </div>

      <div className="wcalc-out">
        <div className="wout is-leak">
          <span>Estimated monthly leak</span>
          <strong>{money(leak(v))}</strong>
          <em>{money(leak(v) * 12)} a year handed to the OTAs</em>
        </div>
        <div className="wout is-back">
          <span>Recaptured cash, conservative 15% shift</span>
          <strong>{money(recaptured(v))}</strong>
          <em>{money(recaptured(v) * 12)} a year back on the property’s own books</em>
        </div>
        <div className="wout is-flow">
          <span>Automated touchpoint flows a month</span>
          <strong>{count(touchpoints(v))}</strong>
          <em>Four sends per guest journey, zero staff time</em>
        </div>
      </div>
    </div>
  );
}

/** Component 10 — the payback baseline. */
export function PaybackBaseline() {
  return (
    <div className="axcall">
      <span className="axcall-tag">{PAYBACK.tag}</span>
      <p>{PAYBACK.copy}</p>
    </div>
  );
}

/** Component 11 — the case-study arsenal. */
export function CaseStudyArsenal() {
  return (
    <div className="axarsenal">
      <div className="axarsenal-body">
        <h3>{ARSENAL.title}</h3>
        <p className="axarsenal-sub">{ARSENAL.sub}</p>
        <p>{ARSENAL.body}</p>
      </div>
      <dl className="wstats">
        {ARSENAL.points.map(([value, label]) => (
          <div key={label}>
            <dt>{value}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
