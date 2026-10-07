'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { ARRIVAL, BOOKED, MILESTONES, PHONE, WORKS, daysLeft, img, type Milestone } from './data';
import { Clip, Option, PlayIcon, Player } from './parts';

/*
 * C · What Works. Round 1's Thread is dropped. Tabs, Calendar, Countdown and the
 * pull-up sheet come back reworked to Aidan's notes, plus one new F1-style list.
 */

const B = 'C · WHAT WORKS';

function Head({ light = false }: { light?: boolean }) {
  return (
    <div className={`bhead${light ? ' bhead--light' : ''}`}>
      <span className="eye">{WORKS.eye}</span>
      <h2>{WORKS.headline}</h2>
    </div>
  );
}

/** A milestone's film, full screen, on tap. */
function useFilm() {
  const [m, setM] = useState<Milestone | null>(null);
  const node = m ? <Player src={m.clip} poster={m.poster} title={`${m.when}: ${m.what}`} onClose={() => setM(null)} /> : null;
  return { play: setM, node };
}

/** The message as the guest gets it: sender row, the line, the time, the one-tap reply. */
function Message({ m }: { m: Milestone }) {
  return (
    <div className="msg">
      <div className="msg__who">
        <span className="phone__av">A</span>
        <span>
          {PHONE.who}
          <small>{PHONE.verified}</small>
        </span>
        <span className="msg__time">
          {m.date} · {m.time}
        </span>
      </div>
      <p>{m.msg}</p>
      <span className="chip">{m.chip}</span>
    </div>
  );
}

/* ---- 1 · Segmented tabs, snap-locked ------------------------------------------
   The tabs stay pinned while the four milestones snap past beneath them, one per
   swipe. Swiping moves the tab; tapping a tab snaps to its milestone. */
function SnapTabs() {
  const film = useFilm();
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const onScroll = () => {
    const b = box.current;
    if (b) setI(Math.min(MILESTONES.length - 1, Math.round(b.scrollTop / b.clientHeight)));
  };
  const go = (n: number) => {
    const b = box.current;
    if (b) b.scrollTo({ top: n * b.clientHeight, behavior: 'smooth' });
  };
  return (
    <Option block={B} n={1} name="Segmented tabs, snap-locked" note="Liked in round 1, rebuilt: the four segments stay pinned and each milestone snap-locks into view as you swipe, as one clean card (film, countdown, then the message the guest receives).">
      <div className="hc1">
        <Head />
        <div className="hc1__sub">
          <span className="tl__kick">{WORKS.kick}</span>
          <b>{WORKS.title}</b>
        </div>
        <div className="seg" role="tablist" aria-label="The four films">
          {MILESTONES.map((t, n) => (
            <button key={t.when + n} type="button" role="tab" aria-selected={n === i} onClick={() => go(n)}>
              {t.when}
            </button>
          ))}
        </div>
        <div className="hc1__snap" ref={box} onScroll={onScroll}>
          {MILESTONES.map((m, n) => (
            <section key={m.when + n} className="hc1__panel" aria-label={`${m.when}: ${m.what}`}>
              <button type="button" className="hc1__film" onClick={() => film.play(m)} aria-label={`Play: ${m.what}`}>
                <Clip src={m.clip} poster={m.poster} />
                <span className="hc1__what">{m.what}</span>
                <span className="hc1__dur">
                  <PlayIcon size={22} /> {m.dur}
                </span>
              </button>
              <div className="hc1__meter">
                <span>Day {m.day}</span>
                <span>{daysLeft(m.day)}</span>
              </div>
              <div className="hc1__bar">
                <span style={{ width: `${Math.round((m.day / 30) * 100)}%` }} />
              </div>
              <Message m={m} />
              {n < MILESTONES.length - 1 && <span className="hc1__next">Next: {MILESTONES[n + 1].when} ↓</span>}
            </section>
          ))}
        </div>
        <p className="foot">{WORKS.foot}</p>
      </div>
      {film.node}
    </Option>
  );
}

/* ---- 2 · Month calendar --------------------------------------------------------
   One full-screen block holding the real month: Monday-first, Mon 3 Nov to Tue
   2 Dec. The send days are events with bigger windows and their film in them;
   tap one and its detail slides up. */
const START = Date.UTC(2025, 10, 3); // Mon 3 Nov — booked, and Day 1's send
const DAY = 86400000;

type Ev = { kind: 'send'; m: Milestone } | { kind: 'arrive' };

function Calendar() {
  const film = useFilm();
  const [sel, setSel] = useState<number | null>(null); // day number, 1..30
  const days = Array.from({ length: 30 }, (_, n) => {
    const d = new Date(START + n * DAY);
    const day = n + 1;
    const m = MILESTONES.find((x) => x.day === day);
    const ev: Ev | null = m ? { kind: 'send', m } : day === 30 ? { kind: 'arrive' } : null;
    return { day, dom: d.getUTCDate(), mon: d.getUTCMonth(), ev };
  });
  const cur = sel === null ? null : days[sel - 1];
  return (
    <Option block={B} n={2} name="Month calendar" note="Liked in round 1, rebuilt as one full-screen block with a real Monday-first month. Booked on Mon 3 Nov, each send day an event with a bigger window and its film, ending at arrival. Tap an event for its detail.">
      <div className="hc2">
        <Head />
        <div className="hc2__top">
          <span className="tl__kick">{WORKS.kick}</span>
          <strong>{cur?.ev?.kind === 'arrive' ? `${ARRIVAL.label} · ${ARRIVAL.date}` : daysLeft(cur?.ev?.kind === 'send' ? cur.ev.m.day : 1)}</strong>
        </div>
        <div className="hc2__month">
          <div className="hc2__dow" aria-hidden="true">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <ol className="hc2__grid">
            {days.map((d) => {
              const first = d.dom === 1;
              if (!d.ev)
                return (
                  <li key={d.day} className="hc2__d">
                    {first && <small>Dec</small>}
                    {d.dom}
                  </li>
                );
              const isSel = sel === d.day;
              return (
                <li key={d.day} className={`hc2__d hc2__ev${d.ev.kind === 'arrive' ? ' hc2__ev--arrive' : ''}${isSel ? ' is-sel' : ''}`}>
                  <button type="button" onClick={() => setSel(isSel ? null : d.day)} aria-pressed={isSel}>
                    {d.ev.kind === 'send' && <img src={img(d.ev.m.poster)} alt="" />}
                    <span className="hc2__num">
                      {first && <small>Dec </small>}
                      {d.dom}
                    </span>
                    <span className="hc2__lab">
                      {d.ev.kind === 'send' ? (d.day === 1 ? `${BOOKED.label} · ${d.ev.m.when}` : d.ev.m.when) : ARRIVAL.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="hc2__legend">
            <i /> Film sent <i className="is-arrive" /> {ARRIVAL.label}
          </p>
        </div>
        <div className={`hc2__sheet${cur ? ' is-on' : ''}`} aria-live="polite">
          {cur?.ev?.kind === 'send' && (
            <>
              <div className="hc2__sheethead">
                <b>{cur.day === 1 ? `${BOOKED.label} · ${BOOKED.date}` : cur.ev.m.date}</b>
                <button type="button" onClick={() => setSel(null)} aria-label="Close">
                  ×
                </button>
              </div>
              <button type="button" className="hc2__film" onClick={() => cur.ev?.kind === 'send' && film.play(cur.ev.m)}>
                <img src={img(cur.ev.m.poster)} alt="" />
                <span>
                  <b>{cur.ev.m.when}</b>
                  {cur.ev.m.what}
                  <em>
                    <PlayIcon size={20} /> {cur.ev.m.dur}
                  </em>
                </span>
              </button>
              <Message m={cur.ev.m} />
            </>
          )}
          {cur?.ev?.kind === 'arrive' && (
            <>
              <div className="hc2__sheethead">
                <b>
                  {ARRIVAL.label} · {ARRIVAL.date}
                </b>
                <button type="button" onClick={() => setSel(null)} aria-label="Close">
                  ×
                </button>
              </div>
              <p className="hc2__arrive">“{ARRIVAL.note}”</p>
              <p className="foot">{WORKS.foot}</p>
            </>
          )}
          {!cur && <p className="hc2__tip">Tap a lit day to see what goes out.</p>}
        </div>
      </div>
      {film.node}
    </Option>
  );
}

/* ---- 3 · Tight countdown ----------------------------------------------------------
   The small Day 1 / 48 hours counter is back, tightened into one pinned bar that
   also carries the film. As you scroll, the bar switches to the milestone you're
   on and its film plays in the thumbnail; tap the bar to watch it full screen. */
function Countdown() {
  const film = useFilm();
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const measure = () => {
      const mid = window.innerHeight * 0.5;
      let s = 0;
      rows.current.forEach((el, n) => {
        if (el && el.getBoundingClientRect().top < mid) s = n;
      });
      setStep(s);
    };
    const id = requestAnimationFrame(measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', measure);
    };
  }, []);
  const m = MILESTONES[step];
  return (
    <Option block={B} n={3} name="Tight countdown" note="Round 1's countdown, tightened. One pinned bar holds the counter and the film: it switches to the milestone you've scrolled to, plays that film in the thumbnail, and opens it full screen on tap.">
      <div className="hc3">
        <Head />
        <button type="button" className="hc3__bar" onClick={() => film.play(m)} aria-label={`Watch: ${m.what}`}>
          <span className="hc3__thumb">
            <Clip key={m.clip} src={m.clip} poster={m.poster} />
            <PlayIcon size={20} />
          </span>
          <span className="hc3__now">
            <small>Now playing · {m.dur}</small>
            <b>
              {m.when} · {m.what}
            </b>
          </span>
          <span className="hc3__left">
            <b>{30 - m.day}</b>
            <small>days to arrival</small>
          </span>
        </button>
        <ol className="hc3__list" style={{ '--fill': `${((step + 1) / MILESTONES.length) * 100}%` } as React.CSSProperties}>
          {MILESTONES.map((x, n) => (
            <li
              key={x.when + n}
              ref={(el) => {
                rows.current[n] = el;
              }}
              className={n <= step ? 'is-on' : ''}
            >
              <span className="hc3__when">{x.when}</span>
              <span className="hc3__what">{x.what}</span>
              <span className="hc3__date">
                {x.date} · {x.time}
              </span>
              <p>{x.msg}</p>
            </li>
          ))}
        </ol>
        <p className="foot">{WORKS.foot}</p>
      </div>
      {film.node}
    </Option>
  );
}

/* ---- 4 · Phone + four-box sheet ----------------------------------------------------
   Kept from round 1: the pull-up sheet and its four little boxes. Changed: the top
   is no longer a lone video but the guest's phone showing the selected film as it
   arrives. Tap a box to switch; pull the sheet up for the detail. */
function PhoneSheet() {
  const film = useFilm();
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const m = MILESTONES[i];
  return (
    <Option block={B} n={4} name="Phone + four-box sheet" note="Kept the pull-up sheet and its four little boxes; replaced the lone video with the guest's phone showing the selected film arriving. Tap a box to switch it, pull up for the detail.">
      <div className={`hc4${open ? ' is-open' : ''}`}>
        <div className="hc4__top">
          <Head light />
          <div className="hc4__phone">
            <div className="phone">
              <div className="phone__screen">
                <div className="phone__top">
                  <span className="phone__av">A</span>
                  <span className="phone__who">
                    {PHONE.who}
                    <small>{PHONE.verified}</small>
                  </span>
                </div>
                <div className="phone__chat" key={i}>
                  <span className="phone__date">{m.date}</span>
                  <button type="button" className="bubble hc4__bubble" onClick={() => film.play(m)} aria-label={`Play: ${m.what}`}>
                    <span className="bubble__vid">
                      <Clip src={m.clip} poster={m.poster} />
                      <span className="bubble__dur">{m.dur}</span>
                    </span>
                    <span className="hc4__msg">{m.msg}</span>
                    <span className="bubble__time">{m.time}</span>
                  </button>
                  <span className="chip">{m.chip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hc4__sheet">
          <button type="button" className="hc4__grip" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <i aria-hidden="true" />
            <span>
              <b>{WORKS.kick}</b>
              {WORKS.title}
            </span>
          </button>
          <ol className="hc4__boxes">
            {MILESTONES.map((x, n) => (
              <li key={x.when + n}>
                <button type="button" aria-pressed={n === i} onClick={() => setI(n)}>
                  <b>{x.when}</b>
                  <span>{x.what}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="hc4__detail">
            <div className="hc4__row">
              <span>Day {m.day}</span>
              <b>{daysLeft(m.day)}</b>
            </div>
            <div className="b3__bar">
              <span style={{ width: `${Math.round((m.day / 30) * 100)}%` }} />
            </div>
            <button type="button" className="pill pill--dark" onClick={() => film.play(m)}>
              <PlayIcon size={22} /> {m.what} · {m.dur}
            </button>
            <p className="foot">{WORKS.foot}</p>
          </div>
        </div>
      </div>
      {film.node}
    </Option>
  );
}

/* ---- 5 · Race-schedule list (F1, new) ----------------------------------------------
   The F1 app's schedule: a full-bleed photo header, then a clean light list. Big
   date block on the left, the film's name, its status, and a chevron that opens
   the row to the message and its film. */
function RaceSchedule() {
  const film = useFilm();
  const [open, setOpen] = useState<number | null>(0);
  const rows = [
    ...MILESTONES.map((m) => ({ key: m.when + m.day, m, date: m.date })),
    { key: 'arrive', m: null as Milestone | null, date: ARRIVAL.date },
  ];
  return (
    <Option block={B} n={5} name="Race-schedule list" note="New, from the F1 app: a full-bleed photo header, then a clean light list with a big date block, the film's name, its status, and a chevron that opens each row to its message and film.">
      <div className="hc5">
        <div className="hc5__head">
          <Clip src="m0.mp4" poster="m0.jpg" />
          <div className="hc5__in">
            <span className="eye eye--light">{WORKS.eye}</span>
            <h2>{WORKS.headline}</h2>
          </div>
        </div>
        <div className="hc5__body">
          <div className="hc5__sub">
            <span className="tl__kick">{WORKS.kick}</span>
            <b>{WORKS.title}</b>
          </div>
          <ol className="hc5__list">
            {rows.map((r, n) => {
              const [, dd, mon] = r.date.split(' ');
              const on = open === n;
              return (
                <li key={r.key} className={`${on ? 'is-open' : ''}${r.m ? '' : ' is-arrive'}`}>
                  <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : n)}>
                    <span className="hc5__date">
                      <b>{dd.padStart(2, '0')}</b>
                      <small>{mon}</small>
                    </span>
                    <span className="hc5__name">
                      <b>{r.m ? r.m.what : ARRIVAL.label}</b>
                      <small>{r.m ? `${r.m.when} · ${daysLeft(r.m.day)}` : ARRIVAL.note}</small>
                    </span>
                    <span className="chev" aria-hidden="true" />
                  </button>
                  {r.m && (
                    <div className="hc5__more">
                      <button type="button" className="hc5__film" onClick={() => r.m && film.play(r.m)} aria-label={`Play: ${r.m.what}`}>
                        <img src={img(r.m.poster)} alt="" />
                        <PlayIcon size={30} />
                        <span>{r.m.dur}</span>
                      </button>
                      <Message m={r.m} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="foot">{WORKS.foot}</p>
        </div>
      </div>
      {film.node}
    </Option>
  );
}

export default function WorksOptions() {
  return (
    <>
      <SnapTabs />
      <Calendar />
      <Countdown />
      <PhoneSheet />
      <RaceSchedule />
    </>
  );
}
