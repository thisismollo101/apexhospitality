'use client';

import { useState } from 'react';
import { WRONG } from '../data-more';
import { Chevron, PlayIcon, Player } from '../parts';

/*
 * The potential · Wrong Way vs APEX Way. The live page sets the two cards side
 * by side; on a phone each option puts one side on screen at a time and lets
 * the reader switch, so the comparison stays one screen tall.
 */

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY = 86400000;

/** The month from booking to check-in, Monday-first: every one of the 30 days empty, nothing sent. */
function Month({ className }: { className: string }) {
  const c = WRONG.old.calendar;
  const lead = (new Date(c.start).getUTCDay() + 6) % 7;
  const days = Array.from({ length: c.days }, (_, n) => new Date(c.start + n * DAY).getUTCDate());
  return (
    <div className={`cal ${className}`}>
      <span className="cal__kick">{c.kick}</span>
      <div className="cal__grid" aria-label={`${c.kick}: ${c.days} days, nothing sent`}>
        {DOW.map((d) => (
          <span key={d} className="cal__dow" aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`p${i}`} aria-hidden="true" />
        ))}
        {days.map((d, n) => (
          <span key={n} className="cal__d">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The plain reminder text, as in the live Wrong Way phone. */
function Sms({ className }: { className: string }) {
  const s = WRONG.old.sms;
  return (
    <div className={`sms ${className}`}>
      <p className="sms__meta">
        {s.kind}
        <br />
        {s.when}
      </p>
      <p className="sms__bubble">{s.body}</p>
      <div className="sms__input" aria-hidden="true">
        <span>{s.input}</span>
      </div>
    </div>
  );
}

const Side = ({ side, set, className }: { side: 'apex' | 'old'; set: (s: 'apex' | 'old') => void; className: string }) => (
  <div className={className} role="tablist" aria-label={`${WRONG.apex.pill} ${WRONG.vs} ${WRONG.old.pill}`}>
    <button type="button" role="tab" aria-selected={side === 'apex'} className={side === 'apex' ? 'is-on' : undefined} onClick={() => set('apex')}>
      {WRONG.apex.pill}
    </button>
    <button type="button" role="tab" aria-selected={side === 'old'} className={side === 'old' ? 'is-on' : undefined} onClick={() => set('old')}>
      {WRONG.old.pill}
    </button>
  </div>
);

/* ---- A · Grid ------------------------------------------------------------- */

export function WrongWayA() {
  const [side, setSide] = useState<'apex' | 'old'>('apex');
  const [open, setOpen] = useState(0);
  const a = WRONG.apex;
  const o = WRONG.old;
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{WRONG.eye}</span>
        <h2 className="f1-h2">{WRONG.headline}</h2>
      </header>
      <Side side={side} set={setSide} className="f1-tabs" />

      <section className="ha-band ha-band--split">
        <div className="ha-phone ha-phone--sm">
          <div className="ha-phone__screen">
            {side === 'apex' ? (
              <Player film={a.film} className="ha-phone__player">
                <span className="f1-play f1-play--sm" aria-hidden="true">
                  <PlayIcon />
                </span>
              </Player>
            ) : (
              <Sms className="sms--in-phone" />
            )}
          </div>
        </div>
        <div className="ha-split__txt">
          <span className="ha-split__lab">{side === 'apex' ? a.label : o.label}</span>
          <h3 className="ha-split__h">{side === 'apex' ? a.headline : o.headline}</h3>
        </div>
      </section>

      {side === 'apex' ? (
        <ol className="f1-card">
          {a.rows.map((r, i) => {
            const on = open === i;
            return (
              <li key={r.title} className={`f1-row f1-row--btn${on ? ' is-open' : ''}`}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="f1-row__fig f1-row__fig--stack">
                    {r.num}
                    <small>{r.unit}</small>
                  </span>
                  <span className="f1-row__body">
                    <b>{r.title}</b>
                  </span>
                  <Chevron className="ico f1-row__chev" />
                </button>
                <div className="f1-row__more" hidden={!on}>
                  <p>{r.text}</p>
                  <span className="src">
                    <span className="ast">*</span>
                    {r.src}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <Month className="cal--light" />
      )}
    </div>
  );
}

/* ---- B · Billboard -------------------------------------------------------- */

export function WrongWayB() {
  const a = WRONG.apex;
  const o = WRONG.old;
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{WRONG.eye}</span>
        <h2 className="nf-rowhead__h">{WRONG.headline}</h2>
      </header>

      <ul className="nf-row nf-row--duel">
        <li>
          <Player film={a.film} className="nf-tile">
            <span className="nf-tile__shade" aria-hidden="true" />
            <span className="nf-tag nf-tag--apex">{a.pill}</span>
            <span className="nf-tile__play" aria-hidden="true">
              <PlayIcon />
            </span>
            <span className="nf-tile__cap">
              <i className="nf-tile__lab">{a.label}</i>
              <b>{a.headline}</b>
            </span>
          </Player>
        </li>
        <li>
          <div className="nf-tile nf-tile--sms">
            <span className="nf-tag">{o.pill}</span>
            <Sms className="sms--dark" />
            <span className="nf-tile__cap">
              <i className="nf-tile__lab nf-tile__lab--dim">{o.label}</i>
              <b>{o.headline}</b>
            </span>
          </div>
        </li>
      </ul>

      <ol className="nf-eps">
        {a.rows.map((r) => (
          <li key={r.title}>
            <span className="nf-eps__n">
              {r.num}
              <small>{r.unit}</small>
            </span>
            <span className="nf-eps__txt">
              <b>{r.title}</b>
              <span>{r.text}</span>
              <small>
                <span className="ast">*</span>
                {r.src}
              </small>
            </span>
          </li>
        ))}
      </ol>

      <Month className="cal--dark" />
    </div>
  );
}

/* ---- C · Glass ------------------------------------------------------------ */

export function WrongWayC() {
  const [side, setSide] = useState<'apex' | 'old'>('apex');
  const [open, setOpen] = useState(0);
  const a = WRONG.apex;
  const o = WRONG.old;
  return (
    <div className="gl gl--list">
      <span className="gl-eye">{WRONG.eye}</span>
      <h2 className="gl-h gl-h--list">{WRONG.headline}</h2>
      <Side side={side} set={setSide} className="gl-seg2 glass" />

      {side === 'apex' ? (
        <>
          <section className="gl-duo glass" aria-label={a.pill}>
            <Player film={a.film} className="gl-duo__film">
              <span className="gl-round gl-round--on-film" aria-hidden="true">
                <PlayIcon />
              </span>
            </Player>
            <div className="gl-duo__side">
              <span className="gl-len">{a.label}</span>
              <b>{a.headline}</b>
            </div>
          </section>
          <ul className="gl-list glass">
            {a.rows.map((r, i) => {
              const on = open === i;
              return (
                <li key={r.title} className="gl-item gl-item--btn">
                  <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                    <b className="gl-item__ico gl-item__ico--stack">
                      {r.num}
                      <small>{r.unit}</small>
                    </b>
                    <span className="gl-item__txt">
                      <b>{r.title}</b>
                    </span>
                    <Chevron className={`ico gl-item__chev${on ? ' is-on' : ''}`} />
                  </button>
                  <div className="gl-item__more" hidden={!on}>
                    <p>{r.text}</p>
                    <small>
                      <span className="ast">*</span>
                      {r.src}
                    </small>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <section className="gl-chat glass" aria-label={o.pill}>
            <span className="gl-len">{o.label}</span>
            <b className="gl-chat__h">{o.headline}</b>
            <Sms className="sms--glass" />
          </section>
          <Month className="cal--glass glass" />
        </>
      )}
    </div>
  );
}
