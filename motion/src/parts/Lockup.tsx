import type { CSSProperties } from 'react';
import { C, INTER } from '../brand';

/*
 * The wordmark lockup: "Apex" heavy and mixed-case, HOSPITALITY at .74em
 * (Inter's x-height over cap height, so the capitals stand as tall as "pex"),
 * weight 500, +.13em, brand blue. Every ratio is in em; only `size` changes.
 */
export const Lockup = ({ size, style, hospitality = C.blue }: { size: number; style?: CSSProperties; hospitality?: string }) => (
  <span style={{ fontFamily: INTER, fontSize: size, fontWeight: 800, color: C.white, letterSpacing: '-.01em', whiteSpace: 'nowrap', ...style }}>
    Apex
    <span style={{ fontSize: '.74em', fontWeight: 500, letterSpacing: '.13em', color: hospitality, marginLeft: '.42em' }}>
      HOSPITALITY
    </span>
  </span>
);
