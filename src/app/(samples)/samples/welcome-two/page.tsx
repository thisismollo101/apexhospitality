import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ApexSectionBackground from './ApexSectionBackground';
import Clip from './Clip';
import FeatureCards from './FeatureCards';
import PostsMarquee from './PostsMarquee';
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

        {/* ---- 2. the particle field -------------------------------------- */}
        <section id="s2" className="wsec axbg-host">
          {/* No count override. The component's own 155k default is what gives
              the field its density — at 90k the stars thin out and the mark
              loses its edge. Every clip on this page pauses off-screen, so
              nothing is decoding video while this section is up; there is no
              budget to save here. */}
          <ApexSectionBackground />

          <div className="pwrap axbg-content">
            <header className="wsec-head">
              <span className="wsec-tag">Section 2</span>
              <h2>The mark, taken apart and put back together</h2>
              <p>
                Seventeen and a half seconds, one draw call, no dependencies. It holds a single frame under reduced
                motion and falls back to a flat panel where WebGL is unavailable.
              </p>
            </header>
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
