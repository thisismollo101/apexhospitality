'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SECTIONS } from './data';

/**
 * The section rail — a secondary nav for a page long enough to get lost in.
 *
 * It parks below the site header rather than replacing it: the wireframe asks
 * for a sticky bar with the seven anchors, but Apex already has a fixed header
 * and a second brand logotype under the first one would read as a different
 * site. So this keeps the anchors and the demo CTA and drops the wordmark.
 *
 * The active anchor comes from an IntersectionObserver against the sections
 * rather than from scroll arithmetic — the sections are tall and unevenly
 * sized, and a band across the upper third picks the one a reader is in.
 */
export default function Nav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-24% 0px -68% 0px' },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <div className="wrail">
      <div className="pwrap wrail-in">
        <nav className="wrail-links" aria-label="Page sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
        <Link className="btn btn-solid wrail-cta" href="/contact-sales">
          Book private demo
        </Link>
      </div>
    </div>
  );
}
