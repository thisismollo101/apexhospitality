'use client';

import { useEffect, useRef } from 'react';

/**
 * The Apex mark — a tetrahedron, moved in 3D.
 *
 * The maths, the constants and the easing are the brand pack's `apexMark`,
 * carried over unchanged. The rest pose (`REST_RX`, `SC`, `CY`, `XS`) is the
 * angle that reproduces the drawn artwork exactly, so once the motion settles
 * the mark is pixel-identical to the static SVG in public/brand/svg. That is
 * what lets this be dropped in where the flat mark was without the header
 * shifting.
 *
 * Three departures from the original, all forced by React:
 *
 *  - The rest pose is server-rendered through dangerouslySetInnerHTML, so the
 *    mark is correct in the HTML before any JS runs and stays correct if none
 *    ever does. React does not diff that subtree, which is also what makes it
 *    safe for the effect below to rewrite it wholesale.
 *  - Everything is torn down on unmount: the original left its rAF loop and
 *    IntersectionObserver running forever. `reactStrictMode` is on, so in dev
 *    every mount happens twice and a leak would compound immediately.
 *  - Parallax is opt-in rather than default. On a 21px mark in the nav,
 *    pointer tracking is noise.
 *
 * Under prefers-reduced-motion the original samples the timeline at 4x its
 * duration — long settled — and never schedules another frame. That behaviour
 * is kept: one static frame in the rest pose.
 */

export type ApexAnim = 'shatter' | 'tumble' | 'fold';

/** The mark at rest. Matches svg/apex-mark-currentcolor.svg face for face. */
const REST_MARKUP =
  '<polygon points="50,11 9,85 50,63" fill="currentColor" opacity=".45"/>' +
  '<polygon points="50,11 91,85 50,63" fill="currentColor"/>' +
  '<polygon points="9,85 91,85 50,63" fill="currentColor" opacity=".22"/>';

type Vec = [number, number, number];

export default function ApexMark({
  anim = 'tumble',
  parallax = false,
  ghost = true,
  accent = true,
  depth = true,
  className,
}: {
  anim?: ApexAnim;
  /** Track the pointer once settled. Off by default — only worth it when large. */
  parallax?: boolean;
  /** Hairline outline holding the mark's final position while the faces are away. */
  ghost?: boolean;
  /** The apex is struck the instant it locks. */
  accent?: boolean;
  /** Faces further back dim while broken. Never touches the rest tones. */
  depth?: boolean;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const TAU = Math.PI * 2;
    const R = 1;
    const BY = -R / 3;
    const BR = (R * Math.SQRT2 * 2) / 3;

    const V: Vec[] = [[0, R, 0]];
    for (let k = 0; k < 3; k++) {
      const a = (k * TAU) / 3 + Math.PI / 2;
      V.push([Math.cos(a) * BR, BY, Math.sin(a) * BR]);
    }
    const F = [
      [0, 1, 2],
      [0, 3, 1],
      [1, 2, 3],
      [0, 2, 3],
    ];
    const TONE = [0.45, 1, 0.22, 0.7];
    const REST_RX = 0.301634;
    const SC = 52.3641;
    const CY = 61;
    const XS = 0.9589;

    const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const mul = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s, a[2] * s];
    const cross = (a: Vec, b: Vec): Vec => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
    const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const norm = (a: Vec): Vec => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1e-6));
    const cl = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const expo = (q: number) => (q >= 1 ? 1 : 1 - Math.pow(2, -10 * q));
    const cube = (q: number) => 1 - Math.pow(1 - cl(q, 0, 1), 3);
    const inOut = (q: number) => (q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2);
    const back = (q: number) => {
      const c = 1.42;
      const x = cl(q, 0, 1);
      return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
    };

    function tf(p: Vec, rx: number, ry: number, rz: number): Vec {
      let [x, y, z] = p;
      let c = Math.cos(ry);
      let s = Math.sin(ry);
      [x, z] = [x * c + z * s, -x * s + z * c];
      c = Math.cos(rz);
      s = Math.sin(rz);
      [x, y] = [x * c - y * s, x * s + y * c];
      c = Math.cos(rx);
      s = Math.sin(rx);
      [y, z] = [y * c + z * s, z * c - y * s];
      return [x, y, z];
    }
    function rotAxis(p: Vec, a: Vec, axis: Vec, ang: number): Vec {
      const k = norm(axis);
      const v = sub(p, a);
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      return add(a, add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c))));
    }
    const pr = (p: Vec, sc: number): [number, number] => [50 + p[0] * SC * XS * sc, CY - p[1] * SC * sc];

    const NS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    const ghostEl = document.createElementNS(NS, 'polygon');
    ghostEl.setAttribute('points', '50,11 9,85 91,85');
    ghostEl.setAttribute('fill', 'none');
    ghostEl.setAttribute('stroke', 'currentColor');
    ghostEl.setAttribute('stroke-width', '0.7');
    ghostEl.setAttribute('stroke-linejoin', 'round');
    ghostEl.setAttribute('opacity', '0');
    if (ghost) svg.appendChild(ghostEl);

    const poly = F.map(() => {
      const el = document.createElementNS(NS, 'polygon');
      el.setAttribute('fill', 'currentColor');
      svg.appendChild(el);
      return el;
    });

    const accentEl = document.createElementNS(NS, 'circle');
    accentEl.setAttribute('cx', '50');
    accentEl.setAttribute('cy', '11');
    accentEl.setAttribute('fill', 'currentColor');
    accentEl.setAttribute('r', '0');
    if (accent) svg.appendChild(accentEl);

    const DUR = anim === 'shatter' ? 1.75 : anim === 'fold' ? 1.6 : 1.35;

    /* Per-face stagger — the whole point is that they do NOT move together. */
    const OUT_LAG = [0, 0.045, 0.022, 0.065];
    const IN_LAG = [0.1, 0, 0.055, 0.13];

    type State = {
      strike: number;
      rx: number;
      ry: number;
      rz: number;
      sc: number;
      spread: (i: number) => number;
      spin: (i: number) => number;
      hinge: (i: number) => number;
      ghost: number;
    };

    function state(t: number): State {
      const q = cl(t / DUR, 0, 1);
      const idle = Math.max(0, t - DUR);
      const sx = Math.sin(idle * 0.7) * 0.013;
      const sy = Math.sin(idle * 0.5) * 0.019;
      const lockAt = anim === 'shatter' ? 0.965 : 0.9;
      const strike = Math.exp(-Math.pow((q - lockAt) / 0.035, 2));

      if (anim === 'tumble') {
        return {
          strike,
          rx: REST_RX + 0.95 * Math.exp(-5.2 * q) * Math.cos(8.2 * q) + sx,
          ry: 2 * TAU * expo(q) + sy,
          rz: 0.38 * Math.exp(-5.4 * q) * Math.sin(7.0 * q),
          sc: 0.72 + 0.28 * back(cl(q / 0.86, 0, 1)),
          spread: () => 0,
          spin: () => 0,
          hinge: () => 0,
          ghost: 0,
        };
      }
      if (anim === 'fold') {
        const a = (q < 0.42 ? 1 - cube(q / 0.42) : 0) * 2.15;
        return {
          strike,
          rx: REST_RX + 0.2 * Math.sin(q * Math.PI) + sx,
          ry: 0.55 * (1 - cube(q)) + sy,
          rz: 0,
          sc: 0.9 + 0.1 * cube(q),
          spread: () => 0,
          spin: () => 0,
          hinge: (i: number) => (i < 3 ? a * (1 - i * 0.06) : 0),
          ghost: 0.5 * (1 - cube(q / 0.75)),
        };
      }
      const env = (i: number) => {
        const qo = cl((q - 0.09 - OUT_LAG[i]) / 0.17, 0, 1);
        const qi = cl((q - 0.52 - IN_LAG[i]) / (0.48 - IN_LAG[i]), 0, 1);
        return q < 0.09 + OUT_LAG[i]
          ? 0
          : q < 0.52 + IN_LAG[i]
            ? cube(qo) * (1 + Math.max(0, q - 0.26) * 0.3)
            : (1 + 0.078) * (1 - inOut(qi));
      };
      return {
        strike,
        rx: REST_RX + 0.4 * Math.sin(q * Math.PI) + sx,
        ry: TAU * inOut(q) + sy,
        rz: 0.16 * Math.sin(q * TAU) * (1 - q),
        sc: q < 0.09 ? 1 - 0.055 * (q / 0.09) : 1,
        spread: (i: number) => env(i) * (0.55 + i * 0.16),
        spin: (i: number) => env(i) * (1.5 + i * 0.55),
        hinge: () => 0,
        ghost: 0.42 * cube(cl((q - 0.12) / 0.14, 0, 1)) * (1 - cube(cl((q - 0.72) / 0.28, 0, 1))),
      };
    }

    let raf = 0;
    const t0 = performance.now();
    let vis = true;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // An arrow bound to a const, not a function declaration: a declaration is
    // hoisted, so TypeScript discards the `if (!svg) return` narrowing inside
    // it and every svg.* below becomes possibly-null.
    const frame = (now: number) => {
      const t = reduced ? DUR * 4 : (now - t0) / 1000;
      const st = state(t);
      mx += (tx - mx) * 0.09;
      my += (ty - my) * 0.09;
      const settled = cl((t - DUR) / 0.45, 0, 1);
      const RX = st.rx + my * 0.24 * settled;
      const RY = st.ry + mx * 0.34 * settled;
      const RZ = st.rz;

      if (ghost) ghostEl.setAttribute('opacity', st.ghost.toFixed(3));
      if (accent) {
        accentEl.setAttribute('r', (st.strike * 2.6).toFixed(2));
        accentEl.setAttribute('opacity', (st.strike * 0.9).toFixed(3));
      }

      let maxSpread = 0;
      const drawn: { fi: number; pts: [number, number][]; z: number; front: boolean }[] = [];
      F.forEach((f, fi) => {
        let pts: Vec[] = f.map((i) => [...V[i]] as Vec);
        const hg = st.hinge(fi);
        if (hg) {
          const e1 = V[f[1]];
          const e2 = V[f[2]];
          pts = pts.map((p) => rotAxis(p, e1, sub(e2, e1), hg));
        }
        let n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
        const cen = mul(pts.reduce<Vec>((a, b) => add(a, b), [0, 0, 0]), 1 / 3);
        if (dot(n, cen) < 0) n = mul(n, -1);
        const sp = st.spin(fi);
        const sd = st.spread(fi);
        maxSpread = Math.max(maxSpread, sd);
        if (sp) pts = pts.map((p) => add(tf(sub(p, cen), sp, sp * 0.7, sp * 0.35), cen));
        if (sd) pts = pts.map((p) => add(p, mul(n, sd)));
        const rp = pts.map((p) => tf(p, RX, RY, RZ));
        const rn = tf(n, RX, RY, RZ);
        drawn.push({
          fi,
          pts: rp.map((p) => pr(p, st.sc)),
          z: (rp[0][2] + rp[1][2] + rp[2][2]) / 3,
          front: rn[2] > 0,
        });
      });

      const whole = maxSpread < 0.02;
      const list = (whole ? drawn.filter((d) => d.front) : drawn).sort((a, b) => a.z - b.z);
      const zs = list.map((d) => d.z);
      const zlo = Math.min(...zs);
      const zhi = Math.max(...zs);
      poly.forEach((p) => {
        p.setAttribute('points', '');
        p.setAttribute('opacity', '0');
      });
      list.forEach((d) => {
        const el = poly[d.fi];
        el.setAttribute('points', d.pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' '));
        let op = TONE[d.fi];
        if (depth && !whole && zhi > zlo) op *= 0.62 + 0.38 * ((d.z - zlo) / (zhi - zlo));
        el.setAttribute('opacity', op.toFixed(3));
        svg.appendChild(el);
      });
      if (accent) svg.appendChild(accentEl);

      if (!reduced && vis) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    if (parallax) {
      svg.addEventListener('pointermove', onMove, { passive: true });
      svg.addEventListener('pointerleave', onLeave);
    }

    const io = new IntersectionObserver((es) => {
      vis = es[0].isIntersecting;
      if (vis && !raf) raf = requestAnimationFrame(frame);
      if (!vis && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(svg);
    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerleave', onLeave);
      // Leave the rest pose behind, so a re-mount starts from the real mark
      // rather than an empty box.
      svg.innerHTML = REST_MARKUP;
    };
  }, [anim, parallax, ghost, accent, depth]);

  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: REST_MARKUP }}
    />
  );
}
