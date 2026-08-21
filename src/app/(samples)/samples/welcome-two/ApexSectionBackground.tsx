'use client';

import { useEffect, useRef } from 'react';

/* ---------------------------------------------------------------------------
   Apex section background
   ---------------------------------------------------------------------------
   A WebGL particle field on a transparent canvas. A tetrahedron holds and
   turns, locks onto the logo's viewing angle, detonates toward the viewer,
   morphs through a full-width sheet and a hollow shell, then gathers back as
   four pieces and reassembles. 17.5s loop.

   No dependencies — raw WebGL, one static buffer set, one draw call per frame.
   Pauses off-screen and holds a single static frame under prefers-reduced-motion.

   Two rules if you edit CONFIG:
     - T must ascend and stay below 1
     - turns + homeSpins must be a whole number, or the rotation snaps at the
       instant the pyramid finishes forming
--------------------------------------------------------------------------- */

export type RestMotion = 'orbit' | 'tumble' | 'drift';

type Props = {
  /** Cycle the palette when the visitor clicks. Off by default on live pages. */
  clickToShift?: boolean;
  /** Which palette to open on. */
  palette?: 'Cobalt' | 'Nebula' | 'Ember' | 'Aurora';
  /** How the mark behaves while assembled. */
  restMotion?: RestMotion;
  /** Particle count. Lower it if the section shares a page with other canvases. */
  count?: number;
  className?: string;
};


const BASE_CONFIG = {

  // ---- scale -------------------------------------------------------------
  count: 155000,        // particle total; drop to 130000 for weak hardware
  cycleSec: 17.5,       // one full loop
  pointScale: 3.0,
  projScale: 1.85,

  /* ---- timeline ----------------------------------------------------------
     Cumulative fractions of the cycle. MUST ascend and stay below 1.
     The pyramid is the only resting point — the windows on the burst, the
     sheet and the shell are collapsed to ~0.05s so the field never parks
     anywhere else.

       hold (pyramid)  1.75s     morph -> wide   5.06s
       BANG            0.58s     morph -> shell  5.44s
       burst           0.05s     home (gather)   4.52s                     */
  T: [0.1000, 0.1333, 0.1361, 0.4250, 0.4278, 0.7389, 0.7417],

  // ---- framing -----------------------------------------------------------
  centerY: 0.02,        // NDC; lower sits the mark further down the screen
  centerYMobile: 0.02,
  tiltDeg: 30,          // resting camera elevation
  pyrScale: 0.66,
  tetraR: 1.15,         // circumradius of the tetrahedron
  edgeShare: 0.12,      // keep LOW — high values hollow out the faces
  faceFill: 0.35,       // share of face points pulled just inside the surface

  /* ---- the deep field ----------------------------------------------------
     These never join the pyramid, so they are the only thing on screen while
     the mark is held. Enough of them, spread wide enough, and the frame reads
     as space rather than an empty page.                                    */
  ambientShare: 0.30,
  ambientNear: 1.25, ambientFar: 6.20,
  ambientBright: 0.13,  // fraction drawn large enough to read as single stars
  ambientAlpha: 0.80,

  /* ---- the blast ---------------------------------------------------------
     Two jobs, and they fight each other: the SILHOUETTE must die instantly,
     while the DEBRIS must travel visibly. Scramble does the first, the burst
     lerp does the second. Collapsing them into one control gives you either
     a lingering pyramid or a field that vanishes.                          */
  blastScramble: 0.05,  // TIMING — fraction of the blast to finish scrambling
  scrambleAmount: 0.55, // DISTANCE — enough to destroy structure, not teleport
  blastMin: 3.0,        // floor launch speed
  blastSpread: 4.0,     // extra speed on top, varies per particle
  blastKick: 0.42,      // outward shove at detonation
  blastFlash: 3.20,     // brightness kick
  whiteFlash: 0.92,     // how far the flash blows out to white
  blastOut: 0.46, blastOutAt: 0.18,   // thrown outward...
  blastIn : 0.32, blastInAt : 0.66,   // ...then drawn back in

  /* ---- coming at you -----------------------------------------------------
     Looming is the cue. Things must EXPAND fast and leave past the edges of
     the frame; brightness alone never reads as approach.                   */
  dollyBack: 0.26,      // camera pulls back first — raise with dolly
  dolly: 1.62,          // then lunges in
  burstToward: 0.95,    // extra camera-ward throw (applied in CAMERA space)
  comeAt: 2.30,         // forward acceleration out of the detonation
  passNear: 0.55,       // debris fades as it crosses the camera plane
  spreadNear: 0.75,     // near debris flung past the frame edges

  /* ---- morph shapes ------------------------------------------------------ */
  burstNear: 0.75, burstFar: 3.60, burstWide: 1.40,
  wideSpan: 4.4, wideRise: 0.56, wideDepth: 1.10,
  shellR: 1.95, shellWide: 1.70, shellFlat: 0.92,

  /* ---- coming home -------------------------------------------------------
     The field gathers as four pieces before it closes, spins down like a
     coin, then hands off to the rest motion.                               */
  homeShatter: 0.46,    // how far apart the pieces sit while gathering
  chunkLag: 0.30,       // stagger between the four pieces
  homeSpins: 5.0,       // turns in the landing spin
  homeWobble: 0.34,     // damped tilt as it settles

  /* ---- rotation ----------------------------------------------------------
     turns + homeSpins MUST be a whole number. The excursion yaw resets when
     the cycle wraps, so any fraction lands as a hard snap at the instant the
     pyramid finishes forming — 0.50 here was a 180-degree jump.            */
  turns: 1.0,
  drift: 0.085,
  bulge: 0.34,
  stagger: 0.35,        // slow transitions ONLY — never the blast trigger
  restMotion: "tumble", // "orbit" | "tumble" | "drift" — or press 1 / 2 / 3

  /* ---- locking onto the logo ---------------------------------------------
     Seconds, converted against cycleSec on upload. The mark eases onto the
     angle that reproduces the drawn artwork, holds a beat, then detonates.
     The ambient field is never locked — it keeps turning around the mark.  */
  settleSec: 0.9,       // easing onto the angle
  holdPoseSec: 0.2,     // the beat on the mark
  releaseSec: 0.45,     // the lock lets go this long AFTER the blast
  poseTilt: -0.301634,  // the angle that reproduces the mark
  poseSnap: 0.94,       // how completely the sway is squeezed out by the blast
  lastSlow: 0.30,       // final tumble eases to this share of its speed

  /* Hold the POSE, not the motion. Rate is amplitude x frequency — a big slow
     sway barely moves and reads as parked.                                 */
  hoverYaw: 0.13,
  hoverTilt: 0.06,
  hoverFloat: 0.05,
  hoverBreath: 1.7,

  // ---- input -------------------------------------------------------------
  mouseYaw: 1.45,
  mouseTilt: 0.80,
  mouseLift: 0.78,
  mouseEase: 0.12,
  clickToShift: true,   // false locks the palette to Cobalt

  // ---- colour ------------------------------------------------------------
  theme: "dark",        // "dark" | "light"
  transitionMs: 1200,   // palette cross-fade

  /* Cobalt leads — it is the site blue. Six tones each, mapped low-to-high up
     the pyramid. Keep the luminance steps even; two adjacent tones close in
     brightness flatten that part of the gradient.                          */
  palettes: [
    { name:"Cobalt", colors:["#10267F","#1D4FE6","#2E8CFF","#4FD2FF","#B9EEFF","#FFFFFF"] },
    { name:"Nebula", colors:["#4A27C4","#7B3FE4","#C64FD8","#4C6FFF","#B79BFF","#EBD9FF"] },
    { name:"Ember",  colors:["#B01A2C","#D6321F","#FF7A2C","#FFA62B","#FFC98F","#FFE3C2"] },
    { name:"Aurora", colors:["#0E5F3A","#149E5F","#28C96B","#5FE3A8","#AEF5CE","#EEFFF6"] }
  ]
};

type Uniforms = Record<string, WebGLUniformLocation | null>;

export default function ApexSectionBackground({
  clickToShift = false,
  palette = 'Cobalt',
  restMotion = 'tumble',
  count,
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Props win over the defaults. Copied, never mutated — the module constant
    // is shared by every instance on the page.
    const CONFIG = {
      ...BASE_CONFIG,
      count: count ?? BASE_CONFIG.count,
      restMotion,
      clickToShift,
    };

    const gl =
      (canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        powerPreference: 'high-performance',
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      canvas.style.display = 'none';   // the CSS keeps a plain black panel
      return;
    }

    const hex01 = (h: string) => {
      const v = h.replace('#', '');
      return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
    };
    const P = CONFIG.palettes.map((p) => ({
      name: p.name,
      cols: new Float32Array(p.colors.flatMap(hex01)),
    }));

    const startIdx = Math.max(0, P.findIndex((p) => p.name === palette));
    let prev = startIdx;
    let next = startIdx;
    let mix = 1;
    let transStart = 0;
    const transDur = reduced ? 400 : CONFIG.transitionMs;

    let mouse: [number, number] = [0.5, 0.5];
    let mouseTarget: [number, number] = [0.5, 0.5];

    const vw = host.clientWidth || window.innerWidth;

    const N = Math.max(40000, Math.round(CONFIG.count*(vw < 760?.34:vw < 1200?.68:1)));
    const pyr   = new Float32Array(N*3);
    const burst = new Float32Array(N*3);
    const wide  = new Float32Array(N*3);
    const shell = new Float32Array(N*3);
    const meta  = new Float32Array(N*4);
    const chunk = new Float32Array(N*4);   // face normal (xyz) + chunk index (w)   // [height, sizeVar, seed, ambient]

    const R=Math.random;
    const S=CONFIG.pyrScale;

    /* ---- regular tetrahedron ----
       Four congruent equilateral faces, six equal edges. Land it on any face and
       it is the same solid — which is what "all sides equal" requires, and what
       lets the rest motion roll it onto its side without breaking the read.
       Circumradius RR: apex at +RR, the three base vertices at -RR/3 on a ring
       of radius RR*sqrt(8)/3. */
    const RR=CONFIG.tetraR;
    const BYY=-RR/3, BRAD=RR*Math.SQRT2*2/3;
    const V=[[0,RR,0]];
    for(let k=0;k<3;k++){
      const a=k*Math.PI*2/3 + Math.PI/2;
      V.push([Math.cos(a)*BRAD, BYY, Math.sin(a)*BRAD]);
    }
    const FACES=[[0,1,2],[0,2,3],[0,3,1],[1,3,2]];
    const EDGES=[[V[0],V[1]],[V[0],V[2]],[V[0],V[3]],
                 [V[1],V[2]],[V[2],V[3]],[V[3],V[1]]];
    const MINY=BYY, MAXY=RR;
    const FN = FACES.map(f=>{
      const a=V[f[0]], b=V[f[1]], c=V[f[2]];
      const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]], v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
      let n=[u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
      const cen=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3,(a[2]+b[2]+c[2])/3];
      if(n[0]*cen[0]+n[1]*cen[1]+n[2]*cen[2] < 0) n=n.map(t=>-t);
      const l=Math.hypot(n[0],n[1],n[2]);
      return n.map(t=>t/l);
    });
    const nAmb=Math.round(N*CONFIG.ambientShare);
    const nEdge=Math.round((N-nAmb)*CONFIG.edgeShare);
    const CORE=[0,0,0];                 // a tetrahedron's centroid is its origin

    for(let i=0;i<N;i++){
      if(i < nAmb){
        /* Ambient: lives out in space permanently. Every shape buffer gets the
           SAME position, so no blend can ever pull it into the pyramid. */
        const au=R()*2-1, at=R()*Math.PI*2, as=Math.sqrt(1-au*au);
        const ar=CONFIG.ambientNear + Math.pow(R(),0.75)*(CONFIG.ambientFar-CONFIG.ambientNear);
        const ax=Math.cos(at)*as*ar*1.45, ay=au*ar*0.78, az=Math.sin(at)*as*ar;
        pyr[i*3]=ax;   pyr[i*3+1]=ay;   pyr[i*3+2]=az;
        burst[i*3]=ax; burst[i*3+1]=ay; burst[i*3+2]=az;
        wide[i*3]=ax;  wide[i*3+1]=ay;  wide[i*3+2]=az;
        shell[i*3]=ax; shell[i*3+1]=ay; shell[i*3+2]=az;
        meta[i*4]=0.42+R()*0.50;
        /* Bimodal: mostly fine dust, with a scattering of larger points so the
           eye finds individual stars instead of an even haze. */
        meta[i*4+1] = R() < CONFIG.ambientBright
          ? 1.30 + Math.pow(R(),1.5)*1.30
          : 0.34 + Math.pow(R(),2.6)*0.80;
        meta[i*4+2]=R();
        meta[i*4+3]=1.0;
        chunk[i*4]=0; chunk[i*4+1]=0; chunk[i*4+2]=0; chunk[i*4+3]=0;
        continue;
      }

      // ---- pyramid ----
      let x: number, y: number, z: number;
      let fk = 0;
      if((i-nAmb)<nEdge){
        const e=EDGES[(R()*6)|0], t=R(), j=()=>(R()-0.5)*0.024;
        x=e[0][0]+(e[1][0]-e[0][0])*t+j();
        y=e[0][1]+(e[1][1]-e[0][1])*t+j();
        z=e[0][2]+(e[1][2]-e[0][2])*t+j();
        // an edge point joins whichever face it faces most
        let best=-2; fk=0;
        FN.forEach((n,k)=>{ const d=n[0]*x+n[1]*y+n[2]*z; if(d>best){best=d; fk=k;} });
      } else {
        // all four faces sampled equally — none is a "base"
        fk=(R()*4)|0;
        const f=FACES[fk];
        const a=V[f[0]], b=V[f[1]], c2=V[f[2]];
        let uu=R(), vv=R(); if(uu+vv>1){ uu=1-uu; vv=1-vv; }
        const ww=1-uu-vv, j=()=>(R()-0.5)*0.022;
        x=a[0]*ww+b[0]*uu+c2[0]*vv+j();
        y=a[1]*ww+b[1]*uu+c2[1]*vv+j();
        z=a[2]*ww+b[2]*uu+c2[2]*vv+j();
        if(R()<CONFIG.faceFill){
          const g=R()*0.13;
          x+=(CORE[0]-x)*g; y+=(CORE[1]-y)*g; z+=(CORE[2]-z)*g;
        }
      }
      chunk[i*4]=FN[fk][0]; chunk[i*4+1]=FN[fk][1]; chunk[i*4+2]=FN[fk][2];
      chunk[i*4+3]=fk/3;
      meta[i*4]=Math.max(0,Math.min(1,(y-MINY)/(MAXY-MINY)));
      pyr[i*3]=x*S; pyr[i*3+1]=y*S; pyr[i*3+2]=z*S;

      /* ---- burst ----
         Destinations are angularly UNCORRELATED with where a particle started.
         Sending each point outward along its own direction from the centre (as
         an earlier version did) preserves angular position — the pyramid simply
         inflates and stays a pyramid. Randomising the destination is what
         destroys the silhouette. The violence comes from speed, not from
         direction. */
      const bu=R()*2-1, bt=R()*Math.PI*2, bs=Math.sqrt(1-bu*bu);
      const br=CONFIG.burstNear + Math.pow(R(),0.45)*(CONFIG.burstFar-CONFIG.burstNear);
      burst[i*3]  = Math.cos(bt)*bs*br*CONFIG.burstWide;
      burst[i*3+1]= bu*br*0.95;
      burst[i*3+2]= Math.sin(bt)*bs*br;

      // ---- wide sheet ----
      const wx=(R()*2-1)*CONFIG.wideSpan;
      const wy=((R()+R()+R())/1.5-1)*CONFIG.wideRise + 0.30*Math.sin(wx*0.95) + 0.12*Math.sin(wx*2.6);
      const wz=((R()+R())-1)*CONFIG.wideDepth;
      wide[i*3]=wx; wide[i*3+1]=wy; wide[i*3+2]=wz;

      // ---- shell ----
      const su=R()*2-1, st=R()*Math.PI*2, sr=CONFIG.shellR+(R()-0.5)*0.20, ss=Math.sqrt(1-su*su);
      shell[i*3]=Math.cos(st)*ss*sr*CONFIG.shellWide;
      shell[i*3+1]=su*sr*CONFIG.shellFlat;
      shell[i*3+2]=Math.sin(st)*ss*sr;

      meta[i*4+1]=0.55+Math.pow(R(),2.2)*1.55;
      meta[i*4+2]=R();
      meta[i*4+3]=0.0;
    }


    const VERT = `
    precision highp float;
    attribute vec3 aPyr, aBurst, aWide, aShell;
    attribute vec4 aMeta;                     // height, sizeVar, seed, ambient
    attribute vec4 aChunk;                    // face normal (xyz), chunk index 0..1 (w)

    uniform float uTime, uMix, uAspect, uPointScale, uMotion;
    uniform float uPhase, uStagger, uBulge, uProj, uTurns, uDrift;
    uniform float uMYaw, uMTilt, uMLift;
    uniform float uBaseTilt, uSpread, uFlash, uSpreadMin, uKick, uScrambleIn, uScrambleAmt;
    uniform float uMode, uLight;
    uniform float uSettleWin, uPoseTilt, uHoldPose;
    uniform float uHoverYaw, uHoverTilt, uHoverFloat, uHoverBreath, uPoseSnap;
    uniform float uCycleSec, uRelease, uLastSlow, uDolly, uWhite, uAmbA;
    uniform float uDollyBack, uComeAt, uPassNear, uSpreadNear, uBurstToward;
    uniform float uHomeShatter, uChunkLag, uHomeSpins, uHomeWobble;
    uniform float uBlastOut, uBlastOutAt, uBlastIn, uBlastInAt;
    uniform float uT[7];
    uniform vec2  uMouse, uCenter;
    uniform vec3  uPrev[6];
    uniform vec3  uNext[6];

    varying vec3 vCol;
    varying float vA;

    vec3 pal(int i){ return mix(uPrev[i], uNext[i], uMix); }

    /* Assembled-time accumulator.
       The rest motion used to be written as t*rate and then multiplied by w0.
       Because t grows without bound, that multiplication injects an ever larger
       spin as w0 ramps in — 5 turns after a minute, 55 after ten. This integrates
       the ramp instead of scaling the angle, so the rotation advances only while
       the mark is together and never jumps. */
    float assembledFrac(float xx, float t6, float t0){
      float a = min(xx, t0);
      if(xx > t6){
        float U = (xx - t6)/(1.0 - t6);
        a += (1.0 - t6) * (U + (pow(1.0-U, 4.0) - 1.0)*0.25);
      }
      return a;
    }

    // stagger applied to a transition's progress, not to the timeline itself
    float flow(float e, float s, float amt){
      return clamp((e - s*amt) / max(1.0 - amt, 0.001), 0.0, 1.0);
    }

    // a stable random direction per particle
    vec3 rnd3(float s){
      vec3 v = vec3(fract(sin(s*127.11)*43758.5453),
                    fract(sin(s*311.71)*24634.6345),
                    fract(sin(s* 74.77)*18729.1234)) - 0.5;
      return normalize(v + 1e-4);
    }

    void main(){
      float TAU = 6.28318530718;
      float t = uTime * uMotion;
      float h = aMeta.x, seed = aMeta.z, amb = aMeta.w;
      float act = 1.0 - amb;                    // 0 for ambient points

      // Global phase — NO per-particle offset. Every particle hits the blast
      // trigger on the same frame; flow is applied inside the slow transitions.
      float x = mod(uPhase + 4.0, 1.0);

      // ---- four states ----
      float w0=0.0, w1=0.0, w2=0.0, w3=0.0, e;
      if(x < uT[0]){ w0 = 1.0; }
      else if(x < uT[1]){                                   // BIG BANG
        /* Every particle needs a high FLOOR speed. If the slowest ones crawl,
           they sit in place still tracing the pyramid while the fast debris
           leaves — and you get an explosion happening around an intact shape.
           uSpreadMin is the floor; uSpread is the variation on top of it. */
        float q = (x-uT[0])/(uT[1]-uT[0]);
        e = 1.0 - pow(1.0-q, uSpreadMin + seed*uSpread);
        w0 = 1.0-e; w1 = e;
      }
      else if(x < uT[2]){ w1 = 1.0; }
      else if(x < uT[3]){ e = flow((x-uT[2])/(uT[3]-uT[2]), seed, uStagger); w1 = 1.0-e; w2 = e; }
      else if(x < uT[4]){ w2 = 1.0; }
      else if(x < uT[5]){ e = flow((x-uT[4])/(uT[5]-uT[4]), seed, uStagger); w2 = 1.0-e; w3 = e; }
      else if(x < uT[6]){ w3 = 1.0; }
      else {                                                // implode home
        e = (x-uT[6])/(1.0-uT[6]); e = 1.0 - pow(1.0-e, 3.0);
        e = flow(e, seed, uStagger*0.6);
        w3 = 1.0-e; w0 = e;
      }

      vec3 p = aPyr*w0 + aBurst*w1 + aWide*w2 + aShell*w3;
      float transit = (1.0 - max(max(w0,w1), max(w2,w3))) * act;

      /* ---- coming home ----
         The field doesn't slide straight into the solid. It gathers into four
         separated pieces first — each held off along its own face normal — and
         those pieces close on their own beats. The logo's shatter, backwards. */
      float homeU = 0.0;
      if(x >= uT[6]){
        homeU = (x-uT[6])/(1.0-uT[6]);
        float lag = aChunk.w * uChunkLag;
        float k = clamp((homeU-lag)/max(1.0-lag,0.001), 0.0, 1.0);
        float apart = 1.0 - smoothstep(0.26, 0.88, k);
        p += aChunk.xyz * uHomeShatter * apart * act;
      }

      // ---- blast: thrown outward, then drawn back in ----
      float pulse = 1.0;
      float flash = 0.0;
      if(x >= uT[0] && x < uT[2]){
        float q = (x-uT[0])/(uT[2]-uT[0]);
        pulse += uBlastOut * exp(-pow((q-uBlastOutAt)/0.20, 2.0));
        pulse -= uBlastIn  * exp(-pow((q-uBlastInAt )/0.26, 2.0));
        flash  = exp(-pow((q-0.035)/0.065, 2.0));
      }
      p *= mix(1.0, pulse, act);

      /* Shove everything radially outward the instant the blast starts. This is
         belt-and-braces against a lingering silhouette: even a slow particle is
         pushed off its pyramid position immediately. */
      if(x >= uT[0] && x < uT[1]){
        float qk = (x-uT[0])/(uT[1]-uT[0]);
        p += normalize(p + 1e-4) * uKick * qk * act;
        /* Scramble completes inside uScrambleIn of the blast, then holds. At
           0.05 that is roughly two frames — the silhouette is gone before the
           eye registers it moving. */
        float sr = clamp(qk / max(uScrambleIn, 0.001), 0.0, 1.0);
        sr = sr*sr*(3.0 - 2.0*sr);
        p += rnd3(seed) * uScrambleAmt * sr * act;
      }

      p += normalize(p + 1e-4) * transit * uBulge;
      p.y += transit * 0.09 * sin(seed*24.0 + t*1.2);

      // ---- mouse: full strength on the pyramid, parallax for the ambient field ----
      /* ---- settle into the logo pose ----
         Zero for most of the cycle; ramps only across the lock, then stays at
         1 through the hover. */
      /* Time remaining until the blast, measured across the wrap — that's what
         lets the lock begin during the gather rather than only in the hold. */
      float tb = (x < uT[0]) ? (uT[0]-x) : (uT[0] + (1.0-x));
      float settle = 0.0;
      if(uSettleWin > 0.0){
        float sIn;
        if(x <= uT[0]){
          sIn = clamp((uSettleWin + uHoldPose - tb)/uSettleWin, 0.0, 1.0);
        } else {
          /* Release. The lock used to snap from 1 to 0 in a single frame at the
             blast, which threw the orientation back to its free value instantly.
             It now lets go across uRelease. */
          sIn = 1.0 - smoothstep(0.0, uRelease, x - uT[0]);
        }
        settle = sIn*sIn*(3.0-2.0*sIn);
      }

      /* Absolute time AT the blast — same expression either side of it, so it is
         continuous through the blast. This is what lets the pose target be an
         exact predicted value instead of a nearest-turn guess. */
      float tB = t + (uT[0]-x)*uCycleSec;
      /* Ambient points are NEVER locked — the starfield keeps turning around the
         mark while the mark holds its angle. This is the difference between a
         held pose and a frozen frame. */
      float settleP = settle * act;

      /* Ramps 0 -> 1 across the final beat. Everything that moves the mark off
         the logo angle is scaled down by it, so the last frame before the blast
         is square-on. */
      float poseTight = clamp((uHoldPose - tb)/max(uHoldPose,0.001), 0.0, 1.0);
      poseTight = poseTight*poseTight*(3.0-2.0*poseTight);
      float hoverAmp = 1.0 - uPoseSnap*poseTight;

      float resp = mix(0.32 + 0.68*w0, 0.30, amb) * (1.0 - settleP*0.45);
      vec2  m = uMouse - 0.5;
      p.y += m.y * uMLift * resp;
      p.x += m.x * uMLift * 0.42 * resp;

      float extra;
      if(x < uT[0]){ extra = 0.0; }
      /* LINEAR, not eased. smoothstep here made the swirl accelerate into the
         middle and coast out of it; a constant rate keeps the speed steady all
         the way across the excursion. */
      else if(x < uT[6]){ extra = ((x-uT[0])/(uT[6]-uT[0])) * uTurns * TAU; }
      else {
        /* easeInOutQuart: zero slope at both ends, so it accelerates smoothly out
           of the steady swirl instead of jumping to speed, then settles */
        float sp = homeU < 0.5 ? 8.0*homeU*homeU*homeU*homeU
                               : 1.0 - pow(-2.0*homeU + 2.0, 4.0)/2.0;
        extra = uTurns*TAU + uHomeSpins*TAU*sp;
      }
      /* ---- rest motion: how it behaves while assembled ----
         Weighted by w0, so it's full strength as a pyramid and eases out as the
         shape leaves. Three characters, switchable at runtime. */
      float rest = w0;
      float ry = 0.0, rp = 0.0, rr = 0.0, ryB = 0.0, rySlope = 0.0;
      vec2 bob = vec2(0.0);

      /* seconds of assembled time, this cycle and every one before it */
      float A1   = uT[0] + (1.0-uT[6])*0.75;
      float nCyc = floor(uTime/uCycleSec);
      float acc  = uCycleSec*(nCyc*A1 + assembledFrac(x,     uT[6], uT[0]));
      float accB = uCycleSec*(nCyc*A1 + uT[0]);        // its value at the blast

      if(uMode < 0.5){                     // orbit — upright spin, wide lean
        ry  = acc*0.55; ryB = accB*0.55; rySlope = 0.55;
        rp  = sin(acc*0.33)*0.34;
        rr  = sin(acc*0.21)*0.30;
        bob = vec2(sin(acc*0.19)*0.06, sin(acc*0.42)*0.14);
      } else if(uMode < 1.5){              // tumble — rolls onto every face
        ry  = acc*0.58; ryB = accB*0.58; rySlope = 0.58;
        rp  = acc*0.31;                      // continuous, so it turns end over end
        rr  = acc*0.19 + sin(acc*0.27)*0.55; // and onto its side
        bob = vec2(sin(acc*0.31)*0.10, cos(acc*0.39)*0.12);
      } else {                             // drift — lazy float, still turns over
        ry  = acc*0.26 + sin(acc*0.21)*0.45;
        ryB = accB*0.26 + sin(accB*0.21)*0.45;  rySlope = 0.26;
        rp  = sin(acc*0.17)*0.62;
        rr  = sin(acc*0.13)*0.70;
        bob = vec2(sin(acc*0.23)*0.17, sin(acc*0.46)*0.11);
      }

      float yaw = t*uDrift + extra*act + m.x * uMYaw * resp * (1.0-settleP) + ry;
      /* Ease to the NEAREST whole turn, never a fixed angle — otherwise it would
         unwind up to half a revolution to get there. */
      /* Pull toward the pose by subtracting the yaw this particle WILL have at the
         blast. That offset is a smooth function of time, so it never jumps —
         unlike rounding to the nearest whole turn, which flicked 182 degrees
         whenever the rotation crept past a half-turn boundary. At the blast the
         subtraction is exact and the mark is square-on. */
      /* Bleed off rotation RATE, not angle. Scaling the angle would subtract
         hundreds of radians and spin the mark backwards; subtracting the rotation
         not-travelled since the lock began slows it smoothly instead. */
      float W        = uSettleWin + uHoldPose;
      /* (uT[0]-x) runs smoothly negative past the blast, unlike tb which jumps a
         whole cycle — so this stays continuous and the 29-degree kick is gone. */
      float tRamp    = clamp((W - (uT[0]-x)) * uCycleSec, 0.0, W*uCycleSec);
      float slowK    = mix(1.0, uLastSlow, settle);
      float rateAll  = uDrift + rySlope;
      float slowNow  = (1.0 - slowK) * tRamp * rateAll;
      float slowBlast= (1.0 - uLastSlow) * (W * uCycleSec) * rateAll;
      yaw -= slowNow * act;

      float hoverY = (sin(t*0.75)*uHoverYaw + sin(t*0.41)*uHoverYaw*0.40) * hoverAmp;
      float yawAtBlast = tB*uDrift + ryB - slowBlast;
      float yawOff = yawAtBlast - floor(yawAtBlast/TAU + 0.5)*TAU;
      yaw -= yawOff * settleP;
      yaw += hoverY * settleP;

      float tw = transit * 1.10;
      float ct = cos(tw), st2 = sin(tw);
      p = vec3(p.x*ct + p.z*st2, p.y, -p.x*st2 + p.z*ct);

      float boost = 1.0, push = 0.0, comeEnv = 0.0;
      if(x >= uT[0] && x < uT[2]){
        float qb = (x-uT[0])/(uT[2]-uT[0]);
        boost   = 1.0 + 2.80*exp(-pow((qb-0.10)/0.22, 2.0));
        push    = exp(-pow((qb-0.070)/0.115, 2.0));            // the camera lunge
        /* Zero at both ends, peaking just after detonation. Debris accelerates
           toward the viewer rather than easing to a stop, which is what makes it
           read as thrown AT you instead of merely outward. */
        comeEnv = smoothstep(0.0, 0.04, qb)
                * (0.70*exp(-pow((qb-0.11)/0.12, 2.0))     // the punch
                 + 0.55*exp(-pow((qb-0.40)/0.30, 2.0)))    // and a tail
                * (1.0 - smoothstep(0.80, 1.0, qb));
      }
      /* Anticipation: the camera eases back in the last fifth of a second before
         the blast. The punch lands far harder coming out of a pull-back. */
      float antic = exp(-pow((tb*uCycleSec - 0.22)/0.10, 2.0));

      p *= 1.0 + 0.014*sin(t*0.4)*act*(1.0 + uHoverBreath*settleP);

      float cy = cos(yaw), sy = sin(yaw);
      p = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy);
      float settleWobble = (x >= uT[6])
        ? uHomeWobble * exp(-4.6*homeU) * cos(7.8*homeU) * act : 0.0;
      float ax = uBaseTilt + sin(t*0.10)*0.09*(0.35 + 0.65*transit) + m.y * uMTilt * resp
               + rp + settleWobble;
      float hoverT = (sin(t*0.55 + 1.1)*uHoverTilt + sin(t*0.37)*uHoverTilt*0.35) * hoverAmp;
      ax = mix(ax, uPoseTilt + hoverT, settleP);
      float cx = cos(ax), sx = sin(ax);
      p = vec3(p.x, p.y*cx - p.z*sx, p.y*sx + p.z*cx);

      float rz = mix(rr, sin(t*0.44)*uHoverYaw*0.35*hoverAmp, settleP);
      float cz = cos(rz), sz = sin(rz);
      p = vec3(p.x*cz - p.y*sz, p.x*sz + p.y*cz, p.z);
      p.xy += bob*rest*(1.0-settleP)
            + vec2(sin(t*0.37)*0.45, sin(t*0.5)) * uHoverFloat * settleP * hoverAmp;

      /* ---- toward the viewer ----
         This has to happen AFTER the yaw and pitch rotations. Applied before
         them it is an OBJECT-space push, so it swings around with the mark — it
         aimed at the viewer only at the instant of detonation and was pushing
         debris backwards, at -86%, by the time the cloud spread.
         Here +z is the camera axis, unconditionally.
         The per-particle spread means debris arrives in a stream rather than a
         single sheet, which is what sells the depth. */
      p.z += (uComeAt*comeEnv + uBurstToward*comeEnv*0.85)
           * (0.25 + 1.50*seed) * act;


      /* Pulling the camera in shrinks the depth divisor, so anything with
         positive z scales up hard — that is what reads as coming through the
         screen rather than merely getting brighter. */
      float dist = 3.30 + uDollyBack*antic - uDolly*push;
      /* Clamp dropped from 0.28 to 0.12, roughly doubling peak magnification, so
         debris can genuinely fill and overrun the frame. */
      float wdep = max(dist - p.z, 0.12);
      /* How close this point is to the camera plane, 0 far -> 1 right on top. */
      float near = clamp((uPassNear*2.4 - wdep)/(uPassNear*2.4), 0.0, 1.0);
      vec2 proj = p.xy * (uProj / wdep);
      proj *= 1.0 + uSpreadNear * near * near;        // fling the close ones outward
      gl_Position = vec4(proj.x/uAspect + uCenter.x, proj.y + uCenter.y, 0.0, 1.0);
      /* Debris spreads over a far larger volume than the pyramid occupied, so
         without compensation the field thins out and reads as vanishing rather
         than exploding. Fatten and brighten the points through the blast. */
      gl_PointSize = uPointScale * aMeta.y * (2.6 / wdep) * mix(1.0, boost, act);

      vec3 c = mix(pal(0), pal(1), smoothstep(0.00, 0.40, h));
      c = mix(c, pal(2), smoothstep(0.30, 0.72, h));
      c = mix(c, pal(3), smoothstep(0.55, 0.92, h));
      c = mix(c, pal(4), smoothstep(0.78, 1.00, h) * 0.55);
      c = mix(c, mix(pal(4), pal(5), 0.55), amb * 0.75);

      float depth = clamp(p.z*0.5 + 0.5, 0.0, 1.0);
      float twk = mix(0.60 + 0.40*sin(t*1.9 + seed*TAU),
                      0.35 + 0.65*sin(t*1.15 + seed*TAU*1.7), amb);
      float baseA = (0.26 + 0.74*depth) * twk * (0.86 + 0.20*h);

      /* Dark theme accumulates light additively. Light theme composites ink over
         white, so the flash has to land on opacity rather than brightness —
         adding brightness on white simply erases the particle. */
      float aDark  = baseA * 0.60 * (1.0 + flash*uFlash*act);
      /* Low per-particle alpha is essential on white. At 0.34 a few hundred
         overlapping points saturate alpha to 1 and the field composites to a
         solid mass of the darkest colour — which is why it read as black. */
      float aLight = baseA * 0.15 * (1.0 + flash*uFlash*0.5*act);
      vA = mix(aDark, aLight, uLight);
      vA *= 1.0 - transit*0.18;
      vA *= mix(1.0, uAmbA, amb);
      vA *= mix(1.0, smoothstep(uPassNear*0.16, uPassNear*0.55, wdep), act);
      vA *= mix(1.0, 0.55 + 0.45*boost, act);

      float blowout = clamp(flash * uFlash * 0.55, 0.0, 1.0) * act;
      c = mix(c, vec3(1.0), blowout * uWhite);
      vec3 cDark  = c * (0.60 + 0.85*depth) + c * flash * uFlash * 0.45 * act;
      /* No brightness darkening on white — depth is carried by alpha instead, so
         distant particles read as pale blue rather than muddy navy. */
      vec3 cLight = c;
      vCol = mix(cDark, cLight, uLight);
    }`;

    const FRAG = `
    precision mediump float;
    varying vec3 vCol;
    varying float vA;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.04, d);
      float m = a * vA;
      gl_FragColor = vec4(vCol*m, m);
    }`;


    const compile = (ty: number, src: string, label: string) => {
      const sh = gl.createShader(ty);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // An undeclared identifier fails here, so log the GLSL error verbatim.
        console.error(`[apex-bg] ${label} shader:\n${gl.getShaderInfoLog(sh)}`);
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT, 'vertex');
    const fs = compile(gl.FRAGMENT_SHADER, FRAG, 'fragment');
    if (!vs || !fs) {
      canvas.style.display = 'none';
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      canvas.style.display = 'none';
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[apex-bg] link:', gl.getProgramInfoLog(prog));
      canvas.style.display = 'none';
      return;
    }
    gl.useProgram(prog);

    const buffers: WebGLBuffer[] = [];
    const attach = (name: string, data: Float32Array, size: number) => {
      const b = gl.createBuffer();
      if (!b) return;
      buffers.push(b);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      if (loc < 0) {
        console.warn('[apex-bg] attribute missing:', name);
        return;
      }
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attach("aPyr", pyr, 3); attach("aBurst", burst, 3);
    attach("aWide", wide, 3); attach("aShell", shell, 3);
    attach("aMeta", meta, 4); attach("aChunk", chunk, 4);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u: Uniforms = {
      time:U("uTime"), mix:U("uMix"), aspect:U("uAspect"),
      pointScale:U("uPointScale"), motion:U("uMotion"), phase:U("uPhase"),
      stagger:U("uStagger"), bulge:U("uBulge"), proj:U("uProj"),
      turns:U("uTurns"), drift:U("uDrift"),
      myaw:U("uMYaw"), mtilt:U("uMTilt"), mlift:U("uMLift"),
      bo:U("uBlastOut"), boa:U("uBlastOutAt"), bi:U("uBlastIn"), bia:U("uBlastInAt"),
      tilt:U("uBaseTilt"), spread:U("uSpread"), flash:U("uFlash"), mode:U("uMode"), light:U("uLight"),
      swin:U("uSettleWin"), ptilt:U("uPoseTilt"), hpose:U("uHoldPose"),
      hvy:U("uHoverYaw"), hvt:U("uHoverTilt"), hvf:U("uHoverFloat"), hvb:U("uHoverBreath"), psnap:U("uPoseSnap"), cyc:U("uCycleSec"), rel:U("uRelease"), lslow:U("uLastSlow"), dolly:U("uDolly"), white:U("uWhite"), amba:U("uAmbA"), dback:U("uDollyBack"),
      comeat:U("uComeAt"), passn:U("uPassNear"), spreadn:U("uSpreadNear"),
      btoward:U("uBurstToward"),
      hsh:U("uHomeShatter"), clag:U("uChunkLag"), hspin:U("uHomeSpins"), hwob:U("uHomeWobble"),
      spreadMin:U("uSpreadMin"), kick:U("uKick"), scrIn:U("uScrambleIn"), scrAmt:U("uScrambleAmt"),
      mouse:U("uMouse"), center:U("uCenter"), prev:U("uPrev[0]"), next:U("uNext[0]")
    };
    for(let i=0;i<7;i++) gl.uniform1f(U("uT["+i+"]"), CONFIG.T[i]);

    gl.uniform1f(u.motion, reduced ? 0 : 1);
    gl.uniform1f(u.stagger, CONFIG.stagger);
    gl.uniform1f(u.bulge, CONFIG.bulge);
    gl.uniform1f(u.proj, CONFIG.projScale);
    gl.uniform1f(u.turns, CONFIG.turns);
    gl.uniform1f(u.drift, CONFIG.drift);
    gl.uniform1f(u.myaw, CONFIG.mouseYaw);
    gl.uniform1f(u.mtilt, CONFIG.mouseTilt);
    gl.uniform1f(u.mlift, CONFIG.mouseLift);
    gl.uniform1f(u.bo,  CONFIG.blastOut);
    gl.uniform1f(u.boa, CONFIG.blastOutAt);
    gl.uniform1f(u.bi,  CONFIG.blastIn);
    gl.uniform1f(u.bia, CONFIG.blastInAt);
    gl.uniform1f(u.tilt, CONFIG.tiltDeg * Math.PI / 180);
    gl.uniform1f(u.flash,  CONFIG.blastFlash);
    gl.uniform1f(u.spread, CONFIG.blastSpread);
    gl.uniform1f(u.spreadMin, CONFIG.blastMin);
    gl.uniform1f(u.kick, CONFIG.blastKick);
    gl.uniform1f(u.scrIn, CONFIG.blastScramble);
    gl.uniform1f(u.scrAmt, CONFIG.scrambleAmount);
    gl.uniform1f(u.hsh,   CONFIG.homeShatter);
    gl.uniform1f(u.clag,  CONFIG.chunkLag);
    gl.uniform1f(u.hspin, CONFIG.homeSpins);
    gl.uniform1f(u.hwob,  CONFIG.homeWobble);
    gl.uniform1f(u.swin,  CONFIG.settleSec / CONFIG.cycleSec);
    gl.uniform1f(u.hpose, CONFIG.holdPoseSec / CONFIG.cycleSec);
    gl.uniform1f(u.ptilt, CONFIG.poseTilt);
    gl.uniform1f(u.hvy,   CONFIG.hoverYaw);
    gl.uniform1f(u.hvt,   CONFIG.hoverTilt);
    gl.uniform1f(u.hvf,   CONFIG.hoverFloat);
    gl.uniform1f(u.hvb,   CONFIG.hoverBreath);
    gl.uniform1f(u.psnap, CONFIG.poseSnap);
    gl.uniform1f(u.cyc,   CONFIG.cycleSec);
    gl.uniform1f(u.rel,   CONFIG.releaseSec / CONFIG.cycleSec);
    gl.uniform1f(u.lslow, CONFIG.lastSlow);
    gl.uniform1f(u.dolly, CONFIG.dolly);
    gl.uniform1f(u.white, CONFIG.whiteFlash);
    gl.uniform1f(u.amba, CONFIG.ambientAlpha);
    gl.uniform1f(u.dback,   CONFIG.dollyBack);
    gl.uniform1f(u.comeat,  CONFIG.comeAt);
    gl.uniform1f(u.passn,   CONFIG.passNear);
    gl.uniform1f(u.spreadn, CONFIG.spreadNear);
    gl.uniform1f(u.btoward, CONFIG.burstToward);

    gl.uniform1f(u.light, CONFIG.theme === 'light' ? 1 : 0);

    const MODES: RestMotion[] = ['orbit', 'tumble', 'drift'];
    gl.uniform1f(u.mode, Math.max(0, MODES.indexOf(CONFIG.restMotion as RestMotion)));

    /* ---- sizing: measure the host, not the viewport ---- */
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(host.clientWidth * dpr);
      const h = Math.round(host.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform1f(u.aspect, w / h);
      gl.uniform1f(u.pointScale, CONFIG.pointScale * dpr);
      gl.uniform2f(
        u.center,
        0,
        host.clientWidth >= 900 ? CONFIG.centerY : CONFIG.centerYMobile,
      );
    };
    size();

    const ro = new ResizeObserver(size);
    ro.observe(host);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, CONFIG.theme === 'light' ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    /* ---- input. The layer is pointer-events:none, so read from the window. ---- */
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mouseTarget = [
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      ];
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const advance = () => {
      prev = next;
      next = (next + 1) % P.length;
      mix = 0;
      transStart = performance.now();
    };
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('a,button,input,textarea,select,label,[role=button]')) return;
      advance();
    };
    if (CONFIG.clickToShift) window.addEventListener('click', onClick);

    /* ---- loop ---- */
    const t0 = performance.now();
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      const el = (now - t0) / 1000;

      if (mix < 1) {
        const q = Math.min(1, (now - transStart) / transDur);
        mix = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
        if (q >= 1) {
          mix = 1;
          prev = next;
        }
      }
      mouse[0] += (mouseTarget[0] - mouse[0]) * CONFIG.mouseEase;
      mouse[1] += (mouseTarget[1] - mouse[1]) * CONFIG.mouseEase;

      gl.uniform1f(u.time, el);
      gl.uniform1f(u.phase, reduced ? 0.02 : (el / CONFIG.cycleSec) % 1);
      gl.uniform1f(u.mix, mix);
      gl.uniform2f(u.mouse, mouse[0], mouse[1]);
      gl.uniform3fv(u.prev, P[prev].cols);
      gl.uniform3fv(u.next, P[next].cols);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, N);

      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };

    /* Matches BgVideo: pause when it leaves the viewport, resume on return. */
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(draw);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(host);

    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (visible && !raf) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [clickToShift, palette, restMotion, count]);

  return (
    <div ref={hostRef} className={className ? `axbg ${className}` : 'axbg'} aria-hidden="true">
      <canvas ref={canvasRef} className="axbg-canvas" />
    </div>
  );
}
