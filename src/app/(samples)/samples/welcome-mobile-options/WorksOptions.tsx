'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { MILESTONES, WORKS, daysLeft, img } from './data';
import { Bubble, Option, Phone, PlayIcon, Vsl } from './parts';

const B = 'WHAT WORKS';

function Head({ light = false }: { light?: boolean }) {
  return (
    <div className={`bhead${light ? ' bhead--light' : ''}`}>
      <span className="eye">{WORKS.eye}</span>
      <h2>{WORKS.headline}</h2>
    </div>
  );
}

/** Which of a list of elements has most recently crossed the middle of the screen. */
function useScrollStep(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const els = refs.current.slice(0, count).filter(Boolean) as HTMLElement[];
    const measure = () => {
      const mid = window.innerHeight * 0.55;
      let s = -1;
      els.forEach((el, n) => {
        if (el.getBoundingClientRect().top < mid) s = n;
      });
      setStep(s);
    };
    const first = requestAnimationFrame(measure);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [count]);
  return { refs, step };
}

/* ---- 1 · Scroll countdown ---------------------------------------------------
   A vertical rail that fills as you scroll, with the "days to arrival" counter
   pinned at the top ticking down as each milestone is reached. */
function Countdown() {
  const { refs, step } = useScrollStep(MILESTONES.length);
  const at = Math.max(0, step);
  const fill = step < 0 ? 0 : ((step + 1) / MILESTONES.length) * 100;
  return (
    <Option block={B} n={1} name="Scroll countdown" note="A vertical timeline that fills as you scroll; the pinned counter ticks down the days to arrival as each film lands.">
      <div className="b1">
        <Head />
        <Vsl poster={WORKS.poster} tag={WORKS.tag} className="vsl--wide" />
        <div className="b1__count">
          <span className="tl__kick">{WORKS.kick}</span>
          <strong>{daysLeft(MILESTONES[at].day)}</strong>
          <span className="b1__day">Day {MILESTONES[at].day}</span>
        </div>
        <ol className="b1__rail" style={{ '--fill': `${fill}%` } as React.CSSProperties}>
          {MILESTONES.map((m, n) => (
            <li
              key={m.when + n}
              ref={(el) => {
                refs.current[n] = el;
              }}
              className={n <= step ? 'is-on' : ''}
            >
              <span className="b1__when">{m.when}</span>
              <span className="b1__what">{m.what}</span>
              <Bubble m={m} compact />
            </li>
          ))}
        </ol>
        <p className="foot">{WORKS.foot}</p>
      </div>
    </Option>
  );
}

/* ---- 2 · The thread ---------------------------------------------------------
   The whole block is the guest's phone. Each film arrives in the WhatsApp
   thread as you scroll, with the live countdown as the date stamp. */
function Thread() {
  const { refs, step } = useScrollStep(MILESTONES.length);
  return (
    <Option block={B} n={2} name="The thread" note="Phone-in-phone: the guest's WhatsApp thread fills in as you scroll, one film per message, dated like the real sends.">
      <div className="b2">
        <Head light />
        <p className="b2__lede">
          <b>{WORKS.kick}</b> — {WORKS.title}
        </p>
        <Phone className="phone--tall">
          {MILESTONES.map((m, n) => (
            <div
              key={m.when + n}
              ref={(el) => {
                refs.current[n] = el;
              }}
              className={`b2__msg${n <= step ? ' is-in' : ''}`}
            >
              <span className="phone__date">
                {m.date} · {daysLeft(m.day)}
              </span>
              <Bubble m={m} />
              <span className="chip">{m.chip}</span>
            </div>
          ))}
        </Phone>
        <Vsl poster={WORKS.poster} tag={WORKS.tag} className="vsl--wide" />
        <p className="foot foot--light">{WORKS.foot}</p>
      </div>
    </Option>
  );
}

/* ---- 3 · Segmented tabs -----------------------------------------------------
   Four tabs across the top; each swaps the still, the message and the meter. */
function Tabs() {
  const [i, setI] = useState(0);
  const m = MILESTONES[i];
  return (
    <Option block={B} n={3} name="Segmented tabs" note="One control, four segments: Day 1 / 48 hours / 7 days out / 48 hours out. Each swaps the film, the message and the meter.">
      <div className="b3">
        <Head />
        <Vsl poster={WORKS.poster} tag={WORKS.tag} className="vsl--wide" />
        <span className="tl__kick">{WORKS.kick}</span>
        <h3 className="b3__title">{WORKS.title}</h3>
        <div className="seg" role="tablist" aria-label="The four films">
          {MILESTONES.map((t, n) => (
            <button key={t.when + n} type="button" role="tab" aria-selected={n === i} onClick={() => setI(n)}>
              {t.when}
            </button>
          ))}
        </div>
        <div className="b3__panel" key={i} role="tabpanel">
          <div className="b3__meter">
            <span>Day {m.day}</span>
            <span>{daysLeft(m.day)}</span>
          </div>
          <div className="b3__bar">
            <span style={{ width: `${Math.round((m.day / 30) * 100)}%` }} />
          </div>
          <div className="b3__still">
            <img src={img(m.img)} alt="" />
            <span className="b3__what">{m.what}</span>
          </div>
          <div className="b3__msg">
            <span className="phone__date">{m.date}</span>
            <Bubble m={m} compact />
            <span className="chip">{m.chip}</span>
          </div>
        </div>
        <p className="foot">{WORKS.foot}</p>
      </div>
    </Option>
  );
}

/* ---- 4 · Calendar strip -----------------------------------------------------
   The thirty days from booking to arrival as a swipeable date strip. The four
   send days are lit; tap one to see what goes out. */
const CAL_START = Date.UTC(2025, 10, 3); // Mon 3 Nov, the live journey's Day 1
const DAY_MS = 86400000;
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Calendar() {
  const [sel, setSel] = useState(0);
  // Day 1 to Day 29; Day 30 is the arrival, "See you on the 2nd".
  const days = Array.from({ length: 29 }, (_, n) => {
    const d = new Date(CAL_START + n * DAY_MS);
    const day = n + 1;
    const mi = MILESTONES.findIndex((m) => m.day === day);
    return { day, wd: WD[d.getUTCDay()], dom: d.getUTCDate(), mon: MON[d.getUTCMonth()], mi };
  });
  const m = MILESTONES[sel];
  return (
    <Option block={B} n={4} name="Calendar strip" note="The 30 days from booking to arrival as a swipeable date strip, with the four send days lit. Tap a lit day to see that send.">
      <div className="b4">
        <Head />
        <span className="tl__kick">{WORKS.kick}</span>
        <h3 className="b4__title">{WORKS.title}</h3>
        <ol className="b4__strip" aria-label="Booking to check-in">
          {days.map((d) => (
            <li key={d.day}>
              {d.mi >= 0 ? (
                <button
                  type="button"
                  className={`b4__d is-send${d.mi === sel ? ' is-sel' : ''}`}
                  onClick={() => setSel(d.mi)}
                  aria-pressed={d.mi === sel}
                  aria-label={`${MILESTONES[d.mi].when}: ${MILESTONES[d.mi].what}`}
                >
                  <small>{d.wd}</small>
                  <b>{d.dom}</b>
                  <small>{d.mon}</small>
                </button>
              ) : (
                <span className="b4__d">
                  <small>{d.wd}</small>
                  <b>{d.dom}</b>
                  <small>{d.mon}</small>
                </span>
              )}
            </li>
          ))}
          <li>
            <span className="b4__d b4__d--arrive">
              <small>Arrive</small>
              <b>2</b>
              <small>Dec</small>
            </span>
          </li>
        </ol>
        <div className="b4__card" key={sel}>
          <div className="b4__cardhead">
            <b>{m.when}</b>
            <span>{daysLeft(m.day)}</span>
          </div>
          <p className="b4__what">{m.what}</p>
          <Bubble m={m} />
          <span className="chip">{m.chip}</span>
        </div>
        <Vsl poster={WORKS.poster} tag={WORKS.tag} className="vsl--wide" />
        <p className="foot">{WORKS.foot}</p>
      </div>
    </Option>
  );
}

/* ---- 5 · Film with a pull-up sheet ------------------------------------------
   The VSL takes the whole screen. The journey lives in a bottom sheet over it
   that pulls up on tap, the way a maps or music app does. */
function SheetOver() {
  const [open, setOpen] = useState(false);
  return (
    <Option block={B} n={5} name="Film with a pull-up sheet" note="The VSL fills the screen; the four-step journey and the phone live in a bottom sheet you pull up over it.">
      <div className={`b5${open ? ' is-open' : ''}`}>
        <img className="b5__bg" src={img(WORKS.poster)} alt="" />
        <div className="b5__top">
          <Head light />
        </div>
        <button className="b5__play" type="button" aria-label="Play the video">
          <PlayIcon size={72} />
          <span>{WORKS.tag}</span>
        </button>
        <div className="b5__sheet">
          <button className="b5__grip" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <i aria-hidden="true" />
            <span>
              <b>{WORKS.kick}</b>
              {WORKS.title}
            </span>
          </button>
          <ol className="b5__steps">
            {MILESTONES.map((m, n) => (
              <li key={m.when + n}>
                <b>{m.when}</b>
                <span>{m.what}</span>
              </li>
            ))}
          </ol>
          <div className="b5__more">
            <Phone className="phone--mini">
              <span className="phone__date">{MILESTONES[0].date}</span>
              <Bubble m={MILESTONES[0]} compact />
              <span className="chip">{MILESTONES[0].chip}</span>
            </Phone>
            <p className="foot">
              <b>{daysLeft(MILESTONES[0].day)}</b>
              {WORKS.foot}
            </p>
          </div>
        </div>
      </div>
    </Option>
  );
}

export default function WorksOptions() {
  return (
    <>
      <Countdown />
      <Thread />
      <Tabs />
      <Calendar />
      <SheetOver />
    </>
  );
}
