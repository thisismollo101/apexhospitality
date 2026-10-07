import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import ExpandOptions from './ExpandOptions';
import HeroOptions from './HeroOptions';
import MomentsOptions from './MomentsOptions';
import WorksOptions from './WorksOptions';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Welcome · mobile options. Three blocks of the live Welcome page, five
 * different ways to lay each one out on a phone, plus five ways a Four Moments
 * bento tile can expand: twenty labelled variations down one column, with a
 * sticky jump menu between them.
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
  { id: 'moments', label: 'Four Moments', title: 'Four Films, Four Moments: section layouts' },
  { id: 'bento', label: 'Bento Expand', title: 'Bento Expand: how a tile opens' },
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
          <h1>Five mobile options for each of four jobs.</h1>
          <p>
            Twenty variations, built to be reviewed on a phone: five layouts each for the hero, What Works and Four
            Moments, then five ways a Four Moments bento tile can open. Every option uses the live Welcome copy, colours, type
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
            <span>C1</span>
            {BLOCKS[2].title}
          </h2>
          <MomentsOptions />
        </section>

        <section id="bento" className="blk">
          <h2 className="blk__title">
            <span>C2</span>
            {BLOCKS[3].title}
          </h2>
          <ExpandOptions />
        </section>

        <footer className="outro">
          <a href="/samples">← All samples</a>
        </footer>
      </main>
    </div>
  );
}
