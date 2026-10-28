import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { ReviewBar } from './parts';

// One stylesheet for the route and its three option pages. See style.css.
import './style.css';

/*
 * Welcome · mobile v3: the hero three new ways, one page per option
 * (/hero-a, /hero-b, /hero-c) so each screenshots on its own. Phones only,
 * 375–430px; the column stays phone-width at every size.
 *
 * Copy is the live hero's, word for word, in data.ts. Palette and type are the
 * live Welcome page's (ink, paper, the cobalt accent and brand blue; Hanken
 * Grotesk over Inter), with the style references layered on per option.
 * Nothing is imported from another route, per CLAUDE.md.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['500', '700', '800', '900'], display: 'swap', variable: '--wm3-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '800'], display: 'swap', variable: '--wm3-body' });

export const metadata: Metadata = { title: 'Welcome · mobile v3', robots: { index: false } };

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function WelcomeMobileV3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`wm3 ${display.variable} ${body.variable}`}>
      <div className="wm3-col">
        <ReviewBar />
        {children}
      </div>
    </div>
  );
}
