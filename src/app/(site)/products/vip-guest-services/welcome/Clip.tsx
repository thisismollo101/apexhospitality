'use client';

import { useEffect, useRef } from 'react';

/**
 * One clip, playing only while it is on screen.
 *
 * This page asks for a lot of simultaneous video — three in the hero carousel,
 * four demographic modules, eight across the cadence — so nothing autoplays by
 * attribute. An IntersectionObserver starts the clip when it scrolls in and
 * pauses it when it leaves, which keeps the decode count near what is visible
 * rather than near what exists. `active` lets a carousel or tab panel pause the
 * slides it is not showing even while they remain in the viewport.
 *
 * prefers-reduced-motion leaves the poster frame up and never calls play().
 */
export default function Clip({
  name,
  active = true,
  muted = true,
  className,
  label,
}: {
  name: string;
  active?: boolean;
  muted?: boolean;
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

  // Muting is driven as a property, not an attribute: React will not re-render a
  // <video> into an unmuted state on its own, and the mute buttons need it live.
  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  return (
    <video
      ref={ref}
      className={className}
      loop
      playsInline
      muted
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
