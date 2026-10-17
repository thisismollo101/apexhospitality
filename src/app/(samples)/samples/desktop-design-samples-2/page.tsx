import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { OPTIONS } from './data';
import Options from './Options';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Desktop Design Samples 2: three options for the top of the section (the
 * film full bleed behind the headline, the VSL as one 9:16 card) and three for
 * the bottom (the revised Them vs Us pair), each with its tablet version.
 * Round 1 stays at /samples/desktop-design-samples.
 *
 * The look is the live Welcome page's, as in round 1: its tokens and its
 * Hanken Grotesk / Inter pairing, copied rather than imported per CLAUDE.md.
 * Everything is scoped under .dd2.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--dd2-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--dd2-body' });

export const metadata: Metadata = { title: 'Desktop Design Samples 2' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function DesktopDesignSamples2() {
  return (
    <div className={`dd2 ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to an option">
        <a className="jump__home" href="/samples">
          ← Samples
        </a>
        <div className="jump__opts">
          {OPTIONS.map((o) => (
            <a key={o.id} href={`#${o.id}`}>
              <span>
                {o.group} {o.n}
              </span>
              {o.name}
            </a>
          ))}
        </div>
      </nav>

      <header className="intro">
        <div className="intro__in">
          <span className="eye">Sample · Desktop &amp; tablet · round 2</span>
          <h1>Desktop Design Samples 2</h1>
          <p>
            Three options for the top, with the film full bleed behind the headline and the VSL as one 9:16 card, and three
            for the bottom, the revised Them vs Us pair. Each one also has its tablet layout at 1194 landscape and 834
            portrait.
          </p>
          <p className="intro__flag">
            Round 1 is still at <a href="/samples/desktop-design-samples">/samples/desktop-design-samples</a>.
          </p>
          <p className="intro__flag">
            Figures are not yet cleared by the fact checker. Every one carries a grey <span className="ast">*</span>
            unverified line so it is easy to find and swap; in the Them vs Us rows it shows once a row is opened.
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
