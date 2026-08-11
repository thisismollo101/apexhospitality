/**
 * Proof strip — Revolut's "logos" block (sections 2 and 3 of their homepage).
 *
 * A caption above a wrapping row of equal tiles, each a fixed-ratio media slot
 * with a label beneath. Two widths ship: `narrow` (their 4-up award row) and
 * `wide` (their 3-up row). Their tiles hold award badges; ours hold figures
 * until real badges exist, so the slot renders its own content rather than an
 * empty box.
 */
export type ProofTile = { figure?: string; label: string };

export default function ProofTiles({
  caption,
  tiles,
  width = 'narrow',
}: {
  caption?: string;
  tiles: ProofTile[];
  width?: 'narrow' | 'wide';
}) {
  return (
    <section className="proof">
      <div className="pwrap">
        <div className="proofstack">
          {caption && <h2 className="proofcap">{caption}</h2>}
          <ul className={`prooflist ${width === 'wide' ? 'is-wide' : 'is-narrow'}`}>
            {tiles.map((t) => (
              <li key={t.label}>
                <figure>
                  <div className="proofmedia">
                    <div className="proofmediainner">
                      {t.figure ? <strong>{t.figure}</strong> : null}
                    </div>
                  </div>
                  <figcaption>{t.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
