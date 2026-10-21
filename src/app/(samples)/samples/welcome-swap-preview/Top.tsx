'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { APEX_WAY, HEADINGS, HERO_G1, JOINED_ROWS, OLD_WAY, SECTION, TOP, VSL, img } from './data';
import WorksAlongside from './WorksAlongside';

/*
 * Welcome Swap Preview: the live Welcome page's top (welcome/TopSections.tsx)
 * copied verbatim, not imported, then swapped (Aidan, 21 Oct): the APEX Way
 * card moves left and the Wrong Way card right, its phone and calendar
 * mirrored, and (Aidan's combined final, 21 Oct) two phones trade films: the
 * APEX Way film plays in the hero phone and the briefing VSL in the APEX Way
 * card's phone. The Wrong Way phone keeps its reminder text, as live. Marked
 * "swap".
 *
 * As on the live page:
 *
 * - the hero: Gradient 1 · Cobalt Sweep, from /samples/hero-data-cards
 *   (hero-data-cards/Hero.tsx), scoped .hd in official.css;
 * - the Wrong Way vs APEX Way section, from /samples/wrong-way-headings
 *   (wrong-way-headings/Joined.tsx), scoped .wx.
 */

/* ==== the hero (hero-data-cards/Hero.tsx) ============================================ */

/**
 * Plays a muted loop while it is on screen and pauses it off; muted is set as
 * a property, since React does not reliably emit the attribute, and reduced
 * motion leaves the poster up.
 */
function useLoop(threshold: number) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold });
    io.observe(v);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

function BgFilm() {
  const ref = useLoop(0.1);
  return (
    <video ref={ref} className="bgfilm" poster={img(TOP.poster)} muted loop playsInline preload="metadata" aria-hidden="true">
      <source src={img(TOP.film)} type="video/mp4" />
    </video>
  );
}

/**
 * The VSL as a phone (thin bezel, notch), its classes hvsl* here rather than the
 * sample's vsl* so the page's own .vsl rules (its tap-to-play films) cannot reach it: the film on a muted loop on its
 * screen, a play button centred on it and the label under the button. There
 * is no cut of the briefing yet, so play starts this film from the top with
 * its sound, and pressing again returns it to the silent loop.
 */
function VslScreen() {
  const ref = useLoop(0.2);
  const [sound, setSound] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.muted) {
      v.currentTime = 0;
      v.muted = false;
    } else v.muted = true;
    setSound(!v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <>
      <video ref={ref} className="hvsl__film" poster={img(VSL.poster)} muted loop playsInline preload="metadata">
        <source src={img(VSL.clipHevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
        <source src={img(VSL.clipWebm)} type="video/webm" />
        <source src={img(VSL.clip)} type="video/mp4" />
      </video>
      <button type="button" className="hvsl__play" onClick={toggle} aria-pressed={sound}>
        <span className="play" aria-hidden="true">
          {sound ? (
            <svg viewBox="0 0 24 24">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M7 4.5l13 7.5-13 7.5z" />
            </svg>
          )}
        </span>
        <span className="hvsl__cta">{VSL.cta}</span>
      </button>
    </>
  );
}

/** A figure, its range dash drawn short with room either side (the dash stays in the text, for copying and reading aloud). */
const Fig = ({ fig }: { fig: [string] | [string, string] }) =>
  fig.length === 1 ? (
    <b>{fig[0]}</b>
  ) : (
    <b>
      {fig[0]}
      <span className="hc__dash">–</span>
      {fig[1]}
    </b>
  );

/**
 * The hero: Gradient 1 · Cobalt Sweep from /samples/hero-data-cards. The root is
 * this page's section-lock frame (#s1, .snap) and carries .hd for its scoped
 * styles; the sample's `hero` class is left off, since .w3page .hero still styles
 * the old hero here.
 */
export function HeroTop() {
  return (
    <section className="hd top hero--g1 snap" id="s1">
      <BgFilm />
      <span className="top__scrim" aria-hidden="true" />
      <div className="wrap top__in">
        {/* swap: the APEX Way film, with its unmute pill, in the hero phone */}
        <div className="hvsl top__vsl">
          <div className="hvsl__screen">
            <LoopScreen />
          </div>
        </div>
        <div className="top__copy">
          {/* the headline's own lines, set as blocks so the copy column is only as wide as what it holds */}
          <h1 className="top__h">
            {HERO_G1.lines.map((l) => (
              <span key={l}>{l} </span>
            ))}
          </h1>
          <ul className="hc">
            {HERO_G1.cards.map((c) => (
              <li key={c.title}>
                <span className="hc__when">
                  <Fig fig={c.fig} />
                </span>
                <span className="hc__txt">
                  <b>{c.title}</b>
                  {typeof c.text === 'string' ? (
                    c.text
                  ) : (
                    // the line set on its two given lines
                    <span className="hc__line">
                      <span>{c.text[0]} </span>
                      <span>{c.text[1]}</span>
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <WorksAlongside />
    </section>
  );
}

/* ==== the Wrong Way vs APEX Way section (wrong-way-headings/Joined.tsx) =============== */

/** The grey source line. Every uncleared figure carries one. */
const Src = ({ children }: { children: React.ReactNode }) => (
  <span className="src">
    <span className="ast">*</span>
    {children}
  </span>
);

/** added: a side's mini heading, the section-heading style (eyebrow, then a two-line display headline). */
function Heading({ h }: { h: { label: string; lines: string[] } }) {
  return (
    <header className="jc__head">
      <span className="eye">{h.label}</span>
      <h3 className="jc__h">
        {h.lines.map((l, i) => (
          <span key={i}>{l} </span>
        ))}
      </h3>
    </header>
  );
}

/* ---- Joined Cards: the two phones -------------------------------------------------- */

/** Card A's phone: the plain reminder text from Aidan's reference, and nothing else. */
function SmsPhone() {
  const s = OLD_WAY.sms;
  return (
    <div className="tphone">
      <div className="tphone__screen sms">
        <p className="sms__meta">
          {s.kind}
          <br />
          {s.when}
        </p>
        <p className="sms__bubble">{s.body}</p>
        <div className="sms__input" aria-hidden="true">
          <span>{s.input}</span>
          <svg viewBox="0 0 16 16">
            <path d="M6 3.5l4.5 4.5L6 12.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const SoundIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path className="snd__cone" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    {on ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
  </svg>
);

/**
 * Card B's phone: the APEX Way film (994 × 1920, with sound) on a continuous
 * loop, and the white unmute pill. It starts muted (the only way a browser lets
 * it start on its own), played by an observer while it is on screen and paused
 * off it; muted is set as a property, since React does not reliably emit the
 * attribute. Reduced motion leaves the poster up until someone presses unmute.
 */
function LoopScreen() {
  const ref = useRef<HTMLVideoElement>(null);
  const film = APEX_WAY.joined;
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return (
    <>
      <video ref={ref} className="tphone__film" poster={img(film.poster)} muted loop playsInline preload="auto">
        <source src={img(film.clipHevc)} type='video/mp4; codecs="hvc1.2.4.L120.B0"' />
        <source src={img(film.clipWebm)} type="video/webm" />
        <source src={img(film.clip)} type="video/mp4" />
      </video>
      <button type="button" className="snd-pill" onClick={toggle} aria-pressed={sound}>
        <SoundIcon on={sound} />
        <span>{sound ? 'Mute' : 'Unmute'}</span>
      </button>
    </>
  );
}

const DAY = 86400000;

/** Card A's calendar: the bar holds only "Booking to check-in", its letters spread edge to edge. */
function QuietMonth() {
  const c = OLD_WAY.calendar;
  const lead = (new Date(c.start).getUTCDay() + 6) % 7;
  const days = Array.from({ length: c.days }, (_, n) => new Date(c.start + n * DAY).getUTCDate());
  return (
    <div className="cal cal--quiet">
      <div className="cal__bar">
        <span className="sr-only">{c.kick}</span>
        <span className="cal__spread" aria-hidden="true">
          {Array.from(c.kick.toUpperCase()).map((ch, i) => (
            <span key={i} className={ch === ' ' ? 'cal__sp' : undefined}>
              {ch === ' ' ? '' : ch}
            </span>
          ))}
        </span>
      </div>
      <div className="cal__dow" aria-hidden="true">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <ol
        className="cal__grid"
        aria-label={`${c.kick}: ${c.days} days, nothing sent`}
        style={{ gridTemplateRows: `repeat(${Math.ceil((lead + c.days) / 7)}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: lead }, (_, i) => (
          <li key={`pad-${i}`} className="cal__pad" aria-hidden="true" />
        ))}
        {days.map((dom, n) => (
          <li key={n} className="cal__d">
            {dom}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Card B's rows: everything in a row left-aligned (timing, then title, chevron
 * at the far right), every row the same height when closed, stacked with small
 * even gaps and centred on the phone. One open at a time; while one is open the
 * others tighten to a single line, and the source line shows only inside an
 * open row.
 */
function CompactRows() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLOListElement>(null);
  const id = useId();

  // Mark the rows whose title the two-line clamp actually cuts, so only those repeat it in full when open.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mark = () =>
      el.querySelectorAll<HTMLElement>('.cr__title').forEach((t) => {
        t.closest('li')?.toggleAttribute('data-clamped', t.scrollHeight > t.clientHeight + 1);
      });
    mark();
    document.fonts?.ready.then(mark);
    const ro = new ResizeObserver(mark);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // If the list has to scroll, keep the opened row in view once it has grown.
  useEffect(() => {
    const el = ref.current;
    if (!el || open === null) return;
    const t = window.setTimeout(() => {
      const li = el.children[open] as HTMLElement;
      if (li.offsetTop < el.scrollTop) el.scrollTop = li.offsetTop;
      else if (li.offsetTop + li.offsetHeight > el.scrollTop + el.clientHeight) el.scrollTop = li.offsetTop + li.offsetHeight - el.clientHeight;
    }, 320);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <ol className={`cr${open !== null ? ' has-open' : ''}`} ref={ref}>
      {JOINED_ROWS.map((r, n) => {
        const on = open === n;
        return (
          <li key={r.title} className={on ? 'is-open' : undefined}>
            <button type="button" aria-expanded={on} aria-controls={`${id}-${n}`} onClick={() => setOpen(on ? null : n)}>
              <span className="cr__when">
                <b>{r.num}</b>
                <small>{r.unit}</small>
              </span>
              <span className="cr__title" title={r.title}>
                {r.title}
              </span>
              <span className="chev" aria-hidden="true" />
            </button>
            <div className="cr__more" id={`${id}-${n}`}>
              <div className="cr__in">
                <div className="cr__pad">
                  <b className="cr__full">{r.title}</b>
                  <p>{r.text}</p>
                  <Src>{r.src}</Src>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---- Joined Cards: Bottom 1 ----------------------------------------------------------
   Two cards, each an info panel and a phone panel, joined side by side so they
   read as one. swap: [B phone] [B info] [A phone] [A info], the APEX Way card
   first and the Wrong Way card mirrored so its phone leads. */

function JoinedCards() {
  return (
    <div className="jc">
      <span className="jc__vs" aria-hidden="true">
        vs
      </span>
      {/* swap: the APEX Way card on the left, the Wrong Way card on the right */}
      <article className="jc__card jc__card--b" aria-label={APEX_WAY.title}>
        <div className="jc__media jc__media--b">
          <span className="tag tag--apex jc__pill">{APEX_WAY.pill}</span>
          {/* swap: the briefing VSL, from the hero, in the APEX Way phone */}
          <div className="tphone">
            <div className="tphone__screen">
              <VslScreen />
            </div>
          </div>
        </div>
        {/* added: the heading over the four rows, both inside a frame exactly the phone's height, level with it */}
        <div className="jc__info">
          <div className="jc__fit">
            <Heading h={HEADINGS.apex} />
            <CompactRows />
          </div>
        </div>
      </article>
      <article className="jc__card jc__card--a" aria-label={OLD_WAY.title}>
        {/* swap: mirrored, the phone first and the calendar after it */}
        <div className="jc__media jc__media--a">
          <span className="tag tag--old jc__pill">{OLD_WAY.pill}</span>
          <SmsPhone />
        </div>
        <div className="jc__info jc__info--a">
          <div className="jc__fit jc__fit--a">
            <Heading h={HEADINGS.wrong} />
            <QuietMonth />
          </div>
        </div>
      </article>
    </div>
  );
}

/** The Joined Cards section, on night, directly under the hero; its own section-lock frame. */
export function JoinedSection() {
  return (
    <section className="wx bot bj snap" id="s1j" aria-label={`${OLD_WAY.pill} vs ${APEX_WAY.pill}`}>
      <div className="wrap wrap--wide">
        <div className="jc-scale">
          {/* added: the section heading, in the live "Why it works" heading's style */}
          <header className="sec-head">
            <span className="eye">{SECTION.label}</span>
            <h2 className="sec-head__h">
              {SECTION.lines[0]}
              <br className="brk" /> {SECTION.lines[1]}
            </h2>
          </header>
          <JoinedCards />
        </div>
      </div>
    </section>
  );
}
