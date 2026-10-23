import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StatTicker from './StatTicker';

// One stylesheet for the route. See style.css.
import './style.css';

/*
 * Hero Card Finishes: the live Welcome hero's stat ticker three times, on the
 * hero's own still, each in a different translucent 3D finish (Aidan, 23 Oct).
 * Same copy, sizes and motion as live; only the cards' surface differs.
 * A is what the live page now carries. Desktop and tablet; scoped under .hcf.
 */
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = { title: 'Hero Card Finishes' };

const OPTIONS = [
  { key: 'a', name: 'A · Glass Sweep', note: 'Live now. Site blue on the left to deep navy on the right, frosted, a lit top edge and a soft sheen.' },
  { key: 'b', name: 'B · Frosted Bevel', note: 'More see-through. A brighter blue fading to a faint navy, a stronger bevel top and bottom, rounder corners.' },
  { key: 'c', name: 'C · Deep Pane', note: 'Richest colour shift: near-solid blue on the left falling to almost clear on the right, lit from the top left, sitting higher off the page.' },
];

export default function HeroCardFinishes() {
  return (
    <main className={`hcf ${body.className}`}>
      <header className="hcf__head">
        <a href="/samples">← Samples</a>
        <h1>Hero Card Finishes</h1>
        <p>The Welcome hero&apos;s three stat cards in three finishes, on the hero&apos;s own background, at their live size.</p>
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
