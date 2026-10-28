import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import Hero from './Hero';
import WhatOne from './WhatOne';
import WhatTwo from './WhatTwo';
import Why from './Why';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Welcome · mobile preview: the Hero and Sections 1–3 of the Welcome page, for
 * phones only (375–430px). Copy is the locked decision log's, word for word,
 * in data.ts; palette, type and media are the live Welcome page's, copied
 * rather than imported per CLAUDE.md. The column stays phone-width at every
 * size, so a desktop browser just shows the phone layout centred.
 *
 * Not registered in samples.json: it is a preview, reached by its URL only.
 */
const display = Hanken_Grotesk({ subsets: ['latin'], weight: ['500', '700', '800'], display: 'swap', variable: '--wmp-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--wmp-body' });

export const metadata: Metadata = { title: 'Welcome · mobile preview', robots: { index: false } };

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

/** Which commit this preview was built from, so a phone shows which deploy it is on. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7);

const SECTIONS = [
  { tag: 'Hero', C: Hero },
  { tag: 'Section 1 · Why', C: Why },
  { tag: 'Section 2 · What, part 1', C: WhatOne },
  { tag: 'Section 3 · What, part 2', C: WhatTwo },
];

export default function WelcomeMobilePreview() {
  return (
    <div className={`wmp ${display.variable} ${body.variable}`}>
      <main className="col">
        {SECTIONS.map(({ tag, C }) => (
          <div key={tag} className="blk">
            <p className="blk__tag">{tag}</p>
            <C />
          </div>
        ))}
        <p className="build">Preview · build {BUILD}</p>
      </main>

      {/* the primary CTA, pinned in thumb reach; its copy is not in the decision log yet */}
      <div className="dock">
        <button type="button" className="dock__btn" disabled>
          Primary CTA · copy pending
        </button>
      </div>
    </div>
  );
}
