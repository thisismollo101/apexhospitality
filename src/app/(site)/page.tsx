import Link from 'next/link';
import HeroReveal from '@/components/HeroReveal';
import ProofTiles from '@/components/home/ProofTiles';
import FeatureTabs from '@/components/home/FeatureTabs';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const products = (nav.header.dropdowns as NavDropdown[]).find((d) => d.id === 'products');
const categories = (products?.columns ?? []) as NavColumn[];

// Figures are the owner's own, from the 18-product commercial hierarchy.
// Placeholder only in the sense that award badges will replace the tiles.
const MARKET_PROOF = [
  { figure: '80%', label: 'of high-intent travelers watch video before booking' },
  { figure: '270%', label: 'lift in conversion from suite micro-tours' },
  { figure: '2.4x', label: 'engagement once assets are localised' },
  { figure: '74%', label: 'more likely to book within seven days' },
];

const CATEGORY_PROOF = [
  { figure: '92%', label: 'trust recommendations from friends and family above all other marketing' },
  { figure: '37%', label: 'better performance from experience-based bundles than hotel-only offers' },
  { figure: '2.8x', label: 'more engagement from cinematic motion than static advertising' },
];

const FEATURE_TABS = [
  {
    id: 'weddings',
    caption: 'Weddings',
    title: 'Six-figure weekends, sold in advance',
    description:
      'A 10-clip “Day 1 + Day 2” blueprint that resolves the logistics couples and planners stress over, while capturing the emotional gravity that fills a multi-year waiting list.',
    footnote:
      'Weddings are the single most profitable event a luxury property can host. Experience-based bundled packages outperform hotel-only offers by 37%.',
    cta: { label: 'Explore Weddings', href: '/products/specialized-venues/weddings' },
  },
  {
    id: 'corporate',
    caption: 'Corporate & MICE',
    title: 'Fill the mid-week calendar',
    description:
      'A B2B proof engine that shows planners real configurations in motion — tech panels, round-table setups, AV staging — and removes the burden of proof on a property buyout.',
    footnote: 'Corporate bookings are the lifeblood of off-peak and mid-week occupancy.',
    cta: { label: 'Explore Corporate & MICE', href: '/products/specialized-venues/corporate-events' },
  },
  {
    id: 'dining',
    caption: 'Dining',
    title: 'Turn the restaurant into a funnel',
    description:
      'Sensory culinary work that replaces sterile menu listings, driving resident and non-resident covers into the slow blocks where the margin actually leaks.',
    footnote: 'Culinary travel content drives a 52% boost in engagement; 35% of travelers choose destinations on food culture.',
    cta: { label: 'Explore Dining', href: '/products/billboards/dining' },
  },
];

export default function Home() {
  return (
    <main className="home">
      <HeroReveal />

      <ProofTiles
        caption="The numbers the category is already moving on"
        tiles={MARKET_PROOF}
        width="narrow"
      />

      <ProofTiles tiles={CATEGORY_PROOF} width="wide" />

      <FeatureTabs tabs={FEATURE_TABS} />

      <section className="hcats">
        <div className="pwrap">
          <header className="phead">
            <h2>Six things we build, running all year.</h2>
            <p className="plede">Each one holds three. Open any of them.</p>
          </header>

          <div className="catgrid">
            {categories.map((c) => (
              <article className="catcard" key={c.heading}>
                <h3><Link href={c.href}>{c.heading}</Link></h3>
                <ul>
                  {c.items.map((i) => (
                    <li key={i.href}><Link href={i.href}>{i.label}</Link></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hcta">
        <div className="pwrap">
          <h2>You spent millions building a physical masterpiece.</h2>
          <p>Your digital storefront should not be sitting silent.</p>
          <Link className="btn btn-solid" href="/contact-sales">Book an on-site visit</Link>
        </div>
      </section>
    </main>
  );
}
