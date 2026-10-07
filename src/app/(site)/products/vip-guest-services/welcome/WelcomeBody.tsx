import Link from 'next/link';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import Behaviors from './Behaviors';
import { GUESTS, MARQUEE_CLIPS, REEL, SOURCES, TOUCHPOINTS, WHEN, img } from './data';

/*
 * Apex Welcome: the design artifact, ported as it stands.
 *
 * Static markup is rendered here on the server. Everything that moves (VSL
 * play buttons, the journey phone, the reel, the guest-type switcher, the
 * calculators, the opened sheet, the section lock) is wired up by
 * Behaviors.tsx, which runs the artifact's own scripts against this markup.
 *
 * The artifact carries its own palette and display face. They are kept for this
 * pass and scoped under .w3page so they cannot reach the chrome.
 */
const display = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--w3-display',
});
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--w3-body' });

const PLAY = (
  <span className="vsl__btn">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4l14 8-14 8z" />
    </svg>
  </span>
);

const EX = (
  <span className="ex" aria-hidden="true">
    <svg viewBox="0 0 14 14">
      <path d="M1 5V1h4M13 9v4H9" />
    </svg>
  </span>
);

const A = <span className="ast">*</span>;

/** A tap-to-play VSL. Placeholder film until each cut lands. */
function Vsl({ poster, tag, className = 'vsl', preload = 'metadata', children }: {
  poster: string;
  tag?: string;
  className?: string;
  preload?: 'none' | 'metadata';
  children?: React.ReactNode;
}) {
  return (
    <figure className={className}>
      <video src={img('vsl.mp4')} poster={img(poster)} playsInline preload={preload} />
      <button className="vsl__play" type="button" aria-label="Play the video">
        {PLAY}
      </button>
      {tag && <figcaption className="vsl__tag">{tag}</figcaption>}
      {children}
    </figure>
  );
}

function Split({ image, fig, title, text, src }: { image: string; fig: string; title: string; text: string; src: string }) {
  return (
    <li className="split">
      <div className="split__art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(image)} alt="" />
        <span className="split__fig">{fig}</span>
      </div>
      <div className="split__body">
        <h3>{title}</h3>
        <p>{text}</p>
        <p className="split__src">
          {A}
          {src}
        </p>
      </div>
    </li>
  );
}

/** Built on Subtraction: each card names what it gives you, then opens to the detail. */
const SUBTRACTION = [
  {
    k: 'Dream',
    title: 'Every Asset, Working.',
    stat: (
      <>
        <strong>18%+{A}</strong> of hotel income is ancillary revenue [P15-3]
      </>
    ),
    back: 'Every outlet filmed and put to work before arrival: the dining room, the spa, the suites, the events.',
    items: [
      <>
        <strong>18%+{A}</strong> Ancillary revenue is more than 18% of total hotel income (Cloudbeds, vendor data) [P15-3].
      </>,
      <>
        <strong>Every outlet.</strong> Dining, spa, suites and events, each with its own film.
      </>,
    ],
  },
  {
    k: 'Likelihood',
    title: 'Your Property, Your People.',
    stat: (
      <>
        <strong>Never</strong> stock footage
      </>
    ),
    back: 'Never stock footage. Your rooms, your outlets, and your staff as the stars.',
    items: [
      <>
        <strong>Your property.</strong> Every frame filmed on site, at your hotel.
      </>,
      <>
        <strong>Real voices.</strong> Cloned from your own team, ideally the GM.
      </>,
    ],
  },
  {
    k: 'Time',
    title: 'One Residency. Then Live.',
    stat: (
      <>
        <strong>4–5 days</strong> on site, one filming residency
      </>
    ),
    back: 'A single 4–5 day filming residency at your property. That is the whole production.',
    items: [
      <>
        <strong>Taster film.</strong> In your hands right after signing.
      </>,
      <>
        <strong>One residency.</strong> No return shoots, no crew in the lobby every month.
      </>,
    ],
  },
  {
    k: 'Effort',
    title: 'Zero Operational Burden.',
    stat: (
      <>
        <strong>1</strong> monthly offers meeting
      </>
    ),
    back: "Once your manager's voice is recorded, it runs with no daily staff involvement.",
    items: [
      <>
        <strong>One monthly offers meeting.</strong> The only ongoing commitment.
      </>,
      <>
        <strong>Its own platform.</strong> Alongside your PMS. No replacement, no overhaul, no integration project.
      </>,
    ],
  },
];

export default function WelcomeBody() {
  return (
    <div className={`w3page ${display.variable} ${body.variable}`} id="w3">
      {/* =================== SECTION 1 · PART 1 — HERO =================== */}
      <section className="hero" id="s1">
        <video className="hero__video" src={img('hero.mp4')} muted loop playsInline preload="auto" />
        <div className="hero__scrim" aria-hidden="true" />
        <span className="hero__mark">
          Apex <em>Hospitality</em>
        </span>
        <div className="wrap hero__inner">
          <h1 className="hero__title">
            <span className="ln">This Is the Single Largest</span>
            <br className="brk" /> <span className="ln">Commercial Leak on Your P&amp;L.</span>
          </h1>
          <ul className="hero__pts">
            <li>
              Front desk check-in upsells convert at <b>2% to 5%</b>.{A}
            </li>
            <li>
              Data Driven Mobile Cinema converts at <b>15% to 25%</b>.{A}
            </li>
            <li>
              <b>5x</b> your pre-arrival revenue, with zero staff labor.
            </li>
          </ul>
        </div>
      </section>

      {/* =================== SECTION 1 · PART 2 — VSL + THREE CARDS =================== */}
      <section className="intro" id="s1b">
        <div className="wrap snap">
          <span className="eye">Why it works</span>
          <h2 className="intro__h">
            Your Revenue Walks Out the Door
            <br className="brk" /> Before Your Guest Walks In.
          </h2>
          <ul className="quad">
            <li>
              <Vsl poster="vsl-poster.jpg" tag="Watch · 1:30" />
            </li>
            <Split
              image="f7.jpg"
              fig="52%"
              title="Booking Abandonment"
              text="Over half of travelers abandoned a direct booking last year because the digital experience felt cold, flat or sterile."
              src="SiteMinder Changing Traveller Report 2025"
            />
            <Split
              image="f6.jpg"
              fig="85–90%"
              title="Off-Site Dining Leakage"
              text="Seven of eight guests walk past your restaurants and spend their dinner money somewhere else."
              src="CBRE Americas / Regulr"
            />
            <Split
              image="f5.jpg"
              fig="15–30%"
              title="OTA Commission Tax"
              text="Paid to third parties on every OTA booking, against 4–5% to win the same guest direct."
              src="Cloudbeds / Lighthouse"
            />
          </ul>
        </div>
      </section>

      {/* =================== SECTION 2 — THE 4 CORE VIDEO TOUCHPOINTS =================== */}
      <section className="s2" id="s2">
        <div className="snap">
          <div className="wrap s2-head">
            <span className="eye">What works</span>
            <h2>
              Timing Is Everything:
              <br className="brk" /> The 4-Milestone Guest Journey.
            </h2>
          </div>
          <div className="wrap s2-band">
            <ul className="quad">
              <li>
                <Vsl poster="vsl-poster.jpg" tag="Watch · 1:15" />
              </li>
              <li className="jr" id="journey">
                <div className="jr__left">
                  <span className="tl__kick">Booking to check-in</span>
                  <span className="tl__title">Four films, timed to the guest</span>
                  <div className="jr__meter">
                    <div className="jr__meterhead">
                      <span id="jrDay">Day 1</span>
                      <span id="jrLeft">29 days to arrival</span>
                    </div>
                    <div className="jr__bar">
                      <span id="jrBar" />
                    </div>
                  </div>
                  <div className="jr__steps" role="tablist" aria-label="The four films">
                    {['Welcome by name', 'Dining, in close-up', 'Spa, matched to open hours', 'Arrival and extensions'].map(
                      (what, i) => (
                        <button
                          key={what}
                          className={`jr__step${i === 0 ? ' is-on' : ''}`}
                          role="tab"
                          aria-selected={i === 0}
                          data-i={i}
                          type="button"
                        >
                          <span className="jr__when">{['Day 1', '48 hours', '7 days out', '48 hours out'][i]}</span>
                          <span className="jr__what">{what}</span>
                          <span className="jr__prog" />
                        </button>
                      ),
                    )}
                  </div>
                  <p className="jr__foot">
                    Triggered by the booking in OPERA or SynXis. Sent by SMS or WhatsApp. Nobody on your team sends a
                    thing.
                  </p>
                </div>
                <div className="phone" aria-live="polite">
                  <div className="phone__screen">
                    <div className="phone__top">
                      <span className="phone__av">A</span>
                      <span className="phone__who">
                        The Resort<small>Verified business</small>
                      </span>
                    </div>
                    <div className="phone__chat">
                      <span className="phone__date" id="phDate">
                        Mon 3 Nov
                      </span>
                      <div className="bubble" id="phBubble">
                        <div className="bubble__vid">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img id="phImg" src={img('t2.jpg')} alt="" />
                          <span className="bubble__play">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M7 4l13 8-13 8z" />
                            </svg>
                          </span>
                          <span className="bubble__dur">0:30</span>
                        </div>
                        <p id="phMsg">Good morning, Sarah. It&apos;s Maya at the front desk. See you on the 2nd.</p>
                        <span className="bubble__time" id="phTime">
                          08:02
                        </span>
                      </div>
                      <span className="chip" id="phChip">
                        See the Ocean Suite
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="wrap s2-bento snap">
          <span className="eye">The four films</span>
          <h2>
            Four Films, Four Moments.
            <br className="brk" /> Every One Sells the Stay.
          </h2>
          <ul className="bento" id="bento2">
            {TOUCHPOINTS.map((c, i) => (
              <li key={c.title}>
                <button className="bx" type="button" data-deck="s2" data-i={i} aria-haspopup="dialog">
                  <span className="bx__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(c.img)} alt="" />
                    <span className="bx__fig">
                      {c.fig}
                      <span className="bx__figsub">{c.figSub}</span>
                    </span>
                    {EX}
                  </span>
                  <span className="bx__body">
                    <span className="kick">{c.kick}</span>
                    <span className="bx__title">{c.title}</span>
                    <span className="bx__desc">{c.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =================== SECTION 3 — HOW IT WORKS =================== */}
      <section className="s3" id="s3">
        <div className="wrap snap">
          <div className="s3-head">
            <span className="eye">How it works</span>
            <h2>
              Your Team Becomes the Face
              <br className="brk" /> of Every Arrival.
            </h2>
          </div>
          <ol className="reel" id="reel">
            {REEL.map((st, k) => {
              const n = `0${k + 1}`;
              return (
                <li key={st.name} className={`reel__item${k === 0 ? ' is-on' : ''}`} style={{ '--c': st.c } as React.CSSProperties}>
                  <button className="reel__tab" type="button" aria-expanded={k === 0} aria-label={`Step ${n}: ${st.name}`}>
                    <span className="reel__n">{n}</span>
                  </button>
                  <div className="reel__open">
                    <div className="reel__info">
                      <div className="ri__band">
                        <span className="reel__n">{n}</span>
                      </div>
                      <div className="ri__body">
                        <span className="ri__kick">{st.name}</span>
                        <h3>{st.title}</h3>
                        <p>{st.desc}</p>
                        <div className="ri__stat">
                          <span className="ri__fig">{st.fig}</span>
                          <span className="ri__lab">{st.figLab}</span>
                        </div>
                        <p className="ri__foot">{st.foot}</p>
                      </div>
                    </div>
                    <Vsl className="reel__film" poster={st.poster} tag={`Watch · ${st.len}`} preload="none" />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* =================== SECTION 4 — WHAT GUESTS EXPECT =================== */}
      <section className="s4" id="s4">
        <div className="snap">
          <div className="wrap">
            <span className="eye">What guests expect</span>
            <h2>
              This Is What Your Guests Expect.
              <br className="brk" /> Not Another Plain-Text Email.
            </h2>
          </div>
          <div className="mq-wrap">
            <div className="mq" id="mq">
              <div className="mq__track">
                {[...MARQUEE_CLIPS, ...MARQUEE_CLIPS].map((c, i) => (
                  <div key={i} className="mq__card" aria-hidden={i >= MARQUEE_CLIPS.length || undefined}>
                    <video src={img(`m${c}.mp4`)} poster={img(`m${c}.jpg`)} muted loop playsInline preload="metadata" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== WHO IT'S FOR =================== */}
      <section className="z z--night" id="who">
        <div className="wrap snap">
          <span className="eye">Who it&apos;s for</span>
          <h2 className="hx">
            One Engine. A Different Film
            <br className="brk" /> for Every Kind of Guest.
          </h2>
          <div className="gt__top">
            <div className="gt__tabs" role="tablist" aria-label="Guest type" id="gtTabs">
              {GUESTS.map((g, i) => (
                <button key={g.name} className="gt__tab" role="tab" aria-selected={i === 0} data-i={i} type="button">
                  {g.name}.
                </button>
              ))}
            </div>
            <button className="vbar" type="button" id="gtVsl" aria-label="Play: one engine, three guest types">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img('m3.jpg')} alt="" />
              <span className="vbar__p">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4l14 8-14 8z" />
                </svg>
              </span>
              <span>
                <b>Watch · 0:45</b>
                <span>One engine, three guest types, the same property filmed three ways.</span>
              </span>
            </button>
          </div>
          <ul className="g4 gt__frames" id="gtFrames">
            {GUESTS[0].lines.map((l, i) => (
              <li key={l}>
                <button className="fr" type="button" data-i={i} aria-label={`Open: ${l}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(GUESTS[0].imgs[i])} alt="" />
                  <span className="fr__when">{WHEN[i]}</span>
                  <span className="fr__ex" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path d="M1 4V1h3M11 8v3H8" />
                    </svg>
                  </span>
                  <span className="fr__line">{l}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="gt__foot">
            <p className="gt__cap">
              Matched to every guest by stay dates and guest profile. Nobody on your team picks the film.
            </p>
            <p className="gt__data" id="gtData" dangerouslySetInnerHTML={{ __html: GUESTS[0].data }} />
          </div>
        </div>
      </section>
      <div className="lb" id="lb" role="dialog" aria-modal="true" aria-labelledby="lbTitle" hidden>
        <button className="lb__x" id="lbX" type="button" aria-label="Close">
          <svg viewBox="0 0 16 16">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
        <figure className="lb__film vsl" id="lbFilm">
          <video src={img('vsl.mp4')} playsInline preload="none" />
          <button className="vsl__play" type="button" aria-label="Play this film">
            {PLAY}
          </button>
        </figure>
        <div className="lb__txt">
          <b id="lbWhen" />
          <h3 id="lbTitle" />
          <p id="lbTxt" />
        </div>
      </div>

      {/* =================== BUILT ON SUBTRACTION =================== */}
      <section className="z z--white" id="sub">
        <div className="wrap snap">
          <span className="eye">Built on subtraction</span>
          <h2 className="hx">
            Zero PMS Overhaul.
            <br className="brk" /> Zero Staff Burden.
          </h2>
          <div className="bs__top">
            <div className="w2">
              <Vsl className="vw vsl" poster="f1.jpg" preload="none">
                <figcaption className="vw__cap">
                  <b>Watch · 1:30</b>
                  <span>Built on Subtraction: everything we take off your plate.</span>
                </figcaption>
              </Vsl>
            </div>
            <div className="bs__call">
              <b>The whole commitment</b>
              <strong>
                Recorded once.
                <br />
                Runs every day.
              </strong>
              <p>Your team records once. The films run on your property every single day after that.</p>
            </div>
          </div>
          <ul className="g4">
            {SUBTRACTION.map((c) => (
              <li key={c.k}>
                <div className="cd" role="button" tabIndex={0} aria-expanded="false" aria-label={`${c.k}: ${c.title}`}>
                  <span className="cd__plus" aria-hidden="true">
                    +
                  </span>
                  <span className="cd__face">
                    <span className="cd__k">{c.k}</span>
                    <span className="cd__t">{c.title}</span>
                    <span className="cd__stat">{c.stat}</span>
                  </span>
                  <span className="cd__back">
                    <span className="cd__h">{c.title}</span>
                    <span className="cd__p">{c.back}</span>
                    <span className="cd__ul">
                      {c.items.map((it, i) => (
                        <span key={i} className="cd__li">
                          {it}
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =================== WHAT IF — FOUR CALCULATORS =================== */}
      <section className="z z--warm" id="whatif">
        <div className="wrap snap">
          <span className="eye">What if</span>
          <h2 className="hx">
            What If Every Offer Had
            <br className="brk" /> Its Own TV Commercial?
          </h2>
          <div className="wf__tabs" role="tablist" aria-label="Revenue calculators" id="wfTabs" />
          <div className="g4 wf__r2">
            <div className="w2">
              <figure className="vw vsl" id="wfVsl">
                <video src={img('vsl.mp4')} poster={img('p30.jpg')} playsInline preload="none" />
                <button className="vsl__play" type="button" aria-label="Play the video">
                  {PLAY}
                </button>
                <figcaption className="vw__cap">
                  <b>Watch · 1:00</b>
                  <span />
                </figcaption>
              </figure>
            </div>
            <div className="w2">
              <div className="wf__why">
                <b>Why this lever exists</b>
                <div id="wfWhy" style={{ display: 'flex', flexDirection: 'column', flex: 1 }} />
              </div>
            </div>
          </div>
          <form className="g4" id="wf" noValidate>
            <div className="w2 wf__box">
              <b>Your numbers</b>
              <div className="wf__fields" id="wfFields" />
              <div className="wf__rng is-unset" id="wfRngWrap">
                <div className="top">
                  <span id="wfRngLab" />
                  <b id="wfRngVal">—</b>
                </div>
                <input type="range" id="wfRng" aria-describedby="wfRngLab" />
              </div>
            </div>
            <div className="w2 wf__box wf__res" aria-live="polite">
              <b>Your result</b>
              <span className="wf__big" id="wfBig">
                —
              </span>
              <span className="wf__per" id="wfPer" />
              <p className="wf__how" id="wfHow" />
              <p className="wf__fee">Apex takes 0% of this. Flat fee.</p>
            </div>
          </form>
        </div>
      </section>

      {/* =================== UNLOCK ACCESS =================== */}
      <section className="z z--white" id="unlock">
        <div className="wrap snap">
          <span className="eye">Unlock access</span>
          <h2 className="hx">
            Your Guests,
            <br className="brk" /> Your Advertising.
          </h2>
          <ol className="g4">
            <li className="ua2__step">
              <span className="ua2__n">1</span>
              <h3>The guest receives the film.</h3>
              <p>Their welcome, starring your team, on their phone.</p>
            </li>
            <li className="ua2__step">
              <span className="ua2__n">2</span>
              <h3>They tap Unlock Access.</h3>
              <p>A share link designed to be tracked, with the words already written:</p>
              <q>What a welcome, can&apos;t believe we just received this from our hotel.</q>
            </li>
            <li className="ua2__step">
              <span className="ua2__n">3</span>
              <h3>A bonus unlocks.</h3>
              <p>Sharing unlocks a bonus or a discount on their stay.</p>
            </li>
            <li className="ua2__step">
              <span className="ua2__n">4</span>
              <h3>You see every enquiry.</h3>
              <p>Your GM dashboard will show the enquiries and messages each link brings in.</p>
            </li>
          </ol>
          <div className="g4 ua2__r2">
            <div className="w2">
              <div className="dash">
                <div className="dash__bar">
                  <i />
                  <i />
                  <i />
                  <b>GM dashboard</b>
                  <span>Planned · Unlock Access</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Link</th>
                      <th>Shares</th>
                      <th>Clicks</th>
                      <th>Enquiries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2].map((r) => (
                      <tr key={r}>
                        {[0, 1, 2, 3].map((c) => (
                          <td key={c}>
                            <i />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="dash__foot">Designed to track every shared link to the enquiry it brings.</p>
              </div>
            </div>
            <div className="w2">
              <Vsl className="vw vsl" poster="t2.jpg" preload="none">
                <figcaption className="vw__cap">
                  <b>Watch · 1:00</b>
                  <span>A forwarded film travels through a family group chat.</span>
                </figcaption>
              </Vsl>
            </div>
          </div>
          <div className="ua2__data">
            <div className="ua2__d">
              <strong>88%{A}</strong>
              <span>Trust recommendations from people they know above all other channels (Nielsen 2021) [G-02].</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== WELCOME, AS A PRODUCT YOU SELL =================== */}
      <section className="z z--night" id="product">
        <div className="wrap snap">
          <span className="eye">Welcome for events</span>
          <h2 className="hx">
            Welcome, as a Product
            <br className="brk" /> You Sell.
          </h2>
          <div className="g4">
            <article className="inv w2">
              <Vsl
                className="inv__film vsl"
                poster="p16.jpg"
                preload="none"
                tag="Watch · 1:00 · An event organiser's welcome reaching every attendee."
              />
              <div className="inv__card">
                <span className="inv__k">Corporate &amp; MICE</span>
                <span className="inv__rule" />
                <h3>Every Attendee, Briefed Like a VIP.</h3>
                <p>The films carry the event itself, and the four touchpoints sell your extras in the month before.</p>
                <ul>
                  <li>Event info and times</li>
                  <li>The kick-off and what&apos;s on</li>
                  <li>The location, filmed</li>
                </ul>
              </div>
            </article>
            <article className="inv w2">
              <Vsl className="inv__film vsl" poster="p2.jpg" preload="none" tag="Wedding film · 0:45" />
              <div className="inv__card">
                <span className="inv__k">Weddings</span>
                <span className="inv__rule" />
                <h3>Every Guest Gets the Films.</h3>
                <p>
                  Welcome sits inside your wedding package. The couple shares the films through Unlock Access, and the
                  deals are included.
                </p>
                <ul>
                  <li>Every guest receives the films</li>
                  <li>Shared by the couple</li>
                  <li>Deals included</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =================== THE APEX CONTINUUM =================== */}
      <section className="z z--white" id="continuum">
        <div className="wrap snap">
          <span className="eye">The Apex Continuum</span>
          <h2 className="hx">
            The Complete Guest Lifecycle.
            <br className="brk" /> Welcome Is Just Chapter 1.
          </h2>
          <div className="g4">
            <article className="ac" style={{ '--c': '#2b59e0' } as React.CSSProperties}>
              <div className="ac__step">
                <i>1</i>
                <span>Before the stay</span>
              </div>
              <h3>Apex Welcome</h3>
              <p>
                Activating the silent gap between booking and arrival with personalised video touchpoints sent directly to arriving
                guests&apos; phones.
              </p>
            </article>
            <article className="ac" style={{ '--c': '#2e8b8f' } as React.CSSProperties}>
              <div className="ac__step">
                <i>2</i>
                <span>Your storefront</span>
              </div>
              <h3>Apex Atlas</h3>
              <p>
                A digital storefront: another way to showcase your property, where everything you&apos;ve built with
                Apex is revealed to guests without front-desk friction, turning guests into walking billboards.
              </p>
            </article>
            <article className="ac" style={{ '--c': '#6a3fa0' } as React.CSSProperties}>
              <div className="ac__step">
                <i>3</i>
                <span>After the stay · Included</span>
              </div>
              <h3>Apex Goodbye</h3>
              <p>Included with Welcome. Day-after and one-month-later films bring guests back and collect private feedback.</p>
            </article>
            <aside className="ac__cta">
              <Vsl
                className="ac__film vsl"
                poster="h5.jpg"
                preload="none"
                tag={'Watch · 0:45 · "Welcome is just Chapter 1."'}
              />
              <div className="ac__body">
                <h3>Your staff, the stars. Your property, the show.</h3>
                <p className="ac__plans">
                  <b>Signature</b> $5k · <b>Premium</b> $10k · <b>Elite</b> $25k a month. $5,000 deposit.
                </p>
                <Link className="w3btn w3btn--dark" href="/contact-sales">
                  Contact sales &rarr;
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =================== SOURCES =================== */}
      <footer className="srcs" id="sources">
        <div className="wrap">
          <h2>Sources</h2>
          <ol>
            {SOURCES.map((s) => (
              <li key={s.claim}>
                <b>{s.claim}</b> {s.src}
                {s.vendor && (
                  <>
                    {' '}
                    <span className="vd">Vendor data.</span>
                  </>
                )}
              </li>
            ))}
          </ol>
          <div className="srcs__brand">
            <span>
              <b>Apex</b> Hospitality
            </span>
            <span>Figures marked * are listed above.</span>
          </div>
        </div>
      </footer>

      {/* The opened page. Filled from the touchpoint deck by Behaviors. */}
      <div className="w3sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="shTitle" hidden>
        <div className="w3sheet__panel" id="sheetPanel">
          <button className="w3sheet__close" id="sheetClose" type="button" aria-label="Close">
            <svg viewBox="0 0 16 16">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
          <div className="sh-top">
            <div className="sh-copy">
              <span className="kick" id="shKick" />
              <h2 id="shTitle" />
              <p id="shLede" />
              <div className="sh-btns">
                <Link className="w3btn w3btn--dark" href="/contact-sales" id="shCta">
                  Book a demo &rarr;
                </Link>
                <Link className="w3btn w3btn--ghost" href="/contact-sales">
                  Contact sales
                </Link>
              </div>
            </div>
            <figure className="sh-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="shImg" alt="" />
              <span className="sh-fig" id="shFig" />
            </figure>
          </div>
          <div className="pays">
            <span className="kick">Why it pays</span>
            <div className="pays__grid" id="shPays" />
            <p className="pays__cite" id="shCite" />
          </div>
          <div className="more">
            <h3>More to discover</h3>
            <ul className="more__row" id="shMore" style={{ listStyle: 'none' }} />
          </div>
        </div>
      </div>

      <Behaviors />
    </div>
  );
}
