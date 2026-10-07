'use client';

import { useEffect } from 'react';
import { GUESTS, JOURNEY, TOUCHPOINTS, WHEN, img, type Card } from './data';

/*
 * Every interactive part of the page, ported from the design artifact's own
 * script and run once against the server-rendered markup in WelcomeBody.
 *
 * All listeners hang off one AbortController and every timer, frame and
 * observer is torn down on unmount: reactStrictMode mounts twice in dev, and a
 * leaked listener would double every click.
 */

type Field = { id: string; label: string; pre?: string; suf?: string; min: number; max: number };
type Module = {
  tab: string;
  hero: string;
  /** Ledger tag for the hero figure. */
  tag: string;
  /** The line under the "why" panel that explains the tab's headline figure. */
  heroNote: string;
  vsl: { poster: string; len: string; line: string };
  why: [string, string][];
  f: Field[];
  rng: { label: string; min: number; max: number; step: number; maxFrom?: string };
  calc: (x: Record<string, number>, r: number) => { big: string; per: string; how: string };
};

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const AST = '<span class="ast">*</span>';

/*
 * The four calculators.
 *
 * DRAFT: the per-module field sets below are the v13 working set, not final
 * (open item C64). Every input starts empty and the slider starts unset, so the
 * page never shows a result built on a rate we chose for the hotelier. Only
 * cleared figures appear in the tab heroes and the "why" panel.
 */
const MODULES: Module[] = [
  {
    tab: 'Combat OTAs',
    hero: '15–30%',
    tag: 'G-09',
    heroNote: 'OTA commission, against 4–5% to book direct (Cloudbeds / Lighthouse) [G-09].',
    vsl: { poster: 'p30.jpg', len: '1:00', line: 'Most calculators use fake outlier rates. We think that’s garbage. Plug in your own numbers.' },
    why: [['10.6% vs 21.8%', 'Cancellation rate for direct bookings against OTA bookings. A channel fact, not a Welcome result (Cloudbeds, vendor data) [P03-6].']],
    f: [
      { id: 'rev', label: 'Annual OTA room revenue', pre: '$', min: 1, max: 1e10 },
      { id: 'rate', label: 'Your commission rate', suf: '%', min: 0.1, max: 50 },
    ],
    rng: { label: 'Commission, from your rate down to 0%', min: 0, max: 50, step: 0.5, maxFrom: 'rate' },
    calc: (x, r) => ({
      big: money((x.rev * (x.rate - r)) / 100),
      per: 'Commission kept per year',
      how: `Your OTA revenue (${money(x.rev)}) × the difference between your rate (${x.rate}%) and the new rate (${r}%).`,
    }),
  },
  {
    tab: 'Fine Dining & F&B',
    hero: '75%',
    tag: 'P05-4',
    heroNote: 'Of tourists are culinary travellers and rate food 8.2/10 (World Food Travel Association 2026) [P05-4].',
    vsl: { poster: 'f6.jpg', len: '0:55', line: 'Here is how your table gets booked before your guest looks anywhere else.' },
    why: [['380%', 'Reviews lift conversion on higher-priced items by 380% (Spiegel Research Center) [G-13].']],
    f: [
      { id: 'cov', label: 'Dinner covers per month', min: 1, max: 1e7 },
      { id: 'chk', label: 'Your average check', pre: '$', min: 1, max: 1e5 },
      { id: 'seat', label: 'Restaurant seats', min: 1, max: 1e5 },
    ],
    rng: { label: 'Share of covers captured before arrival', min: 0, max: 100, step: 1 },
    calc: (x, r) => {
      const cap = x.seat * 30;
      const cov = Math.min((x.cov * r) / 100, cap);
      return {
        big: money(cov * x.chk),
        per: 'Pre-booked dinner revenue per month',
        how: `Your covers (${x.cov.toLocaleString('en-US')}) × ${r}% captured × your average check (${money(x.chk)}), capped by your ${x.seat} seats (${cap.toLocaleString('en-US')} covers a month, one sitting a night).`,
      };
    },
  },
  {
    tab: 'Spa',
    hero: '$6.8T',
    tag: 'P08-1',
    heroNote: 'The wellness economy is bigger than global tourism (Global Wellness Institute) [P08-1].',
    vsl: { poster: 't9.jpg', len: '0:50', line: 'An empty treatment hour never comes back. Fill it before the guest lands.' },
    why: [
      ['50–75%', 'Ideal therapist utilisation (Cornell / Horwath) [P08-4].'],
      ['More', 'Wellness travellers spend more per trip than the average tourist (GWI) [P08-5].'],
    ],
    f: [
      { id: 'hrs', label: 'Unbooked therapist hours per month', min: 1, max: 1e6 },
      { id: 'price', label: 'Your average treatment price', pre: '$', min: 1, max: 1e5 },
      { id: 'rooms', label: 'Treatment rooms', min: 1, max: 1e4 },
    ],
    rng: { label: 'Share of hours filled in advance', min: 0, max: 100, step: 1 },
    calc: (x, r) => {
      const h = (x.hrs * r) / 100;
      return {
        big: money(h * x.price),
        per: 'Pre-booked treatment revenue per month',
        how: `Your unbooked hours (${x.hrs.toLocaleString('en-US')}) × ${r}% filled in advance × your average treatment (${money(x.price)}), across your ${x.rooms} treatment rooms.`,
      };
    },
  },
  {
    tab: 'Standby Suite Upgrades',
    hero: '18%+',
    tag: 'P15-3',
    heroNote: 'Ancillary revenue is more than 18% of total hotel income (Cloudbeds, vendor data) [P15-3].',
    vsl: { poster: 't2.jpg', len: '0:45', line: 'Your best rooms, shown before arrival, sold before check-in.' },
    why: [['380%', 'Reviews lift conversion on higher-priced items by 380% (Spiegel Research Center) [G-13].']],
    f: [
      { id: 'rooms', label: 'Room count', min: 1, max: 1e5 },
      { id: 'adr', label: 'Your ADR', pre: '$', min: 1, max: 1e5 },
      { id: 'suites', label: 'Suite count', min: 1, max: 1e4 },
      { id: 'up', label: 'Upgrade price per night', pre: '$', min: 1, max: 1e5 },
    ],
    rng: { label: 'Upgrade take-up', min: 0, max: 20, step: 0.5 },
    calc: (x, r) => {
      const per = Math.min((x.rooms * r) / 100, x.suites);
      return {
        big: money(per * x.up * 30),
        per: 'Upgrade revenue per month',
        how: `Your rooms (${x.rooms}) × ${r}% take-up = ${Math.round(per * 10) / 10} upgrades a night, capped at your ${x.suites} suites, × your upgrade price (${money(x.up)}) × 30 nights. That is ${Math.round((x.up / x.adr) * 100)}% on top of your ADR.`,
      };
    },
  },
];

function init(root: HTMLElement): () => void {
  const ac = new AbortController();
  const signal = ac.signal;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const frames = new Set<number>();
  const observers: IntersectionObserver[] = [];
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
    return t;
  };
  const raf = (fn: FrameRequestCallback) => {
    const id = requestAnimationFrame((ts) => {
      frames.delete(id);
      fn(ts);
    });
    frames.add(id);
  };
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => root.querySelector<T>('#' + id)!;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play = (v: HTMLVideoElement) => {
    const p = v.play();
    if (p) p.catch(() => {});
  };

  /* ---- tap-to-play VSLs ---------------------------------------------------- */
  root.querySelectorAll<HTMLElement>('figure.vsl, figure.reel__film').forEach((fig) => {
    const v = fig.querySelector('video');
    const btn = fig.querySelector('.vsl__play');
    if (!v || !btn) return;
    btn.addEventListener(
      'click',
      () => {
        fig.classList.add('is-playing');
        v.controls = true;
        play(v);
      },
      { signal },
    );
    v.addEventListener(
      'ended',
      () => {
        fig.classList.remove('is-playing');
        v.controls = false;
        v.load();
      },
      { signal },
    );
  });

  /* ---- background films: hero and marquee ----------------------------------
     Never autoplay by attribute. Muted is set as a property, the observer plays
     them on screen and pauses them off, and reduced motion never calls play(). */
  const watch = (target: Element, vids: HTMLVideoElement[], threshold: number) => {
    vids.forEach((v) => {
      v.muted = true;
    });
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (es) => {
        const on = es.some((e) => e.isIntersecting);
        vids.forEach((v) => (on ? play(v) : v.pause()));
      },
      { threshold },
    );
    io.observe(target);
    observers.push(io);
  };
  const hero = root.querySelector('.hero');
  const heroVid = root.querySelector<HTMLVideoElement>('.hero__video');
  if (hero && heroVid) watch(hero, [heroVid], 0.01);
  const mq = $('mq');
  watch(mq, Array.from(mq.querySelectorAll('video')), 0.15);

  /* ---- section 2 · the opened sheet ---------------------------------------- */
  const EX = '<span class="ex" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M1 5V1h4M13 9v4H9"/></svg></span>';
  const cardHTML = (c: Card, i: number) =>
    `<li><button class="bx" type="button" data-deck="s2" data-i="${i}" aria-haspopup="dialog">` +
    `<span class="bx__media"><img src="${img(c.img)}" alt=""><span class="bx__fig">${c.fig}<span class="bx__figsub">${c.figSub}</span></span>${EX}</span>` +
    `<span class="bx__body"><span class="kick">${c.kick}</span><span class="bx__title">${c.title}</span>` +
    `<span class="bx__desc">${c.desc}</span></span></button></li>`;

  const sheet = $('sheet');
  const panel = $('sheetPanel');
  let sheetFocus: HTMLElement | null = null;
  const fillSheet = (i: number) => {
    const c = TOUCHPOINTS[i];
    $('shKick').textContent = `${c.kick} · ${c.figSub}`;
    $('shTitle').textContent = c.title;
    $('shLede').textContent = c.lede;
    $<HTMLImageElement>('shImg').src = img(c.img);
    $('shFig').textContent = c.fig;
    $('shPays').innerHTML = c.pays
      .map((p) => `<div class="pays__item"><strong>${p[0]}</strong><p>${p[1]}</p></div>`)
      .join('');
    $('shCite').textContent = c.cite;
    $('shMore').innerHTML = TOUCHPOINTS.map((o, n) => (n === i ? '' : cardHTML(o, n))).join('');
    panel.scrollTop = 0;
  };
  const openSheet = (i: number) => {
    if (sheet.hidden) sheetFocus = document.activeElement as HTMLElement | null;
    fillSheet(i);
    sheet.hidden = false;
    document.body.classList.add('locked');
    raf(() => sheet.classList.add('is-on'));
    $('sheetClose').focus();
  };
  const closeSheet = () => {
    sheet.classList.remove('is-on');
    document.body.classList.remove('locked');
    later(() => {
      sheet.hidden = true;
    }, 250);
    sheetFocus?.focus();
  };
  root.addEventListener(
    'click',
    (e) => {
      const t = e.target as HTMLElement;
      const b = t.closest<HTMLElement>('.bx');
      if (b) {
        openSheet(Number(b.dataset.i));
        return;
      }
      if (t === sheet) closeSheet();
    },
    { signal },
  );
  $('sheetClose').addEventListener('click', closeSheet, { signal });
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && !sheet.hidden) closeSheet();
    },
    { signal },
  );

  /* ---- section 3 · the reel ------------------------------------------------ */
  const reel = $('reel');
  const items = Array.from(reel.querySelectorAll<HTMLElement>('.reel__item'));
  const stopReel = () =>
    reel.querySelectorAll<HTMLElement>('.reel__film').forEach((f) => {
      const v = f.querySelector('video')!;
      if (!v.paused) v.pause();
      v.controls = false;
      f.classList.remove('is-playing');
    });
  items.forEach((it, k) => {
    it.querySelector('.reel__tab')!.addEventListener(
      'click',
      () => {
        stopReel();
        items.forEach((o, n) => {
          o.classList.toggle('is-on', n === k);
          o.querySelector('.reel__tab')!.setAttribute('aria-expanded', String(n === k));
        });
      },
      { signal },
    );
  });

  /* ---- section lock --------------------------------------------------------
     One wheel or key press glides to the next frame, centred in the space under
     the fixed header. Downward only; scrolling up stays free. Past the last
     frame the page scrolls natively so the sources and footer stay reachable. */
  {
    const big = window.matchMedia('(min-width:900px) and (min-height:680px)');
    const DUR = 720;
    let busy = false;
    let last = 0;
    const chrome = () => {
      const cs = getComputedStyle(document.documentElement);
      return (parseFloat(cs.getPropertyValue('--sales-h')) || 0) + (parseFloat(cs.getPropertyValue('--nav-h')) || 0);
    };
    const framesOf = () => Array.from(root.querySelectorAll<HTMLElement>('.hero, .snap'));
    const target = (el: HTMLElement) => {
      if (el.classList.contains('hero')) return 0;
      const r = el.getBoundingClientRect();
      const y = r.top + window.scrollY;
      const top = chrome();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(0, Math.min(max, Math.round(y - top - (window.innerHeight - top - r.height) / 2)));
    };
    const current = () => {
      const top = chrome();
      const mid = top + (window.innerHeight - top) / 2;
      let best = 0;
      let bd = 1e9;
      framesOf().forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const glide = (to: number) => {
      const from = window.scrollY;
      const d = to - from;
      let t0: number | null = null;
      if (Math.abs(d) < 2) return;
      busy = true;
      document.documentElement.style.scrollBehavior = 'auto';
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const t = Math.min(1, (ts - t0) / (reduce ? 1 : DUR));
        window.scrollTo(0, from + d * ease(t));
        if (t < 1) raf(step);
        else {
          busy = false;
          last = Date.now();
          document.documentElement.style.scrollBehavior = '';
        }
      };
      raf(step);
    };
    /** The next frame's scroll target, or null once past the last frame. */
    const next = (): number | null => {
      const fs = framesOf();
      const i = current();
      const r = fs[i].getBoundingClientRect();
      const centred = Math.abs(target(fs[i]) - window.scrollY) < 6;
      const j = centred ? i + 1 : r.top > chrome() ? i : i + 1;
      if (j >= fs.length) return null;
      const to = target(fs[j]);
      return to > window.scrollY + 1 ? to : null;
    };
    const active = () =>
      big.matches && !document.body.classList.contains('locked') && sheet.hidden && $('lb').hidden;
    window.addEventListener(
      'wheel',
      (e) => {
        if (!active() || e.deltaY < 4) return;
        if (busy || Date.now() - last < 350) {
          e.preventDefault();
          return;
        }
        const to = next();
        if (to === null) return;
        e.preventDefault();
        glide(to);
      },
      { passive: false, signal },
    );
    window.addEventListener(
      'keydown',
      (e) => {
        if (!active()) return;
        const tag = ((e.target as HTMLElement).tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        const down = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
        if (!down || (e.key === ' ' && tag === 'button')) return;
        const to = next();
        if (to === null) return;
        e.preventDefault();
        if (!busy) glide(to);
      },
      { signal },
    );
  }

  /* ---- who it's for -------------------------------------------------------- */
  {
    const tabs = $('gtTabs');
    const grid = $('gtFrames');
    const btns = Array.from(tabs.querySelectorAll<HTMLButtonElement>('.gt__tab'));
    let cur = 0;
    const FEX = '<span class="fr__ex" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M1 4V1h3M11 8v3H8"/></svg></span>';
    const draw = () => {
      const g = GUESTS[cur];
      grid.innerHTML = g.lines
        .map(
          (l, i) =>
            `<li><button class="fr" type="button" data-i="${i}" aria-label="Open: ${l}"><img src="${img(g.imgs[i])}" alt="">` +
            `<span class="fr__when">${WHEN[i]}</span>${FEX}<span class="fr__line">${l}</span></button></li>`,
        )
        .join('');
      $('gtData').innerHTML = g.data;
    };
    const pick = (i: number, focus?: boolean) => {
      cur = i;
      btns.forEach((b, n) => {
        b.setAttribute('aria-selected', String(n === i));
        b.tabIndex = n === i ? 0 : -1;
      });
      grid.classList.add('is-swap');
      later(() => {
        draw();
        raf(() => grid.classList.remove('is-swap'));
      }, 200);
      if (focus) btns[i].focus();
    };
    btns.forEach((b, i) => {
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener('click', () => pick(i), { signal });
      b.addEventListener(
        'keydown',
        (e) => {
          const n = e.key === 'ArrowRight' ? (i + 1) % btns.length : e.key === 'ArrowLeft' ? (i + btns.length - 1) % btns.length : null;
          if (n !== null) {
            e.preventDefault();
            pick(n, true);
          }
        },
        { signal },
      );
    });

    const lb = $('lb');
    const film = $('lbFilm');
    const v = film.querySelector('video')!;
    let lbFocus: HTMLElement | null = null;
    const openLb = (when: string, title: string, txt: string, poster: string) => {
      lbFocus = document.activeElement as HTMLElement | null;
      $('lbWhen').textContent = when;
      $('lbTitle').textContent = title;
      $('lbTxt').textContent = txt;
      v.poster = poster;
      film.classList.remove('is-playing');
      v.controls = false;
      lb.hidden = false;
      document.body.classList.add('locked');
      raf(() => lb.classList.add('is-on'));
      $('lbX').focus();
    };
    const closeLb = () => {
      if (!v.paused) v.pause();
      lb.classList.remove('is-on');
      document.body.classList.remove('locked');
      later(() => {
        lb.hidden = true;
      }, 250);
      lbFocus?.focus();
    };
    grid.addEventListener(
      'click',
      (e) => {
        const f = (e.target as HTMLElement).closest<HTMLElement>('.fr');
        if (!f) return;
        const i = Number(f.dataset.i);
        const g = GUESTS[cur];
        openLb(
          `${g.name} · ${WHEN[i]}`,
          `${g.lines[i]}.`,
          'One of the four films this guest receives between booking and arrival, cut from your property and voiced by your own team.',
          img(g.imgs[i]),
        );
      },
      { signal },
    );
    $('gtVsl').addEventListener(
      'click',
      () =>
        openLb(
          'Watch · 0:45',
          'One Engine, Three Guest Types.',
          'The same property, filmed three ways: for the guest travelling alone, the couple, and the family.',
          img('m3.jpg'),
        ),
      { signal },
    );
    $('lbX').addEventListener('click', closeLb, { signal });
    lb.addEventListener('click', (e) => e.target === lb && closeLb(), { signal });
    document.addEventListener('keydown', (e) => e.key === 'Escape' && !lb.hidden && closeLb(), { signal });
  }

  /* ---- built on subtraction: cards open on click --------------------------- */
  root.querySelectorAll<HTMLElement>('.cd').forEach((c) => {
    const toggle = () => {
      const o = !c.classList.contains('is-open');
      c.classList.toggle('is-open', o);
      c.setAttribute('aria-expanded', String(o));
    };
    c.addEventListener('click', toggle, { signal });
    c.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      },
      { signal },
    );
  });

  /* ---- what if: the calculator console ------------------------------------- */
  {
    const tabs = $('wfTabs');
    const rng = $<HTMLInputElement>('wfRng');
    let cur = 0;
    let touched = false;
    tabs.innerHTML = MODULES.map(
      (m, i) =>
        `<button class="wf__tab" type="button" role="tab" aria-selected="${i === 0}" data-i="${i}"><b>${m.tab}</b><span>${m.hero}${AST} <small class="wf__tag">[${m.tag}]</small></span></button>`,
    ).join('');

    const update = () => {
      const m = MODULES[cur];
      const x: Record<string, number> = {};
      let ok = true;
      m.f.forEach((d) => {
        const raw = $<HTMLInputElement>('wf_' + d.id).value.trim();
        const n = parseFloat(raw);
        const er = $('wfe_' + d.id);
        if (raw === '') {
          ok = false;
          er.textContent = '';
          return;
        }
        if (isNaN(n) || n < d.min || n > d.max) {
          ok = false;
          er.textContent = `Enter a number from ${d.min} to ${d.max.toLocaleString('en-US')}.`;
          return;
        }
        er.textContent = '';
        x[d.id] = n;
      });
      if (m.rng.maxFrom && x[m.rng.maxFrom] !== undefined) {
        rng.max = String(x[m.rng.maxFrom]);
        if (!touched || +rng.value > +rng.max) rng.value = rng.max;
      }
      const rv = parseFloat(rng.value);
      $('wfRngVal').textContent = touched ? `${rv}%` : '—';
      if (!ok || !touched) {
        $('wfBig').textContent = '—';
        $('wfPer').textContent = '';
        $('wfHow').textContent = !ok
          ? 'Fill in every field and set the slider to see your result.'
          : 'Now set the slider.';
        return;
      }
      const o = m.calc(x, rv);
      $('wfBig').textContent = o.big;
      $('wfPer').textContent = o.per;
      $('wfHow').textContent = o.how;
    };

    const render = () => {
      const m = MODULES[cur];
      touched = false;
      const fig = $('wfVsl');
      const vid = fig.querySelector('video')!;
      if (!vid.paused) vid.pause();
      vid.controls = false;
      fig.classList.remove('is-playing');
      vid.poster = img(m.vsl.poster);
      fig.querySelector('.vw__cap')!.innerHTML = `<b>Watch · ${m.vsl.len}</b><span>${m.vsl.line}</span>`;
      $('wfWhy').innerHTML =
        m.why.map((d) => `<div class="wf__dp"><strong>${d[0]}${AST}</strong><span>${d[1]}</span></div>`).join('') +
        `<p class="src-note" style="margin-top:auto;padding-top:10px">${m.hero}* ${m.heroNote}</p>`;
      $('wfFields').innerHTML = m.f
        .map(
          (f) =>
            `<div class="wf__f"><label for="wf_${f.id}">${f.label}</label><div class="box">${f.pre ? `<span>${f.pre}</span>` : ''}` +
            `<input type="number" inputmode="decimal" id="wf_${f.id}" placeholder="Enter">${f.suf ? `<span>${f.suf}</span>` : ''}</div>` +
            `<span class="err" id="wfe_${f.id}"></span></div>`,
        )
        .join('');
      rng.min = String(m.rng.min);
      rng.max = String(m.rng.max);
      rng.step = String(m.rng.step);
      rng.value = String(m.rng.min);
      $('wfRngLab').textContent = m.rng.label;
      $('wfRngWrap').classList.add('is-unset');
      $('wfRngVal').textContent = '—';
      m.f.forEach((f) => $('wf_' + f.id).addEventListener('input', update, { signal }));
      update();
    };

    rng.addEventListener(
      'input',
      () => {
        touched = true;
        $('wfRngWrap').classList.remove('is-unset');
        update();
      },
      { signal },
    );
    $('wf').addEventListener('submit', (e) => e.preventDefault(), { signal });
    tabs.querySelectorAll<HTMLElement>('.wf__tab').forEach((b, i) =>
      b.addEventListener(
        'click',
        () => {
          cur = i;
          tabs.querySelectorAll('.wf__tab').forEach((t, n) => t.setAttribute('aria-selected', String(n === i)));
          render();
        },
        { signal },
      ),
    );
    render();
  }

  /* ---- section 2 · the journey phone --------------------------------------- */
  {
    const jr = $('journey');
    const MS = 4800;
    const steps = Array.from(jr.querySelectorAll<HTMLElement>('.jr__step'));
    const bubble = $('phBubble');
    let i = 0;
    let t: ReturnType<typeof setTimeout> | null = null;
    jr.style.setProperty('--jr-ms', `${MS}ms`);
    const schedule = () => {
      if (t) clearTimeout(t);
      if (!reduce && !jr.classList.contains('is-paused')) t = later(() => show((i + 1) % JOURNEY.length), MS);
    };
    const show = (n: number) => {
      i = n;
      const S = JOURNEY[n];
      steps.forEach((b, k) => {
        b.classList.toggle('is-on', k === n);
        b.setAttribute('aria-selected', String(k === n));
        const pr = b.querySelector<HTMLElement>('.jr__prog')!;
        pr.style.animation = 'none';
        void pr.offsetWidth;
        pr.style.animation = '';
      });
      $('jrDay').textContent = `Day ${S.day}`;
      $('jrLeft').textContent = `${30 - S.day} days to arrival`;
      $('jrBar').style.width = `${Math.round((S.day / 30) * 100)}%`;
      bubble.classList.add('is-swap');
      later(() => {
        $<HTMLImageElement>('phImg').src = img(S.img);
        $('phMsg').textContent = S.msg;
        $('phTime').textContent = S.time;
        $('phDate').textContent = S.date;
        $('phChip').textContent = S.chip;
        bubble.querySelector('.bubble__dur')!.textContent = S.dur;
        bubble.classList.remove('is-swap');
      }, 260);
      schedule();
    };
    steps.forEach((b, k) => b.addEventListener('click', () => show(k), { signal }));
    jr.addEventListener(
      'mouseenter',
      () => {
        jr.classList.add('is-paused');
        if (t) clearTimeout(t);
      },
      { signal },
    );
    jr.addEventListener(
      'mouseleave',
      () => {
        jr.classList.remove('is-paused');
        schedule();
      },
      { signal },
    );
    show(0);
  }

  return () => {
    ac.abort();
    timers.forEach(clearTimeout);
    frames.forEach(cancelAnimationFrame);
    observers.forEach((o) => o.disconnect());
    document.body.classList.remove('locked');
  };
}

export default function Behaviors() {
  useEffect(() => {
    const root = document.getElementById('w3');
    if (!root) return;
    return init(root);
  }, []);
  return null;
}
