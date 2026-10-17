import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { OPTIONS } from './data';
import Options from './Options';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Desktop Design Samples: five desktop layouts (each with its tablet version)
 * of one two-section block: the spine header with its data points and trust
 * ribbon, then the hero stage, Panel A's 9:16 executive VSL against Panel B's
 * Them vs Us.
 *
 * The look is the live Welcome page's: its tokens and its Hanken Grotesk /
 * Inter pairing, copied rather than imported per CLAUDE.md, as the mobile
 * samples do. Everything is scoped under .dds.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--dds-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--dds-body' });

export const metadata: Metadata = { title: 'Desktop Design Samples' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function DesktopDesignSamples() {
  return (
    <div className={`dds ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to an option">
        <a className="jump__home" href="/samples">
          ← Samples
        </a>
        <div className="jump__opts">
          {OPTIONS.map((o) => (
            <a key={o.n} href={`#option-${o.n}`}>
              <span>Option {o.n}</span>
              {o.name}
            </a>
          ))}
        </div>
      </nav>

      <header className="intro">
        <div className="intro__in">
          <span className="eye">Sample · Desktop &amp; tablet</span>
          <h1>Desktop Design Samples</h1>
          <p>
            Five desktop layouts for one two-section block: the top header and spine, then the main hero stage with the
            9:16 executive VSL against Them vs Us. Each one also has its tablet layout at 1194 landscape and 834 portrait.
          </p>
          <p className="intro__flag">
            Figures are not yet cleared by the fact checker. Every one carries a grey <span className="ast">*</span>
            unverified line so it is easy to find and swap.
          </p>
        </div>
      </header>

      <main>
        <Options />
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
