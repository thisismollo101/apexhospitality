'use client';

/* eslint-disable @next/next/no-img-element -- placeholders sized by CSS, as on the other samples */

import { useEffect, useRef } from 'react';
import { HERO, PHONE, img, type Milestone } from './data';

/** One labelled variation: "HERO — Option 3: Stories" plus a one-line note. */
export function Option({
  block,
  n,
  name,
  note,
  children,
}: {
  block: string;
  /** The option's number; a string for an inserted comparison option such as '1b'. */
  n: number | string;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <article className="opt" id={`${block.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${n}`}>
      <header className="opt__head">
        <span className="opt__label">
          {block} — Option {n}: {name}
        </span>
        <p className="opt__note">{note}</p>
      </header>
      <div className="opt__demo">{children}</div>
    </article>
  );
}

export const Ast = () => <span className="ast">*</span>;

export function HeroLines({ className = 'hl' }: { className?: string }) {
  return (
    <ul className={className}>
      {HERO.lines.map((l) => (
        <li key={l.bold}>
          {l.pre}
          <b>{l.bold}</b>
          {l.post}
          {l.ast && <Ast />}
        </li>
      ))}
    </ul>
  );
}

export const PlayIcon = ({ size = 56 }: { size?: number }) => (
  <span className="play" style={{ width: size, height: size }} aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M6 4l14 8-14 8z" />
    </svg>
  </span>
);

/** A VSL placeholder: poster, play button, the live "Watch · m:ss" tag. */
export function Vsl({ poster, tag, className = '' }: { poster: string; tag: string; className?: string }) {
  return (
    <figure className={`vsl ${className}`}>
      <img src={img(poster)} alt="" />
      <PlayIcon />
      <figcaption className="vsl__tag">{tag}</figcaption>
    </figure>
  );
}

/**
 * A background film. Never autoplays by attribute: an observer plays it on
 * screen and pauses it off, muted is set as a property, and reduced motion
 * leaves the poster up.
 */
export function Clip({ src, poster, className = '' }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={img(src)}
      poster={poster ? img(poster) : undefined}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

/** The WhatsApp message as the guest receives it. */
export function Bubble({ m, compact = false }: { m: Milestone; compact?: boolean }) {
  return (
    <div className={`bubble${compact ? ' bubble--sm' : ''}`}>
      <div className="bubble__vid">
        <img src={img(m.img)} alt="" />
        <PlayIcon size={compact ? 28 : 34} />
        <span className="bubble__dur">{m.dur}</span>
      </div>
      <p>{m.msg}</p>
      <span className="bubble__time">{m.time}</span>
    </div>
  );
}

/** The phone frame and its WhatsApp header, with whatever thread goes inside. */
export function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen">
        <div className="phone__top">
          <span className="phone__av">A</span>
          <span className="phone__who">
            {PHONE.who}
            <small>{PHONE.verified}</small>
          </span>
        </div>
        <div className="phone__chat">{children}</div>
      </div>
    </div>
  );
}

/** Locks page scroll and wires Esc while an overlay is open. */
export function useOverlay(open: boolean, close: () => void) {
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
}

export const CloseX = ({ onClick, light = false, label = 'Close' }: { onClick: () => void; light?: boolean; label?: string }) => (
  <button type="button" className={`ex-x${light ? ' ex-x--light' : ''}`} aria-label={label} onClick={onClick}>
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  </button>
);

/**
 * The full-screen player a VSL opens into. Opened by a tap, so it may start with
 * sound; native controls take over from there.
 */
export function Player({ src, poster, title, onClose }: { src: string; poster: string; title: string; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useOverlay(true, onClose);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <div className="player" role="dialog" aria-modal="true" aria-label={title}>
      <video ref={ref} src={img(src)} poster={img(poster)} controls playsInline />
      <CloseX onClick={onClose} light />
    </div>
  );
}
