'use client';

import { useEffect, useRef } from 'react';

/**
 * Section 3 — the auto-scrolling 9:16 reel.
 *
 * The scroll is CSS, not JS: the track holds the reel twice and animates
 * translateX(0 → -50%), so the wrap lands on an identical frame and reads as
 * continuous. That only holds while every window is the same width and the
 * spacing is a margin on the card rather than a gap on the track — a gap adds
 * one extra space between the two halves that the -50% does not account for,
 * and the seam shows. See style.css.
 *
 * One IntersectionObserver for the whole strip rather than one per clip: at
 * fourteen windows the per-clip pattern Clip.tsx uses would mean fourteen
 * observers all reporting the same thing. Off-screen the whole reel pauses,
 * which is what actually matters for decode cost.
 */
export default function PostsMarquee({ posts }: { posts: { clip: string; label: string }[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll('video'));
    // React does not reliably emit the muted attribute into the server HTML, and
    // an unmuted clip is refused autoplay outright. Set it as a property.
    videos.forEach((v) => {
      v.muted = true;
    });

    // The CSS already parks the animation under reduced motion; leaving the
    // clips on their poster frames is the other half of the same promise.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        for (const v of videos) {
          if (entry.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [posts]);

  // The second pass is decorative — it exists to close the loop, so it is
  // hidden from assistive tech rather than announced twice.
  const track = [...posts.map((p) => ({ ...p, dupe: false })), ...posts.map((p) => ({ ...p, dupe: true }))];

  return (
    <div className="w2mq" ref={rootRef}>
      <div className="w2mq-track">
        {track.map((p, i) => (
          <div className="w2mq-card" key={i} aria-hidden={p.dupe || undefined}>
            <video
              loop
              playsInline
              muted
              preload="none"
              poster={`/media/cards/${p.clip}.jpg`}
              aria-label={p.dupe ? undefined : p.label}
              aria-hidden={p.dupe ? undefined : false}
            >
              <source src={`/media/cards/${p.clip}.webm`} type="video/webm" />
              <source src={`/media/cards/${p.clip}.mp4`} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}
