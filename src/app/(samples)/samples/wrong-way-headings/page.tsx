import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { JoinedSection } from './Joined';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Wrong Way Headings: the live Welcome page's Wrong Way vs APEX Way section
 * (#s1j) on its own, with a mini heading added on each side. Copied rather
 * than imported per CLAUDE.md; the fonts are the live page's pairing under its
 * own variable names, so the copied rules resolve as they do there.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--w3-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--w3-body' });

export const metadata: Metadata = { title: 'Wrong Way Headings' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function WrongWayHeadings() {
  return (
    <div className={`wwh ${display.variable} ${body.variable}`}>
      <header className="pg">
        <div className="wrap">
          <a href="/samples">← Samples</a>
          <span className="eye">Sample · Desktop &amp; tablet</span>
          <h1>Wrong Way Headings</h1>
          <p>
            The Wrong Way vs APEX Way section from the live Welcome page, with a mini heading on each side: over a smaller
            calendar on the Wrong Way, over the four rows on the APEX Way. Everything else is as live.
          </p>
        </div>
      </header>

      <main>
        <JoinedSection />
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
