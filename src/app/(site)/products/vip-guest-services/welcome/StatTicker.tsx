/**
 * Welcome hero — the three stat cards on the right, as approved by Aidan
 * ("Ticker 1"): each card keeps its stat locked left and its label still in caps
 * above, and its sentence runs right to left as a slow, seamless ticker in capitals.
 *
 * Revision on top of the approved mock: cards 20% shorter (68px, was ~85px; text
 * sizes unchanged) and double the dark gap between them (20px, was ~10px).
 *
 * Its CSS is folded into official.css under .w3page .hd .stk. It fills its
 * parent's width (designed at 468px). Pure CSS motion — stays a server component.
 * prefers-reduced-motion: no ticker; the sentence is shown wrapped and still.
 */

// Vetted figures only (Evidence Ledger v1.0 / EVIDENCE-SSOT); ledger IDs in comments.
const CARDS = [
  { label: 'Direct Value', stat: '$519', copy: 'The average direct booking, against $320 through an OTA (SiteMinder Hotel Booking Trends 2025).' }, // G-10
  { label: 'Own Language', stat: '76%', copy: 'Of consumers prefer to buy with information in their own language (CSA Research, 2020).' }, // P04-1
  { label: 'Front Desk', stat: '65%', copy: 'Of US hotels report staffing shortages. The films add nothing to the desk (AHLA, Feb 2025).' }, // G-18
];

export default function StatTicker() {
  return (
    <ul className="stk">
      {CARDS.map((c) => (
        <li key={c.label} className="stk-card">
          <span className="stk-stat">
            <span className="stk-num">{c.stat}</span>
          </span>
          <span className="stk-body">
            <span className="stk-label">{c.label}</span>
            {/* the readable sentence for screen readers and reduced motion */}
            <span className="stk-still">{c.copy}</span>
            {/* the ticker: two identical copies so the loop is seamless */}
            <span className="stk-tape" aria-hidden="true">
              <span className="stk-run">
                <span className="stk-copy">
                  {c.copy}
                  <i className="stk-sep" />
                </span>
                <span className="stk-copy">
                  {c.copy}
                  <i className="stk-sep" />
                </span>
              </span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
