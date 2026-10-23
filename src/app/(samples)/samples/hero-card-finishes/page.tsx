import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StatTicker from './StatTicker';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Hero Card Finishes: the live Welcome hero's stat ticker on the hero's own
 * still. Round 2 (Aidan, 23 Oct): the card is C · Deep Pane with no white line
 * along the top, now live; the three options are for the figures (5% / 25% / 5X),
 * each 3D and translucent. Figure 1 is what the live page carries. Scoped under .hcf.
 */
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = { title: 'Hero Card Finishes' };

const OPTIONS = [
  { key: 'f1', name: '1 · Glass', note: 'Live now. Letters filled with a white-to-ice-blue glass gradient, a lit top edge and a soft drop shadow under them.' },
  { key: 'f2', name: '2 · Extruded', note: 'Solid near-white letters with a stepped blue extrusion down and to the right, like raised signage.' },
  { key: 'f3', name: '3 · Frosted Outline', note: 'See-through glass letters: a bright white rim around a faint fill, with a cool blue glow.' },
];

export default function HeroCardFinishes() {
  return (
    <main className={`hcf ${body.className}`}>
      <header className="hcf__head">
        <a href="/samples">← Samples</a>
        <h1>Hero Card Finishes</h1>
        <p>The Welcome hero&apos;s stat cards in C · Deep Pane (live), with three 3D treatments for the figures, on the hero&apos;s own background at their live size.</p>
      </header>
      {OPTIONS.map((o) => (
        <section key={o.key} className={`hcf__opt hcf--${o.key}`} id={o.key}>
          <div className="hcf__label">
            <h2>{o.name}</h2>
            <p>{o.note}</p>
          </div>
          <div className="hcf__stage">
            <div className="hcf__box">
              <StatTicker />
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
