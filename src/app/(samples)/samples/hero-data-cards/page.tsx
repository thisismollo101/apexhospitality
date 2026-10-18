import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { VERSIONS } from './data';
import Hero from './Hero';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Hero Data Cards: the live Welcome hero three times over, with only its three
 * data cards redesigned. The headline, the VSL's place and the layout are the
 * live page's; the VSL itself is shown bare, as asked for this page. Each card
 * follows the APEX Way timeline rows below the hero, the figure where those
 * rows put the time, and each version gives them its own translucent colour.
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
      <nav className="jump" aria-label="Jump to a version">
        <a className="jump__home" href="/samples">
          ← Samples
        </a>
        <div className="jump__opts">
          {VERSIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>
              <span>Version {v.n}</span>
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
            The live Welcome hero three times, with only its three data cards redesigned. Each card follows the APEX Way
            timeline rows, the figure large where those rows put the time and its line straight after it, about 15% larger
            than live, in a different translucent treatment per version. The VSL shows as the bare film.
          </p>
        </div>
      </header>

      <main>
        {VERSIONS.map((v) => (
          <section key={v.id} className="opt" id={v.id} aria-labelledby={`${v.id}-t`}>
            <header className="opt__head">
              <div className="opt__in">
                <span className="opt__label" id={`${v.id}-t`}>
                  Version {v.n} · {v.name}
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
