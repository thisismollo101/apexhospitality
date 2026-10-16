import { Easing, interpolate } from 'remotion';
import { EASE } from '../brand';

export const ease = Easing.bezier(...EASE);

/** 0→1 over [start, start+dur], on the site's ease, clamped both ends. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** In over `inDur`, hold, out over `outDur` ending at `end`. */
export const inOut = (frame: number, start: number, end: number, inDur = 14, outDur = 12) =>
  Math.min(prog(frame, start, inDur), 1 - prog(frame, end - outDur, outDur));
