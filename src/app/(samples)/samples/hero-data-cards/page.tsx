import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { OPTIONS } from './data';
import Hero from './Hero';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Hero Data Cards, round 2: Version 3 (Blue Gradient Edge) from round 1, three
 * times over, identical but for the cards' gradient. The VSL is a phone like
 * the Wrong Way vs APEX Way phones, and the whole group (phone, headline and
 * cards) is centred on the page. Each card follows the APEX Way timeline rows,
 * the figure where those rows put the time.
 *
 * The live page's tokens and Hanken Grotesk / Inter pairing, copied rather
 * than imported per CLAUDE.md. Everything is scoped under .hdc.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--hdc-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--hdc-body' });

export const metadata: Metadata = { title: 'Hero Data Cards' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function HeroDataCards() {
  return (
    <div className={`hdc ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to an option">
        <a className="jump__home" href="/samples">
          ← Samples
        </a>
        <div className="jump__opts">
          {OPTIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>
              <span>Gradient {v.n}</span>
              {v.name}
            </a>
          ))}
        </div>
      </nav>

      <header className="intro">
        <div className="intro__in">
          <span className="eye">Sample · Desktop &amp; tablet</span>
          <h1>Hero Data Cards</h1>
          <p>
            Version 3, Blue Gradient Edge, in three gradient options. Everything else is the same in each: the VSL as a
            phone, the whole group centred on the page, and the three cards with their figure large where the APEX Way
            rows put the time, the title and line straight after it.
          </p>
        </div>
      </header>

      <main>
        {OPTIONS.map((v) => (
          <section key={v.id} className="opt" id={v.id} aria-labelledby={`${v.id}-t`}>
            <header className="opt__head">
              <div className="opt__in">
                <span className="opt__label" id={`${v.id}-t`}>
                  Gradient {v.n} · {v.name}
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
