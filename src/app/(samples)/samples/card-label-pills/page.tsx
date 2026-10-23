import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { OPTIONS } from './data-options';
import { JoinedSection } from './Top';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Card Label Pills (Aidan, 23 Oct): the swapped Wrong Way vs APEX Way section
 * from /samples/welcome-swap-preview, three times over, identical but for where
 * the Standard and Exceptional pills sit. Copied rather than imported per
 * CLAUDE.md; the fonts are the live page's pairing under its own variable
 * names, so the copied rules resolve as they do there.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--w3-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--w3-body' });

export const metadata: Metadata = { title: 'Card Label Pills' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function CardLabelPills() {
  return (
    <div className={`clp ${display.variable} ${body.variable}`}>
      <nav className="jump" aria-label="Jump to an option">
        <a href="/samples">← Samples</a>
        {OPTIONS.map((v) => (
          <a key={v.id} href={`#${v.id}`}>
            Option {v.n} · {v.name}
          </a>
        ))}
      </nav>

      <header className="pg">
        <div className="wrap">
          <span className="eye">Sample · Desktop &amp; tablet</span>
          <h1>Card Label Pills</h1>
          <p>
            The Wrong Way vs APEX Way section as in the swap preview, with Standard and Exceptional as pills in their
            card&rsquo;s colour, placed three ways. The phones and every line on the cards are unchanged.
          </p>
        </div>
      </header>

      <main>
        {OPTIONS.map((v) => (
          <div key={v.id}>
            <header className="opt__head">
              <div className="opt__in">
                <span className="opt__label">
                  Option {v.n} · {v.name}
                </span>
                <p className="opt__note">{v.note}</p>
              </div>
            </header>
            <JoinedSection v={v.id} />
          </div>
        ))}
      </main>

      <footer className="pg pg--foot">
        <div className="wrap">
          <a href="/samples">← All samples</a>
          <p>Build {BUILD}</p>
        </div>
      </footer>
    </div>
  );
}
