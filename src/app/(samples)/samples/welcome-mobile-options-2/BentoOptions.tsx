'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef, useState } from 'react';
import { MOMENTS, MOMENTS_HEAD, WORKS, img, type Moment } from './data';
import { CloseX, Option, PlayIcon, useOverlay } from './parts';

/*
 * E · Bento Expand. One small element, so three options: the refined takeover,
 * the refined bottom sheet, and a new floating "team radio" card.
 */

const B = 'E · BENTO EXPAND';

function Head() {
  return (
    <div className="bhead">
      <span className="eye">{MOMENTS_HEAD.eye}</span>
      <h2>{MOMENTS_HEAD.headline}</h2>
    </div>
  );
}

function Tile({ m, onOpen, open = false }: { m: Moment; onOpen: (el: HTMLButtonElement) => void; open?: boolean }) {
  return (
    <button
      type="button"
      className={`etile${open ? ' is-open' : ''}`}
      aria-expanded={open}
      aria-label={`${m.fig}, ${m.figSub}: ${m.title}`}
      onClick={(e) => onOpen(e.currentTarget)}
    >
      <img src={img(m.img)} alt="" />
      <span className="etile__fig">
        {m.fig}
        <small>{m.figSub}</small>
      </span>
      <span className="etile__ex" aria-hidden="true">
        {open ? '−' : '+'}
      </span>
    </button>
  );
}

/** A film that plays muted the moment it mounts (it only mounts after a tap). */
function Film({ m, className = '' }: { m: Moment; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
  }, [m.clip]);
  return <video ref={ref} className={className} src={img(m.clip)} poster={img(m.poster)} muted loop playsInline preload="auto" />;
}

/* ---- 1 · Full-screen takeover (refined) --------------------------------------------
   Tap a tile and its vertical film takes the WHOLE phone screen, full bleed on
   all four sides, cropped to fill (cover) and never letterboxed.

   It is always our own overlay; the film is never handed to the iOS native
   player, which letterboxes a vertical film with thick black bars. Where a
   browser lets a non-video element go fullscreen (Android Chrome, desktop),
   the tap also asks for real fullscreen on the overlay so the browser chrome
   goes too; anywhere else (iPhone Safari, iOS in-app browsers) it falls back
   silently to the overlay alone:

   - position fixed on all four sides, 100vw wide, as tall as the tallest
     viewport unit the browser offers (max of 100vh, 100dvh, 100lvh), and
     pulled out by the safe-area insets so it runs under the notch and home bar;
   - the film plays inline (playsinline), muted so it can start at once, cover
     fit and scaled 1.04 to crop any thin strips baked into the clip edges;
     a tap on the film turns the sound on;
   - html, body and theme-color go black and the page stops scrolling while it
     is open, so whatever chrome an app keeps blends into the film.

   Leaving by any route (the X, the back gesture, Esc, or scrolling down) flicks
   the film back into its tile, with the touchpoint's points in a card under the
   grid. */

/** Placeholder points per touchpoint, all live copy: the card line, the sheet's lede, and the journey footer. */
const points = (m: Moment) => [m.desc, m.lede, WORKS.foot];

type Phase = 'off' | 'opening' | 'full' | 'closing';

type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };

const fsElement = () => {
  const d = document as FsDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
};

/** Ask for real fullscreen on the overlay where non-video elements may have it; true if a request was made. */
function enterFullscreen(el: FsElement): boolean {
  try {
    if (el.requestFullscreen) {
      el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
      return true;
    }
    if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
      return true;
    }
  } catch {
    /* fall through to the next route */
  }
  return false;
}

/** Flip a film's sound; returns true when it is now audible. */
function toggleSound(v: HTMLVideoElement): boolean {
  v.muted = !v.muted;
  if (!v.muted) v.play().catch(() => {});
  return !v.muted;
}

function exitFullscreen() {
  const d = document as FsDocument;
  if (!fsElement()) return;
  try {
    if (d.exitFullscreen) d.exitFullscreen().catch(() => {});
    else d.webkitExitFullscreen?.();
  } catch {
    /* already out */
  }
}

/** Black theme-color and a black html/body while the film is up, restored after. */
function useBlackChrome(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.background, body: body.style.background };
    html.style.background = '#000';
    body.style.background = '#000';
    const metas = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
    const prevColors = metas.map((m) => m.content);
    let added: HTMLMetaElement | null = null;
    if (metas.length) metas.forEach((m) => (m.content = '#000000'));
    else {
      added = document.createElement('meta');
      added.name = 'theme-color';
      added.content = '#000000';
      document.head.appendChild(added);
    }
    return () => {
      html.style.background = prev.html;
      body.style.background = prev.body;
      metas.forEach((m, n) => (m.content = prevColors[n]));
      added?.remove();
    };
  }, [on]);
}

function Takeover() {
  const [i, setI] = useState<number | null>(null); // the touchpoint on screen
  const [shown, setShown] = useState<number | null>(null); // the touchpoint whose points are open
  const [phase, setPhase] = useState<Phase>('off');
  const [clip, setClip] = useState('none');
  const [real, setReal] = useState(false); // true while in real (element) fullscreen
  const [sound, setSound] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  // The player-shaped films, laid out in the tiles (under the stills) so iOS has their metadata ready.
  const tileFilms = useRef<(HTMLVideoElement | null)[]>([]);
  const native = useRef<number | null>(null);
  // Which route this phone actually took, shown under the grid so a test on a real phone reports itself.
  const [route, setRoute] = useState('');
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  const busy = useRef(false);
  const cur = useRef<number | null>(null);

  /** The clip-path that crops the full screen down to tile n, where it sits right now. */
  const tileClip = (n: number) => {
    const el = tiles.current[n];
    if (!el) return 'inset(50% 50% 50% 50%)';
    const r = el.getBoundingClientRect();
    return `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 16px)`;
  };

  // Keep every film muted (set as a property, not just the attribute) and parked.
  useEffect(() => {
    films.current.forEach((v) => {
      if (v) v.muted = true;
    });
  }, []);

  const open = (n: number) => {
    if (busy.current) return;
    // iPhone: a web page can never cover the status bar (clock) or Safari's toolbar. Only
    // the phone's own video player can, so there the tile's film goes straight into it.
    // In portrait the player fits the film inside the screen less a strip top and bottom
    // (the island and home bar, ~46pt each), so the films are cut to that space, not the
    // screen: full width, no clock, and only those two strips left black. (Android/desktop keep the overlay below,
    // with real element fullscreen, which hides their chrome anyway.)
    // Element fullscreen counts only where the flag AND a real method exist; iPhone Safari has neither method.
    const d = document as FsDocument & { webkitFullscreenEnabled?: boolean };
    const layerEl = layer.current as FsElement | null;
    const elementFs =
      !!(d.fullscreenEnabled || d.webkitFullscreenEnabled) && !!(layerEl?.requestFullscreen || layerEl?.webkitRequestFullscreen);
    const tv = tileFilms.current[n] as NativeVideo | null;
    if (!elementFs && tv?.webkitEnterFullscreen) {
      tileFilms.current.forEach((f, k) => {
        if (f && k !== n) f.pause();
      });
      tv.muted = false;
      tv.currentTime = 0;
      tv.play().catch(() => {
        tv.muted = true;
        tv.play().catch(() => {});
      });
      const enter = () => {
        tv.webkitEnterFullscreen?.();
        native.current = n;
        setRoute('iPhone full-screen player: no clock, no Safari bars');
      };
      try {
        enter();
        return;
      } catch (err) {
        // iOS refuses the player until the film has started loading. Retry the moment its
        // metadata lands (still inside the tap's grace period); only if that fails too does
        // the browser overlay take over, and the readout says why.
        const why = err instanceof Error ? err.name : 'refused';
        let settled = false;
        const retry = () => {
          if (settled) return;
          settled = true;
          tv.removeEventListener('loadedmetadata', retry);
          try {
            enter();
          } catch (err2) {
            setRoute(`iPhone player refused (${why}, then ${err2 instanceof Error ? err2.name : 'refused'}): showed the browser overlay`);
            openOverlay(n);
          }
        };
        tv.addEventListener('loadedmetadata', retry);
        setTimeout(retry, 900);
        return;
      }
    }
    openOverlay(n);
  };

  /** The browser overlay: real element fullscreen where offered, else the fixed overlay. */
  const openOverlay = (n: number) => {
    if (busy.current) return;
    busy.current = true;
    cur.current = n;
    const v = films.current[n];
    const el = layer.current as FsElement | null;
    // Everything below runs inside the tap, which is what fullscreen requires.
    // The overlay is display:none while parked (so Safari 26 treats it as newly shown and
    // re-samples its bar tint); bring it into layout now, before asking for fullscreen.
    if (el) el.style.display = 'block';
    films.current.forEach((f, k) => {
      if (f && k !== n) f.pause();
    });
    if (v) {
      v.muted = true;
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    // Real fullscreen only where a non-video element may have it; otherwise the overlay alone, silently.
    const route: 'element' | 'css' = el && enterFullscreen(el) ? 'element' : 'css';
    setSound(false);
    setI(n);
    setReal(route === 'element');
    setRoute((r) => (r.startsWith('iPhone player refused') ? r : route === 'element' ? 'browser fullscreen overlay (Android/desktop)' : 'browser overlay (no fullscreen available)'));
    if (route === 'css') {
      // No real fullscreen on offer: grow the film out of its tile instead.
      setClip(tileClip(n));
      setPhase('opening');
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setClip('inset(0px 0px 0px 0px round 0px)');
          setPhase('full');
        }),
      );
    } else {
      setClip('none');
      setPhase('full');
    }
    // Hand display back to the class once React has rendered the open phase.
    requestAnimationFrame(() => {
      if (el) el.style.display = '';
    });
    setTimeout(() => {
      busy.current = false;
    }, 500);
  };

  /** Flick the film off: leave fullscreen, park the page on the grid, open the points, shrink into the tile. */
  const flickOff = () => {
    const n = cur.current;
    if (n === null || busy.current) return;
    busy.current = true;
    exitFullscreen();
    // Give the browser a frame or two to restore its layout after fullscreen.
    setTimeout(() => {
      const b = box.current;
      if (b) {
        const top = b.getBoundingClientRect().top + window.scrollY - 56;
        window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      }
      setShown(n);
      setReal(false);
      setClip('inset(0px 0px 0px 0px round 0px)');
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setClip(tileClip(n));
          setPhase('closing');
          setTimeout(() => {
            const f = films.current[n];
            if (f) {
              f.pause();
              f.muted = true;
            }
            setSound(false);
            cur.current = null;
            setI(null);
            setPhase('off');
            setClip('none');
            busy.current = false;
          }, 480);
        }),
      );
    }, fsElement() ? 260 : 40);
  };

  const up = i !== null;
  useOverlay(up, flickOff);
  useBlackChrome(up);

  // Leaving real fullscreen by the system (back gesture, Esc) counts as leaving;
  // so does Done in the iPhone player, which returns to the grid with the points.
  useEffect(() => {
    const onFs = () => {
      if (!fsElement() && cur.current !== null && !busy.current) flickOff();
    };
    const onNativeDone = () => {
      const n = native.current;
      if (n === null) return;
      native.current = null;
      const f = tileFilms.current[n];
      if (f) {
        f.pause();
        f.muted = true;
      }
      setShown(n);
    };
    const vids = tileFilms.current.filter(Boolean) as HTMLVideoElement[];
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    vids.forEach((v) => v.addEventListener('webkitendfullscreen', onNativeDone));
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
      vids.forEach((v) => v.removeEventListener('webkitendfullscreen', onNativeDone));
    };
  });

  // Any downward intent while the film is up flicks it off: wheel, a swipe up, or the keys.
  const touchY = useRef<number | null>(null);
  useEffect(() => {
    if (!up) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 6) flickOff();
    };
    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchY.current !== null && touchY.current - e.touches[0].clientY > 24) {
        touchY.current = null;
        flickOff();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        flickOff();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  });

  const m = i === null ? null : MOMENTS[i];
  const p = shown === null ? null : MOMENTS[shown];
  return (
    <Option block={B} n={1} name="Full-screen takeover (refined)" note="Our own overlay. Tap a tile: its vertical film fills everything the browser lets a page draw on, cropped rather than letterboxed, with the status-bar strip and Safari's bottom bar turned black around it. Only the timing and the touchpoint pill sit on the film. Scroll down and the film flicks back into its tile, with that touchpoint's points in a card underneath.">
      <div className="ebox" ref={box}>
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <button
              key={mm.kick}
              ref={(el) => {
                tiles.current[n] = el;
              }}
              type="button"
              className={`etile${shown === n ? ' is-open' : ''}`}
              aria-label={`Play full screen: ${mm.fig}, ${mm.figSub}: ${mm.title}`}
              onClick={() => open(n)}
            >
              <video
                ref={(el) => {
                  tileFilms.current[n] = el;
                }}
                className="tk-tilefilm"
                src={img(tall(mm).src)}
                poster={img(tall(mm).poster)}
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <img src={img(mm.img)} alt="" />
              <span className="etile__fig">
                {mm.fig}
                <small>{mm.figSub}</small>
              </span>
              <span className="etile__ex" aria-hidden="true">
                ▶
              </span>
            </button>
          ))}
        </div>
        {route && <p className="tk-route">Last tap on this device: {route}</p>}
        {p && shown !== null && (
          <div className="tk-points" key={shown} aria-live="polite">
            <div className="tk-points__head">
              <span className="tk-points__pill">
                {p.kick} · {p.title}
              </span>
              <span className="tk-points__when">
                {p.fig} · {p.figSub}
              </span>
            </div>
            <ul>
              {points(p).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <button type="button" className="tk-points__again" onClick={() => open(shown)}>
              <PlayIcon size={22} /> Watch again
            </button>
          </div>
        )}
      </div>
      {/* Safari 26 tints its status-bar strip and bottom toolbar from an opaque fixed element
          touching the edge (theme-color is ignored there). Two black strips appear with the
          film so both bars go black instead of white; they sit under the film, unseen. */}
      {up && (
        <>
          <div className="tk-tint tk-tint--top" aria-hidden="true" />
          <div className="tk-tint tk-tint--bottom" aria-hidden="true" />
        </>
      )}
      {/* Always mounted (display:none while parked), so a tap can hand it to fullscreen synchronously. */}
      <div
        ref={layer}
        className={`tk tk--${phase}${real ? ' tk--real' : ''}`}
        style={{ clipPath: clip }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!up}
        aria-label={m ? `${m.kick} · ${m.title}` : undefined}
      >
        {MOMENTS.map((mm, n) => (
          <video
            key={mm.kick}
            ref={(el) => {
              films.current[n] = el;
            }}
            className={`tk__film${i === n ? ' is-on' : ''}`}
            src={img(mm.clip)}
            poster={img(mm.poster)}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ))}
        <div className="tk__shade" aria-hidden="true" />
        {/* The film starts muted so it can play at once; a tap on it turns the sound on. */}
        <button
          type="button"
          className="tk__tap"
          aria-label={sound ? 'Mute the film' : 'Turn the sound on'}
          onClick={() => {
            const v = i === null ? null : films.current[i];
            if (v) setSound(toggleSound(v));
          }}
        />
        {m && (
          <div className="tk__ui">
            <span className="tk__when">
              {m.fig} · {m.figSub}
            </span>
            <span className="tk__pill">
              {m.kick} · {m.title}
            </span>
            <button type="button" className="tk__down" onClick={flickOff} aria-label="Scroll down to this touchpoint">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <span className="tk__sound" aria-hidden="true">
              {sound ? '🔊' : '🔇'}
            </span>
            <button type="button" className="tk__x" onClick={flickOff} aria-label="Close">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Option>
  );
}

/* ---- 1b · Native player, pre-cropped (comparison) ------------------------------
   For comparison with E1. The tap hands the film to the phone's own fullscreen
   player (video.webkitEnterFullscreen on iPhone; requestFullscreen on the
   video elsewhere). The native player hides the status bar and Safari's
   toolbars completely, but it fits the film to the screen (aspect-fit), which
   is what gave the thick black bars in v5. So these are separate versions of
   the four films, centre-cropped with ffmpeg to the space the iPhone player
   fits a film into in portrait, the screen less ~46pt top and bottom (720×1390,
   /media/welcome/*-tall.mp4). A film cut to the full 9:19.5 screen was too
   tall for that space and came up framed on all four sides. No overlay text: the native
   player shows only the film and its controls. Done returns to the grid with
   the touchpoint's points underneath. */

type NativeVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const tall = (m: Moment) => ({ src: m.clip.replace(/\.mp4$/, '-tall.mp4'), poster: m.poster.replace(/\.jpg$/, '-tall.jpg') });

function NativeTall() {
  const [shown, setShown] = useState<number | null>(null);
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  const cur = useRef<number | null>(null);

  const done = () => {
    const n = cur.current;
    if (n === null) return;
    cur.current = null;
    const v = films.current[n];
    if (v) {
      v.pause();
      v.muted = true;
    }
    setShown(n);
  };

  const open = (n: number) => {
    const v = films.current[n] as NativeVideo | null;
    if (!v) return;
    cur.current = n;
    films.current.forEach((f, k) => {
      if (f && k !== n) f.pause();
    });
    // A tap is a user gesture, so the film may start with sound.
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    try {
      if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
      else if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
      else v.webkitRequestFullscreen?.();
    } catch {
      /* the inline film stays playing in its tile */
    }
  };

  useEffect(() => {
    const onFs = () => {
      if (!fsElement() && cur.current !== null) done();
    };
    // Esc leaves too: exit fullscreen ourselves (fullscreenchange then brings back the points).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || cur.current === null) return;
      if (fsElement()) exitFullscreen();
      else done();
    };
    const vids = films.current.filter(Boolean) as HTMLVideoElement[];
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    document.addEventListener('keydown', onKey);
    vids.forEach((v) => v.addEventListener('webkitendfullscreen', done));
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
      document.removeEventListener('keydown', onKey);
      vids.forEach((v) => v.removeEventListener('webkitendfullscreen', done));
    };
  });

  const p = shown === null ? null : MOMENTS[shown];
  return (
    <Option block={B} n="1b" name="Native player, pre-cropped (comparison)" note="For comparison with E1. Tap a tile and the phone's own fullscreen player takes over, hiding the status bar and Safari's bars entirely. The four films are pre-cropped to the space the iPhone's player gives a film, so it fills the full width with no clock. The player shows only the film; Done returns here with the points below.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => {
            const t = tall(mm);
            return (
              <button
                key={mm.kick}
                type="button"
                className={`etile nt-tile${shown === n ? ' is-open' : ''}`}
                aria-label={`Play in the native player: ${mm.fig}, ${mm.figSub}: ${mm.title}`}
                onClick={() => open(n)}
              >
                <video
                  ref={(el) => {
                    films.current[n] = el;
                  }}
                  src={img(t.src)}
                  poster={img(t.poster)}
                  muted
                  playsInline
                  preload="metadata"
                />
                <span className="etile__fig">
                  {mm.fig}
                  <small>{mm.figSub}</small>
                </span>
                <span className="etile__ex" aria-hidden="true">
                  ▶
                </span>
              </button>
            );
          })}
        </div>
        {p && shown !== null && (
          <div className="tk-points" key={shown} aria-live="polite">
            <div className="tk-points__head">
              <span className="tk-points__pill">
                {p.kick} · {p.title}
              </span>
              <span className="tk-points__when">
                {p.fig} · {p.figSub}
              </span>
            </div>
            <ul>
              {points(p).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <button type="button" className="tk-points__again" onClick={() => open(shown)}>
              <PlayIcon size={22} /> Watch again
            </button>
          </div>
        )}
      </div>
    </Option>
  );
}

/* E1c · The landscape idea, built as asked so it can be tried on an iPhone:
   each film saved as a landscape (1390×720) video with the upright film turned
   on its side inside it (/media/welcome/*-side-{l,r}.mp4), played by the phone's
   own player. Which way to turn it is a link under the tiles. */
const sideways = (m: Moment, turn: 'l' | 'r') => m.clip.replace(/\.mp4$/, `-side-${turn}.mp4`);

function NativeSideways() {
  // Which way the film is turned inside the landscape file; the link under the grid flips it.
  const [turn, setTurn] = useState<'l' | 'r'>('l');
  const [shown, setShown] = useState<number | null>(null);
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  const cur = useRef<number | null>(null);

  const done = () => {
    const n = cur.current;
    if (n === null) return;
    cur.current = null;
    const v = films.current[n];
    if (v) {
      v.pause();
      v.muted = true;
    }
    setShown(n);
  };

  const open = (n: number) => {
    const v = films.current[n] as NativeVideo | null;
    if (!v) return;
    cur.current = n;
    films.current.forEach((f, k) => {
      if (f && k !== n) f.pause();
    });
    // A tap is a user gesture, so the film may start with sound.
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    try {
      if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
      else if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
      else v.webkitRequestFullscreen?.();
    } catch {
      /* the inline film stays playing in its tile */
    }
  };

  useEffect(() => {
    const onFs = () => {
      if (!fsElement() && cur.current !== null) done();
    };
    // Esc leaves too: exit fullscreen ourselves (fullscreenchange then brings back the points).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || cur.current === null) return;
      if (fsElement()) exitFullscreen();
      else done();
    };
    const vids = films.current.filter(Boolean) as HTMLVideoElement[];
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    document.addEventListener('keydown', onKey);
    vids.forEach((v) => v.addEventListener('webkitendfullscreen', done));
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
      document.removeEventListener('keydown', onKey);
      vids.forEach((v) => v.removeEventListener('webkitendfullscreen', done));
    };
  });

  const p = shown === null ? null : MOMENTS[shown];
  return (
    <Option block={B} n="1c" name="Landscape file, film turned inside (comparison)" note="The landscape idea, to compare with E1 on an iPhone. Each film is saved as a landscape (wide) video with the vertical film turned on its side inside it, and the phone's own player plays it. The link under the tiles flips which way the film is turned.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => {
            const t = tall(mm);
            return (
              <button
                key={mm.kick}
                type="button"
                className={`etile${shown === n ? ' is-open' : ''}`}
                aria-label={`Play the landscape file: ${mm.fig}, ${mm.figSub}: ${mm.title}`}
                onClick={() => open(n)}
              >
                <video
                  ref={(el) => {
                    films.current[n] = el;
                  }}
                  className="tk-tilefilm"
                  src={img(sideways(mm, turn))}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
                <img src={img(t.poster)} alt="" />
                <span className="etile__fig">
                  {mm.fig}
                  <small>{mm.figSub}</small>
                </span>
                <span className="etile__ex" aria-hidden="true">
                  ▶
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" className="tk-turn" onClick={() => setTurn(turn === 'l' ? 'r' : 'l')}>
          Film turned {turn === 'l' ? 'left' : 'right'}. Tap to turn it the other way, then open a tile again.
        </button>
        {p && shown !== null && (
          <div className="tk-points" key={shown} aria-live="polite">
            <div className="tk-points__head">
              <span className="tk-points__pill">
                {p.kick} · {p.title}
              </span>
              <span className="tk-points__when">
                {p.fig} · {p.figSub}
              </span>
            </div>
            <ul>
              {points(p).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <button type="button" className="tk-points__again" onClick={() => open(shown)}>
              <PlayIcon size={22} /> Watch again
            </button>
          </div>
        )}
      </div>
    </Option>
  );
}

/* ---- 2 · Tall bottom sheet (refined) -------------------------------------------------
   The sheet now rises to almost the full page, with the film playing in its top
   and the touchpoint's copy beneath. Pull it down or tap the sliver above to close. */
function TallSheet() {
  const [i, setI] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const close = () => {
    setShown(false);
    setTimeout(() => setI(null), 340);
  };
  useOverlay(i !== null, close);
  const open = (n: number) => {
    setI(n);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };
  const m = i === null ? null : MOMENTS[i];
  return (
    <Option block={B} n={2} name="Tall bottom sheet (refined)" note="Refined: the sheet rises to almost a full page, with the film playing in its top and the touchpoint's copy below. Pull it down or tap above it to close.">
      <div className="ebox">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={() => open(n)} open={i === n} />
          ))}
        </div>
      </div>
      {m && (
        <div className={`he2${shown ? ' is-on' : ''}`} role="dialog" aria-modal="true" aria-label={m.title}>
          <button type="button" className="he2__scrim" aria-label="Close" onClick={close} />
          <div className="he2__sheet">
            <button type="button" className="he2__grip" aria-label="Close" onClick={close}>
              <i />
            </button>
            <div className="he2__film">
              <Film m={m} />
              <span className="he2__when">
                {m.fig} · {m.figSub}
              </span>
            </div>
            <div className="he2__copy">
              <span className="kick">{m.kick}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
            <div className="he2__nav">
              {MOMENTS.map((o, n) => (
                <button key={o.kick} type="button" aria-pressed={n === i} onClick={() => setI(n)}>
                  {o.fig}
                  <small>{o.figSub}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Option>
  );
}

/* ---- 3 · Team-radio card (new) ----------------------------------------------------
   From F1 Live Timing: tap a tile and a small floating card pops out over the grid,
   playing that touchpoint's film with a live progress line and its copy beside
   it. Tap another tile to swap; × to put it away. The page stays usable. */
function Radio() {
  const [i, setI] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);
  const [prog, setProg] = useState(0);
  const m = i === null ? null : MOMENTS[i];
  useEffect(() => {
    const v = vid.current;
    if (!v || !m) return;
    v.muted = true;
    v.currentTime = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) v.play().catch(() => {});
    const onTime = () => setProg(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [m]);
  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };
  return (
    <Option block={B} n={3} name="Team-radio card" note="New, from F1 Live Timing: tap a tile and a small floating card pops out over the grid, playing that film with a live progress line and its copy beside it. Tap another tile to swap.">
      <div className="ebox he3">
        <Head />
        <div className="egrid">
          {MOMENTS.map((mm, n) => (
            <Tile key={mm.kick} m={mm} onOpen={() => { setI(n); setPaused(false); }} open={i === n} />
          ))}
        </div>
        {m && (
          <div className="he3__card" role="region" aria-label={`Now playing: ${m.title}`} key={m.kick}>
            <button type="button" className="he3__vid" onClick={toggle} aria-label={paused ? 'Play' : 'Pause'}>
              <video ref={vid} src={img(m.clip)} poster={img(m.poster)} muted loop playsInline preload="auto" />
              <span className="he3__pp" aria-hidden="true">
                {paused ? <PlayIcon size={26} /> : <span className="he3__pause" />}
              </span>
            </button>
            <div className="he3__txt">
              <span className="he3__live">
                <i aria-hidden="true" /> {m.fig} · {m.figSub}
              </span>
              <b>{m.title}</b>
              <p>{m.desc}</p>
            </div>
            <CloseX onClick={() => setI(null)} light label="Put the card away" />
            <span className="he3__prog" aria-hidden="true">
              <span style={{ width: `${Math.round(prog * 100)}%` }} />
            </span>
          </div>
        )}
      </div>
    </Option>
  );
}

export default function BentoOptions() {
  return (
    <>
      <Takeover />
      <NativeTall />
      <NativeSideways />
      <TallSheet />
      <Radio />
    </>
  );
}
