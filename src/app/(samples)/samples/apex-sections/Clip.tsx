'use client';

import { useEffect, useRef } from 'react';

/**
 * One clip, playing only while it is on screen.
 *
 * This page asks for a great deal of simultaneous video — the hero, the
 * comparison window, four showcase boxes, four VSL chapters, four touchpoints
 * and a sixteen-cell matrix — so nothing autoplays by attribute. An
 * IntersectionObserver starts a clip when it scrolls in and pauses it when it
 * leaves, keeping the decode count near what is visible rather than near what
 * exists. `active` lets a tab panel pause the slides it is not showing.
 *
 * prefers-reduced-motion leaves the poster frame up and never calls play().
 */
export default function Clip({
  name,
  active = true,
  className,
  label,
}: {
  name: string;
  active?: boolean;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const onScreen = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sync = () => {
      if (onScreen.current && active) void v.play().catch(() => {});
      else v.pause();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen.current = e.isIntersecting;
        sync();
      },
      { rootMargin: '200px' },
    );
    io.observe(v);
    sync();
    return () => io.disconnect();
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      loop
      muted
      playsInline
      preload="none"
      poster={`/media/cards/${name}.jpg`}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={`/media/cards/${name}.webm`} type="video/webm" />
      <source src={`/media/cards/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
