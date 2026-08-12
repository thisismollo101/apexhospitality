'use client';

import { useEffect, useRef } from 'react';

/**
 * A background clip that only runs while it is on screen.
 *
 * Revolut's own markup ships these <video> elements with no autoplay attribute
 * — playback is started from the client once the block is reached — so this is
 * the faithful shape as well as the cheap one. A plain autoplay attribute also
 * does not survive here: with two full-bleed clips on the page Chromium leaves
 * the second one paused, and nothing restarts it.
 */
export default function BgVideo({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: '200px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} muted loop playsInline preload="none" aria-hidden poster={`/media/cards/${name}.jpg`}>
      <source src={`/media/cards/${name}.webm`} type="video/webm" />
      <source src={`/media/cards/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
