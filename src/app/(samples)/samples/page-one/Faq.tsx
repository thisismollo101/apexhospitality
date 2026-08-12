'use client';

import { useId, useState } from 'react';

/**
 * The FAQ accordion. Revolut's marker is their PlusCircle icon, drawn here
 * rather than fetched, and rotated 45° to read as a minus when open.
 *
 * Panels animate on grid-template-rows so each one sizes to its own content
 * instead of needing a measured max-height.
 */
export type Entry = { q: string; a: string[] };

export default function Faq({ items }: { items: Entry[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  return (
    <ul>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li className="faqitem" key={it.q}>
            <button
              type="button"
              className="faqtrig"
              aria-expanded={isOpen}
              aria-controls={`${uid}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <h3 className="t-caption">{it.q}</h3>
              <svg className="faqicon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className={`faqpanel${isOpen ? ' is-open' : ''}`} id={`${uid}-${i}`} role="region">
              <div>
                {it.a.map((p) => (
                  <p className="t-body" key={p}>{p}</p>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
