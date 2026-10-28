'use client';

import { useEffect, useRef, useState } from 'react';
import { EXPECT } from '../data-more';
import { img } from '../data';
import { PlayIcon, Player } from '../parts';

/*
 * What guests expect · the live marquee's eleven guest films. A sets them as a
 * tile wall, B as two Netflix rows, C as one story player that steps through
 * them. Nothing downloads until a film is tapped or, in C, comes on screen.
 */

const CLIPS = EXPECT.clips;

/* ---- A · Grid: a tile wall, one feature film and ten tiles ------------------ */

export function ExpectA() {
  return (
    <div className="ha">
      <header className="f1-heading f1-heading--top">
        <span className="f1-eye">{EXPECT.eye}</span>
        <h2 className="f1-h2">{EXPECT.headline}</h2>
      </header>
      <ul className="f1-wall">
        {CLIPS.map((c, i) => (
          <li key={c.clip} className={i === 0 ? 'is-big' : i === CLIPS.length - 1 ? 'is-wide' : undefined}>
            <Player film={c} className="f1-wall__tile">
              <span className="f1-wall__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="f1-wall__play" aria-hidden="true">
                <PlayIcon />
              </span>
            </Player>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- B · Billboard: two Netflix rows, large tiles over smaller ones ---------- */

export function ExpectB() {
  return (
    <div className="hb hb--pad">
      <header className="nf-rowhead">
        <span className="nf-eye">{EXPECT.eye}</span>
        <h2 className="nf-rowhead__h">{EXPECT.headline}</h2>
      </header>
      <ul className="nf-row nf-row--big">
        {CLIPS.slice(0, 6).map((c) => (
          <li key={c.clip}>
            <Player film={c} className="nf-tile">
              <span className="nf-tile__shade" aria-hidden="true" />
              <span className="nf-tile__play" aria-hidden="true">
                <PlayIcon />
              </span>
            </Player>
          </li>
        ))}
      </ul>
      <ul className="nf-row nf-row--small nf-row--end">
        {CLIPS.slice(6).map((c) => (
          <li key={c.clip}>
            <Player film={c} className="nf-tile">
              <span className="nf-tile__play nf-tile__play--sm" aria-hidden="true">
                <PlayIcon />
              </span>
            </Player>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- C · Glass: one story player stepping through all eleven ----------------- */

export function ExpectC() {
  const [cur, setCur] = useState(0);
  const [t, setT] = useState(0);
  const ref = useRef<HTMLVideoElement>(null);
  const live = useRef(false);

  // muted, played while on screen and paused off it; reduced motion keeps the poster
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      live.current = e.isIntersecting;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // a new clip: load it, and play it if the story is on screen
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.load();
    if (live.current) v.play().catch(() => {});
  }, [cur]);

  const go = (d: number) => {
    setT(0);
    setCur((c) => (c + d + CLIPS.length) % CLIPS.length);
  };

  return (
    <div className="gl gl--list">
      <span className="gl-eye">{EXPECT.eye}</span>
      <h2 className="gl-h gl-h--list">{EXPECT.headline}</h2>
      <div className="gl-story">
        <div className="gl-story__bars" aria-hidden="true">
          {CLIPS.map((c, i) => (
            <i key={c.clip}>
              <span style={{ width: i < cur ? '100%' : i === cur ? `${Math.round(t * 100)}%` : '0%' }} />
            </i>
          ))}
        </div>
        <video
          ref={ref}
          className="gl-story__film"
          poster={img(CLIPS[cur].poster)}
          muted
          playsInline
          preload="none"
          onTimeUpdate={(e) => setT(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)}
          onEnded={() => go(1)}
        >
          <source src={img(CLIPS[cur].clip)} type="video/mp4" />
        </video>
        <button type="button" className="gl-story__prev" onClick={() => go(-1)} aria-label="Previous film" />
        <button type="button" className="gl-story__next" onClick={() => go(1)} aria-label="Next film" />
        <span className="gl-story__count" aria-live="polite">
          {cur + 1} / {CLIPS.length}
        </span>
      </div>
    </div>
  );
}
