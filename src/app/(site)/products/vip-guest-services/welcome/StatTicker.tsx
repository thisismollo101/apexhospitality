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

// Only the existing copy.
const CARDS = [
  { label: 'Status Quo', stat: '5%', copy: 'Front desk check-in upsells convert at just 2% to 5% when guests arrive tired.' },
  { label: 'APEX Conversion', stat: '25%', copy: 'Data Driven Mobile Cinema converts at 15% to 25% during pre-arrival intent.' },
  { label: 'Operational Freedom', stat: '5X', copy: 'Multiplies pre-arrival revenue by 5x with ZERO staff labor or IT drag.' },
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
