import Link from 'next/link';
import PageShell from '@/components/PageShell';
import products from '@/data/products.json';

type Blueprint = { format: string; groups: [string, string[]][] };
export type Product = {
  rank: number;
  tier: string;
  plan?: string;
  concept: string;
  math: string;
  quote: string;
  why?: [string, string][];
  personas?: [string, string][];
  pipeline?: string[];
  blueprint?: Blueprint;
};

// JSON imports widen tuples to arrays, so the structural cast needs the unknown hop.
export const catalogue = products as unknown as Record<string, Product>;

/**
 * Product detail template — 18 of the 57 routes.
 *
 * Built against Weddings, which carries the deepest structure (a 10-clip two-day
 * blueprint) rather than against a clean example: a shell that holds the awkward
 * instance holds the easy ones, and the reverse is not true. The optional
 * why/personas/blueprint sections are the parts most products do not yet have.
 *
 * Per the pricing decision: no price appears here. The eligibility band points
 * at /plans, which owns pricing in one place rather than eighteen.
 */
export default function ProductDetail({
  path,
  title,
  product,
}: {
  path: string;
  title: string;
  product: Product;
}) {
  return (
    <PageShell path={path} title={title} lede={product.concept}>
      <div className="prank">
        <span className="pill">Rank {product.rank} of 18</span>
        <span className="ptier">{product.tier}</span>
      </div>

      {/* Still hero. Film is reserved for category pages and embedded here as a
          proof block once the media pipeline lands. */}
      <div className="pmedia" role="img" aria-label={`${title} — cinematic still`}>
        <span>Cinematic still — pending asset ingest</span>
      </div>

      <section className="psec">
        <h2>The owner’s math</h2>
        <p>{product.math}</p>
      </section>

      {product.personas && (
        <section className="psec">
          <h2>Who uses this</h2>
          <dl className="pdefs">
            {product.personas.map(([who, how]) => (
              <div key={who}>
                <dt>{who}</dt>
                <dd>{how}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {product.why && (
        <section className="psec">
          <h2>Why it works</h2>
          <dl className="pdefs">
            {product.why.map(([name, body]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {product.pipeline && (
        <section className="psec">
          <h2>How it is produced</h2>
          <ol className="pclips">
            {product.pipeline.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
      )}

      {product.blueprint && (
        <section className="psec">
          <h2>The blueprint</h2>
          <p className="pformat">{product.blueprint.format}</p>
          {product.blueprint.groups.map(([phase, clips]) => (
            <div className="pphase" key={phase}>
              <h3>{phase}</h3>
              <ol className="pclips">
                {clips.map((c) => <li key={c}>{c}</li>)}
              </ol>
            </div>
          ))}
        </section>
      )}

      <figure className="pquote">
        <blockquote>{product.quote}</blockquote>
      </figure>

      <section className="pband">
        <div>
          <h2>Included in your plan</h2>
          <p>
            {product.plan
              ? `Available from the ${product.plan} tier upward.`
              : 'Availability depends on your tier.'}{' '}
            Plans set what is produced each month and in how many languages.
          </p>
        </div>
        <div className="pbandcta">
          <Link className="btn btn-solid" href="/plans">Compare plans</Link>
          <Link className="btn btn-ghost" href="/contact-sales">Talk to sales</Link>
        </div>
      </section>
    </PageShell>
  );
}
