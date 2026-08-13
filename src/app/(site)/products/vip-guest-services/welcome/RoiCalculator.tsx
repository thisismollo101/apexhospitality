'use client';

import { useState } from 'react';
import { DEFAULTS, FIELDS } from './data';
import { leakage, money, recaptured, type Inputs } from './math';

/**
 * Section 5 — the OTA leak calculator.
 *
 * Range inputs rather than text boxes. A GM is not looking up their exact ADR
 * to two decimal places; they are dragging until the numbers look like their
 * property and watching the leak figure move, and the drag is what makes the
 * scale of it land. The defaults are the wireframe's worked example, so the
 * page opens on $121,500 and derives it rather than printing it.
 */
export default function RoiCalculator() {
  const [v, setV] = useState<Inputs>(DEFAULTS);
  const leak = leakage(v);
  const back = recaptured(v);

  return (
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

      <div className="wcalc-out">
        <div className="wout is-leak">
          <span>Monthly OTA leakage</span>
          <strong>{money(leak)}</strong>
          <em>(R × 30 × Occ%) × OTA% × ADR × Comm%</em>
        </div>
        <div className="wout is-back">
          <span>Recovered on a 10% direct shift</span>
          <strong>{money(back)}</strong>
          <em>{money(back * 12)} a year back on the property’s own books</em>
        </div>
      </div>
    </div>
  );
}
