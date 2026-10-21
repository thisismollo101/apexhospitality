import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { HeroTop, JoinedSection } from './Top';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Welcome Swap Preview (Aidan, 21 Oct): the live Welcome page's hero and its
 * Wrong Way vs APEX Way section, copied rather than imported per CLAUDE.md,
 * with the two cards swapped round and the Wrong Way card mirrored. A preview
 * only, for desktop. The fonts are the live page's pairing under its
 * own variable names, so the copied rules resolve as they do there.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--w3-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--w3-body' });

export const metadata: Metadata = { title: 'Welcome Swap Preview' };

/** Which commit this page was built from, fixed at build time, so the footer shows which deployment is live. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

export default function WelcomeSwapPreview() {
  return (
    <div className={`wsp ${display.variable} ${body.variable}`}>
      <header className="pg">
        <div className="wrap">
          <a href="/samples">← Samples</a>
          <span className="eye">Preview · Desktop</span>
          <h1>Welcome Swap Preview</h1>
          <p>
            The live Welcome hero and the Wrong Way vs APEX Way section, swapped: the APEX Way card on the left and the
            Wrong Way card on the right with its phone and calendar mirrored. The hero phone keeps the briefing VSL and
            the Wrong Way phone the reminder text, as live.
          </p>
        </div>
      </header>

      <main>
        <HeroTop />
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
