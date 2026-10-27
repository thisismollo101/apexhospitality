import Link from 'next/link';
import HeroReveal from '@/components/HeroReveal';
import ProofTiles from '@/components/home/ProofTiles';
import FeatureTabs from '@/components/home/FeatureTabs';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const products = (nav.header.dropdowns as NavDropdown[]).find((d) => d.id === 'products');
const categories = (products?.columns ?? []) as NavColumn[];

// Every figure below is from the vetted evidence bank (Evidence Ledger v1.0 /
// EVIDENCE-SSOT) and names its source in the label. Ledger IDs in comments.
// Placeholder only in the sense that award badges will replace the tiles.
const MARKET_PROOF = [
  { figure: '73%', label: 'say creator content has influenced a booking (Expedia, 2025)' }, // G-05
  { figure: '141', label: 'pages viewed over about 45 days before a booking (Expedia Group, 2023)' }, // G-04
  { figure: '$519', label: 'average direct booking, against $320 through an OTA (SiteMinder, 2025)' }, // G-10
  { figure: '76%', label: 'prefer to buy in their own language (CSA Research, 2020)' }, // P04-1
];

const CATEGORY_PROOF = [
  { figure: '88%', label: 'trust recommendations from people they know (Nielsen, 2021)' }, // G-02
  { figure: '11.2%', label: 'higher rate per review-score point at the same occupancy (Cornell, 2012)' }, // G-15
  { figure: '50ms', label: 'to form a visual judgement of what is on screen (Lindgaard et al., 2006)' }, // G-08
];

const FEATURE_TABS = [
  {
    id: 'weddings',
    caption: 'Weddings',
    title: 'Wedding weekends, sold in advance',
    description:
      'A 10-clip “Day 1 + Day 2” blueprint that resolves the logistics couples and planners stress over, while capturing the emotional gravity that fills the calendar.',
    footnote:
      'The average US wedding cost $34,000 with 117 guests in 2025 (The Knot Real Weddings Study 2026).',
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
    footnote: 'Only about one in eight hotel guests eats dinner at the hotel (CBRE Hotels Americas, via Regulr).',
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
          <Link className="btn btn-solid" href="/contact-sales">Book a private demo</Link>
        </div>
      </section>
    </main>
  );
}
