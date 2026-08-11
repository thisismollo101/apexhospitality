import Link from 'next/link';
import { nav } from '@/lib/nav';
import type { NavColumn, NavDropdown } from '@/lib/nav';

const products = (nav.header.dropdowns as NavDropdown[]).find((d) => d.id === 'products');
const categories = (products?.columns ?? []) as NavColumn[];

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-copy">
          <h1>Turn Your Property Into A Digital Booking Machine.</h1>
          <p>
            Deliver the immersive, short-form video content that modern travelers expect,
            without the logistical headaches of a traditional film crew.
          </p>
          <div className="herocta">
            <Link className="btn btn-solid" href="/library">View the Gallery</Link>
            <Link className="btn btn-ghost" href="/contact-sales">Talk to sales</Link>
          </div>
        </div>
      </section>

      <section className="hstrip">
        <div className="pwrap">
          <div className="hstats">
            <div><strong>80%</strong><span>of high-intent travelers watch video before booking</span></div>
            <div><strong>270%</strong><span>lift in conversion from suite micro-tours</span></div>
            <div><strong>2.4x</strong><span>engagement when assets are localised</span></div>
          </div>
        </div>
      </section>

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
