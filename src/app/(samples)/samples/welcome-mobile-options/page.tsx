import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import HeroOptions from './HeroOptions';
import MomentsOptions from './MomentsOptions';
import WorksOptions from './WorksOptions';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Welcome · mobile options. Three blocks of the live Welcome page, five
 * different ways to lay each one out on a phone: fifteen labelled variations
 * stacked down one column, with a sticky jump menu between the blocks.
 *
 * Copy, palette, type and media are the live page's own. Nothing here is
 * imported from that route: per CLAUDE.md a sample copies, never shares.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--wmo-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--wmo-body' });

export const metadata: Metadata = { title: 'Welcome · mobile options' };

const BLOCKS = [
  { id: 'hero', label: 'Hero', title: 'Hero + top VSL + value cards' },
  { id: 'works', label: 'What Works', title: 'What Works · the 4-milestone journey' },
  { id: 'moments', label: 'Four Moments', title: 'Four Films, Four Moments' },
];

export default function WelcomeMobileOptions() {
  return (
    <div className={`wmo ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to a block">
        {BLOCKS.map((b) => (
          <a key={b.id} href={`#${b.id}`}>
            {b.label}
          </a>
        ))}
      </nav>

      <main className="col">
        <header className="intro">
          <span className="eye">Sample · Welcome page</span>
          <h1>Five mobile layouts for each of three blocks.</h1>
          <p>
            Fifteen variations, built to be reviewed on a phone. Every option uses the live Welcome copy, colours, type
            and placeholder media. Only the layout changes.
          </p>
        </header>

        <section id="hero" className="blk">
          <h2 className="blk__title">
            <span>A</span>
            {BLOCKS[0].title}
          </h2>
          <HeroOptions />
        </section>

        <section id="works" className="blk">
          <h2 className="blk__title">
            <span>B</span>
            {BLOCKS[1].title}
          </h2>
          <WorksOptions />
        </section>

        <section id="moments" className="blk">
          <h2 className="blk__title">
            <span>C</span>
            {BLOCKS[2].title}
          </h2>
          <MomentsOptions />
        </section>

        <footer className="outro">
          <a href="/samples">← All samples</a>
        </footer>
      </main>
    </div>
  );
}
