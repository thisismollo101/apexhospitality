'use client';

import { useId, useState } from 'react';
import { WHATIF, type Calc } from '../data-more';
import { Ast, PlayIcon, Player } from '../parts';

/*
 * What if · the four revenue calculators, working: the live page's modules and
 * maths, its "every field starts empty, the slider starts unset" rule, and its
 * own messages. One hook, three presentations.
 */

const M = WHATIF.modules;

function useCalc() {
  const [cur, setCur] = useState(0);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [r, setR] = useState<number | null>(null);
  const m: Calc = M[cur];

  const pick = (i: number) => {
    setCur(i);
    setVals({});
    setR(null);
  };

  const x: Record<string, number> = {};
  const err: Record<string, string> = {};
  let ok = true;
  for (const f of m.f) {
    const raw = (vals[f.id] ?? '').trim();
    const n = parseFloat(raw);
    if (!raw) ok = false;
    else if (!Number.isFinite(n) || n < f.min || n > f.max) {
      ok = false;
      err[f.id] = `Enter a number from ${f.min} to ${f.max.toLocaleString('en-US')}.`;
    } else x[f.id] = n;
  }
  const max = m.rng.maxFrom && x[m.rng.maxFrom] !== undefined ? Math.min(x[m.rng.maxFrom], m.rng.max) : m.rng.max;
  const rv = r === null ? null : Math.min(r, max);
  const out = ok && rv !== null ? m.calc(x, rv) : null;
  const how = !ok ? WHATIF.fill : rv === null ? WHATIF.slide : out!.how;

  return { cur, pick, m, vals, setVal: (id: string, v: string) => setVals((s) => ({ ...s, [id]: v })), err, rv, setR, max, out, how };
}

type C = ReturnType<typeof useCalc>;

/** The calculator's inputs: each field with its prefix or suffix and its own error line, then the slider. */
function Fields({ c, cls }: { c: C; cls: string }) {
  const id = useId();
  return (
    <div className={`wfx ${cls}`}>
      {c.m.f.map((f) => (
        <div key={`${c.cur}-${f.id}`} className="wfx__f">
          <label htmlFor={`${id}-${f.id}`}>{f.label}</label>
          <div className={`wfx__box${c.err[f.id] ? ' is-bad' : ''}`}>
            {f.pre && <span>{f.pre}</span>}
            <input
              id={`${id}-${f.id}`}
              type="number"
              inputMode="decimal"
              placeholder="Enter"
              value={c.vals[f.id] ?? ''}
              onChange={(e) => c.setVal(f.id, e.target.value)}
            />
            {f.suf && <span>{f.suf}</span>}
          </div>
          {c.err[f.id] && <span className="wfx__err">{c.err[f.id]}</span>}
        </div>
      ))}
      <div className={`wfx__rng${c.rv === null ? ' is-unset' : ''}`}>
        <div className="wfx__rtop">
          <label htmlFor={`${id}-rng`}>{c.m.rng.label}</label>
          <b>{c.rv === null ? '—' : `${c.rv}%`}</b>
        </div>
        <input
          id={`${id}-rng`}
          type="range"
          min={c.m.rng.min}
          max={c.max}
          step={c.m.rng.step}
          value={c.rv ?? c.m.rng.min}
          onChange={(e) => c.setR(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

const Why = ({ c, cls }: { c: C; cls: string }) => (
  <div className={cls}>
    {c.m.why.map(([fig, t]) => (
      <p key={fig}>
        <b>
          {fig}
          <span className="ast">*</span>
        </b>
        <span>{t}</span>
      </p>
    ))}
    <small>
      <Ast t={`${c.m.hero}* ${c.m.heroNote}`} />
    </small>
  </div>
);

const film = (c: C) => ({ title: c.m.tab, len: c.m.vsl.len, clip: 'vsl.mp4', poster: c.m.vsl.poster });

/* ---- A · Grid: telemetry tabs, the film, the inputs on white, the result on a dark board ---- */

export function WhatIfA() {
  const c = useCalc();
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{WHATIF.eye}</span>
        <h2 className="f1-h2">{WHATIF.headline}</h2>
      </header>
      <div className="f1-tabs f1-tabs--scroll" role="tablist" aria-label="Revenue calculators">
        {M.map((m, i) => (
          <button key={m.tab} type="button" role="tab" aria-selected={c.cur === i} className={c.cur === i ? 'is-on' : undefined} onClick={() => c.pick(i)}>
            <span>{m.tab}</span>
            <small>
              {m.hero}
              <span className="ast">*</span>
            </small>
          </button>
        ))}
      </div>

      <Player key={c.cur} film={film(c)} className="f1-head f1-head--short">
        <span className="f1-head__shade" aria-hidden="true" />
        <span className="f1-head__in">
          <span className="f1-head__kick f1-head__kick--line">{c.m.vsl.line}</span>
          <span className="f1-head__row">
            <span className="f1-pill">Watch · {c.m.vsl.len}</span>
            <span className="f1-play" aria-hidden="true">
              <PlayIcon />
            </span>
          </span>
        </span>
      </Player>

      <section className="f1-box">
        <span className="f1-box__k">{WHATIF.why}</span>
        <Why c={c} cls="f1-why" />
      </section>
      <section className="f1-box">
        <span className="f1-box__k">{WHATIF.numbers}</span>
        <Fields c={c} cls="wfx--light" />
      </section>
      <section className="f1-res" aria-live="polite">
        <span className="f1-box__k">{WHATIF.result}</span>
        <b className="f1-res__big">{c.out ? c.out.big : '—'}</b>
        {c.out && <span className="f1-res__per">{c.out.per}</span>}
        <p className="f1-res__how">{c.how}</p>
        <p className="f1-res__fee">{WHATIF.fee}</p>
      </section>
    </div>
  );
}

/* ---- B · Billboard: the lever's film as the billboard, levers as chips, dark panels ---- */

export function WhatIfB() {
  const c = useCalc();
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{WHATIF.eye}</span>
        <h2 className="nf-rowhead__h">{WHATIF.headline}</h2>
      </header>
      <div className="nf-chips" role="tablist" aria-label="Revenue calculators">
        {M.map((m, i) => (
          <button key={m.tab} type="button" role="tab" aria-selected={c.cur === i} className={c.cur === i ? 'is-on' : undefined} onClick={() => c.pick(i)}>
            {m.tab}
          </button>
        ))}
      </div>
      <Player key={c.cur} film={film(c)} className="hb-card hb-card--wide">
        <span className="hb-card__shade" aria-hidden="true" />
        <span className="hb-card__foot hb-card__foot--left">
          <span className="nf-big">
            {c.m.hero}
            <span className="ast">*</span>
          </span>
          <span className="hb-meta hb-meta--left">
            <span className="hb-len">{c.m.vsl.len}</span>
            {c.m.vsl.line}
          </span>
        </span>
        <span className="nf-tile__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </Player>

      <section className="nf-panel">
        <span className="nf-eye">{WHATIF.numbers}</span>
        <Fields c={c} cls="wfx--dark" />
      </section>
      <section className="nf-panel nf-panel--res" aria-live="polite">
        <span className="nf-eye">{WHATIF.result}</span>
        <b className="nf-res__big">{c.out ? c.out.big : '—'}</b>
        {c.out && <span className="nf-res__per">{c.out.per}</span>}
        <p className="nf-res__how">{c.how}</p>
        <p className="nf-res__fee">{WHATIF.fee}</p>
      </section>
      <section className="nf-panel">
        <span className="nf-eye">{WHATIF.why}</span>
        <Why c={c} cls="nf-why" />
      </section>
    </div>
  );
}

/* ---- C · Glass: Revolut's exchange screen, the result as the big balance ---- */

export function WhatIfC() {
  const c = useCalc();
  return (
    <div className="gl">
      <header className="gl-acct gl-acct--tight">
        <span className="gl-acct__lab">{WHATIF.eye}</span>
        <h2 className="gl-acct__bal gl-acct__bal--sm">{WHATIF.headline}</h2>
      </header>
      <div className="gl-chips" role="tablist" aria-label="Revenue calculators">
        {M.map((m, i) => (
          <button key={m.tab} type="button" role="tab" aria-selected={c.cur === i} className={c.cur === i ? 'is-on' : undefined} onClick={() => c.pick(i)}>
            {m.tab}
          </button>
        ))}
      </div>

      <section className="gl-res" aria-live="polite">
        <span className="gl-res__k">{WHATIF.result}</span>
        <b className="gl-res__big">{c.out ? c.out.big : '—'}</b>
        <span className="gl-res__per">{c.out ? c.out.per : c.how}</span>
      </section>

      <section className="gl-box glass">
        <span className="gl-eye">{WHATIF.numbers}</span>
        <Fields c={c} cls="wfx--glass" />
        {c.out && <p className="gl-box__how">{c.how}</p>}
        <p className="gl-box__fee">{WHATIF.fee}</p>
      </section>

      <section className="gl-duo glass" aria-label={c.m.tab}>
        <Player key={c.cur} film={film(c)} className="gl-duo__film">
          <span className="gl-round gl-round--on-film" aria-hidden="true">
            <PlayIcon />
          </span>
        </Player>
        <div className="gl-duo__side">
          <span className="gl-len">Watch · {c.m.vsl.len}</span>
          <b className="gl-duo__line">{c.m.vsl.line}</b>
        </div>
      </section>

      <section className="gl-box glass">
        <span className="gl-eye">{WHATIF.why}</span>
        <Why c={c} cls="gl-why" />
      </section>
    </div>
  );
}
