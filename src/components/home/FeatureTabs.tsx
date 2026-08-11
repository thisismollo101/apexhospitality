'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Tabbed feature block — Revolut's "feature-items / variant: tabs" (section 4).
 *
 * Their structure, kept: a three-row grid of content / media / tabs stacked in
 * that order, sitting over a full-bleed backdrop. Every tab's panel is mounted
 * and absolutely positioned; switching crossfades opacity over 600ms rather
 * than swapping nodes, so nothing reflows. The backdrop layers crossfade with
 * it. Tabs scroll horizontally on narrow screens with the scrollbar hidden.
 *
 * Their copy block is also mounted once per tab with the inactive ones held at
 * `visibility: hidden` — that reserves the height of the tallest tab so the
 * media below never jumps as you switch. Kept, because it is the reason the
 * block feels stable.
 */
export type FeatureTab = {
  id: string;
  caption: string;
  title: string;
  description: string;
  footnote?: string;
  cta: { label: string; href: string };
};

export default function FeatureTabs({ tabs }: { tabs: FeatureTab[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="ftabs">
      <div className="ftabsbg" aria-hidden="true">
        {tabs.map((t, i) => (
          <div key={t.id} className={`ftabsbglayer${i === active ? ' is-on' : ''}`} />
        ))}
      </div>

      <div className="ftabsgrid pwrap">
        <div className="ftabscontent">
          {tabs.map((t, i) => (
            <div
              key={t.id}
              className="ftabstext"
              style={{ visibility: i === active ? 'visible' : 'hidden' }}
              aria-hidden={i !== active}
            >
              <h2>{t.title}</h2>
              <div className="ftabsbody">
                <p className="ftabsdesc">{t.description}</p>
                {t.footnote && <p className="ftabsfoot">{t.footnote}</p>}
              </div>
              <div className="ftabscta">
                <Link className="btn btn-solid" href={t.cta.href} tabIndex={i === active ? 0 : -1}>
                  {t.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="ftabsmedia">
          {tabs.map((t, i) => (
            <div
              key={t.id}
              role="tabpanel"
              id={`ftabpanel-${t.id}`}
              aria-labelledby={`ftab-${t.id}`}
              className={`ftabspanel${i === active ? ' is-on' : ''}`}
            >
              <div className="ftabsframe">
                <span>{t.caption} — pending asset ingest</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ftabsbar">
          <div role="tablist" aria-label="Featured products" className="ftabslist">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`ftab-${t.id}`}
                aria-selected={i === active}
                aria-controls={`ftabpanel-${t.id}`}
                className={`ftab${i === active ? ' is-on' : ''}`}
                onClick={() => setActive(i)}
              >
                {t.caption}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
