import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { OPTIONS } from './data';
import Hero from './Hero';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Hero Ticker Options: the live Welcome hero three times over, identical but
 * for the cards' box, each time one of Motion's three ticker designs (21 Oct),
 * working: the lines run right to left, pause on hover and stand still under
 * reduced motion. Desktop only.
 *
 * The live page's tokens and Hanken Grotesk / Inter pairing, copied rather
 * than imported per CLAUDE.md. Everything is scoped under .hto.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--hto-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--hto-body' });

export const metadata: Metadata = { title: 'Hero Ticker Options' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function HeroTickerOptions() {
  return (
    <div className={`hto ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to an option">
        <a className="jump__home" href="/samples">
          ← Samples
        </a>
        <div className="jump__opts">
          {OPTIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>
              <span>Option {v.n}</span>
              {v.name}
            </a>
          ))}
        </div>
      </nav>

      <header className="intro">
        <div className="intro__in">
          <span className="eye">Sample · Desktop</span>
          <h1>Hero Ticker Options</h1>
          <p>
            The live Welcome hero three times, with only the cards&apos; box replaced by each of Motion&apos;s three ticker
            designs: the same Cobalt Sweep colours, and only the titles, figures and lines already on the cards.
          </p>
        </div>
      </header>

      <main>
        {OPTIONS.map((v) => (
          <section key={v.id} className="opt" id={v.id} aria-labelledby={`${v.id}-t`}>
            <header className="opt__head">
              <div className="opt__in">
                <span className="opt__label" id={`${v.id}-t`}>
                  Option {v.n} · {v.name}
                </span>
                <p className="opt__note">{v.note}</p>
              </div>
            </header>
            <Hero v={v} />
          </section>
        ))}
      </main>

      <footer className="outro">
        <div className="intro__in">
          <a href="/samples">← All samples</a>
          <p>Build {BUILD}</p>
        </div>
      </footer>
    </div>
  );
}
