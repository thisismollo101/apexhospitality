import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ApexLockup from '@/components/ApexLockup';
import ApexSectionBackground from './ApexSectionBackground';
import Clip from './Clip';
import FeatureCards from './FeatureCards';
import PostsMarquee from './PostsMarquee';
import Revolut from './sections/Revolut';
import { LIFTED } from './sections/lifted';
import { FEATURES, HERO, POSTS } from './data';

// One stylesheet, which itself @imports globals.css and welcome.css so the whole
// page ships as a single sheet in a guaranteed order. See style.css.
import './style.css';

/**
 * Welcome Page Two — a second pass at the Welcome landing page, parked under
 * /samples until it is ready to take over the real route. The existing page at
 * /products/vip-guest-services/welcome is untouched.
 *
 * The samples root layout renders no header and no footer, on purpose: the
 * Revolut references there are meant to be uncontaminated by our own chrome.
 * This page is not one of those — it is our own page being drafted — so it
 * brings the real Header and Footer in itself. That is the only thing it does
 * differently from its neighbours, and it is why style.css has to pull in
 * globals.css: the chrome's rules live in v34.
 */
export const metadata: Metadata = { title: 'Welcome Page Two' };

export default function WelcomeTwoPage() {
  return (
    <>
      <Header />

      <main className="page wpage w2page">
        {/* ---- 1. the hero ------------------------------------------------ */}
        <section id="s1" className="wsec w2hero">
          <div className="w2hero-media">
            <Clip name={HERO.clip} />
          </div>

          <div className="pwrap w2hero-in">
            <span className="w2hero-tag">{HERO.tag}</span>
            <div className="w2hero-copy">
              <h1>{HERO.headline}</h1>
              <p className="w2hero-sub">{HERO.subhead}</p>
              <a className="w2hero-cta" href={HERO.ctaHref}>
                {HERO.cta}
              </a>
            </div>
          </div>

          <span className="w2scroll" aria-hidden />
        </section>

        {/* ---- 2. the particle field --------------------------------------
            No count override — density is set by the component's own CONFIG,
            so there is one place to tune it rather than two that can disagree. */}
        <section id="s2" className="wsec axbg-host">
          {/* clickToShift cycles Cobalt -> Nebula -> Ember -> Aurora on click.
              The component defaults its prop to false even though BASE_CONFIG
              says true, so it has to be asked for. Note the listener is on the
              window, not this section: it ignores links, buttons and form
              controls, but a click anywhere else on the page still advances
              the palette. */}
          <ApexSectionBackground clickToShift />

          {/* The lockup rather than a written heading — the mark tumbles in and
              the wordmark wipes across after it, both held until the section is
              reached. Centred along the bottom; nothing sits over the field. */}
          <div className="pwrap axbg-content">
            <ApexLockup />
          </div>
        </section>

        {/* ---- 3. latest posts -------------------------------------------- */}
        <section id="s3" className="wsec w2posts">
          <div className="pwrap">
            <header className="wsec-head">
              <span className="wsec-tag">Section 3</span>
              <h2>Latest posts</h2>
              <p>What went out this week, in the format it went out in. Hover to hold the reel.</p>
            </header>
          </div>

          <PostsMarquee posts={POSTS} />
        </section>

        {/* ---- 4. featured products --------------------------------------- */}
        <section id="s4" className="wsec is-alt w2feat">
          <div className="pwrap">
            <header className="wsec-head">
              <span className="wsec-tag">Section 4</span>
              <h2>Featured products</h2>
              <p>Four of the eighteen. Open one and it grows out of its own column rather than throwing you elsewhere.</p>
            </header>

            <FeatureCards features={FEATURES} />
          </div>
        </section>

        {/* ---- 5-26. lifted from Welcome and Apex Sections -----------------
            Twenty-two sections that already share this page's shape — .wsec,
            .pwrap, .wsec-head — so they render through one loop rather than
            twenty-two near-identical blocks. What each one is and where it came
            from lives in sections/lifted.tsx.

            The alternating ground is computed here, not carried in the data:
            .is-alt has to alternate against whatever sits above it, and hard-
            coding a flag per section would have to be re-checked by hand every
            time the order changes. Section 4 is alt, so section 5 is not. */}
        {LIFTED.map((s, i) => (
          <section key={s.n} id={`s${s.n}`} className={`wsec${i % 2 ? ' is-alt' : ''}`}>
            <div className="pwrap">
              <header className="wsec-head">
                <span className="wsec-tag">Section {s.n}</span>
                <h2>{s.title}</h2>
                <p>{s.lede}</p>
              </header>
              {s.body}
            </div>
          </section>
        ))}

        {/* ---- 27-30. lifted from Sample Page One -------------------------- */}
        <Revolut />

        <div className="pwrap">
          <a className="w2back" href="/samples">
            ← References
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
