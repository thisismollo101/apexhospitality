import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import BentoOptions from './BentoOptions';
import HeroAlone from './HeroAlone';
import MomentsOptions from './MomentsOptions';
import VslOptions from './VslOptions';
import WorksOptions from './WorksOptions';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Welcome · mobile options, round 2. Aidan's review of round 1 turned into five
 * sections: the hero alone, the first VSL alone, What Works refined, Four
 * Moments with a highlight reel, and three refined Bento Expands. Round 1 stays
 * at /samples/welcome-mobile-options so the two can be compared.
 *
 * Copy, palette, type and media are the live Welcome page's. Nothing here is
 * imported from another route: per CLAUDE.md a sample copies, never shares.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--wmo-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--wmo-body' });

export const metadata: Metadata = { title: 'Welcome · mobile options, round 2' };

// viewport-fit=cover lets the full-screen takeover run under the status bar and notch.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const BLOCKS = [
  { id: 'hero', label: 'Hero', letter: 'A', title: 'The hero, on its own' },
  { id: 'vsl', label: 'VSL', letter: 'B', title: 'The first VSL block, on its own' },
  { id: 'works', label: 'What Works', letter: 'C', title: 'What Works · refined + new' },
  { id: 'moments', label: 'Moments', letter: 'D', title: 'Four Moments · kept + highlight reel' },
  { id: 'bento', label: 'Bento', letter: 'E', title: 'Bento Expand · three ways a tile opens' },
];

const SECTIONS = [HeroAlone, VslOptions, WorksOptions, MomentsOptions, BentoOptions];

/**
 * Which commit this page was built from. Vercel exposes the git SHA to the
 * build; locally there is none. The page is static, so this is fixed at build
 * time — exactly what is wanted: it shows which deployment is actually live.
 */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function WelcomeMobileOptions2() {
  return (
    <div className={`wmo ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to a section">
        {BLOCKS.map((b) => (
          <a key={b.id} href={`#${b.id}`}>
            {b.label}
          </a>
        ))}
      </nav>

      <main className="col">
        <header className="intro">
          <span className="eye">Sample · Welcome page · round 2</span>
          <h1>Mobile options, round 2.</h1>
          <p>
            Built from the round 1 review: the hero and the first VSL on their own, What Works refined, Four Moments with
            a highlight reel, and three Bento Expands. Live Welcome copy, colours, type and placeholder media throughout.
          </p>
          <p className="intro__r1">
            Round 1 is still at <a href="/samples/welcome-mobile-options">/samples/welcome-mobile-options</a> for
            comparison.
          </p>
        </header>

        {BLOCKS.map((b, n) => {
          const Section = SECTIONS[n];
          return (
            <section key={b.id} id={b.id} className="blk">
              <h2 className="blk__title">
                <span>{b.letter}</span>
                {b.title}
              </h2>
              <Section />
            </section>
          );
        })}

        <footer className="outro">
          <a href="/samples">← All samples</a>
          <p className="outro__build">
            Build {BUILD} · E1 v11: iPhone plays the upright 9:19.5 film in the phone&apos;s own player, which hides the clock once its controls fade
          </p>
        </footer>
      </main>
    </div>
  );
}
