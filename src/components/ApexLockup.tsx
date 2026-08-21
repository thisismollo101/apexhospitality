'use client';

import { useEffect, useRef, useState } from 'react';
import ApexMark from '@/components/ApexMark';

/**
 * The sting: the mark tumbles in, then the wordmark wipes across after it.
 *
 * Two departures from the reference sting it is taken from:
 *
 *  - No rule between the two. The reference scaled a 1px divider up from zero
 *    between mark and words; it is gone, and the gap alone carries the join.
 *  - The wordmark is the nav's relationship at display size: "Apex" heavy and
 *    white as drawn, HOSPITALITY smaller, lighter, widely tracked and blue.
 *    Not the reference's italic second word. Only the reveal is borrowed.
 *
 * The wipe is a clip-path animation held until the lockup is actually on
 * screen, so it plays on arrival rather than having finished somewhere above
 * the fold. `ApexMark` restarts itself on the same trigger.
 *
 * Reduced motion is handled in CSS rather than here: the wipe is simply never
 * armed, so the wordmark is present from the first paint.
 */
export default function ApexLockup({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect(); // plays once, not on every pass
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={['axlock', shown ? 'is-in' : '', className].filter(Boolean).join(' ')}>
      <ApexMark className="axlock-mark" anim="tumble" />
      <span className="axlock-words">
        Apex <em>Hospitality</em>
      </span>
    </div>
  );
}
