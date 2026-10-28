import { HERO } from './data';
import { BgFilm, Ticker } from './parts';

/** The Apex lockup, drawn the site's way: the mark in its three tones, then the wordmark. */
const ApexLogo = () => (
  <span className="lockup" role="img" aria-label="Apex Hospitality">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,11 9,85 50,63" fill="#163C7B" />
      <polygon points="50,11 91,85 50,63" fill="#2A7BFF" />
      <polygon points="9,85 91,85 50,63" fill="#0E2144" />
    </svg>
    <span className="lockup__apex">Apex</span>
    <span className="lockup__hosp">Hospitality</span>
  </span>
);

export default function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <p className="strip">
        {HERO.strip.text}
      </p>

      <div className="hero__stage">
        <BgFilm clip={HERO.film} poster={HERO.poster} />
        <span className="hero__scrim" aria-hidden="true" />
        <div className="hero__in">
          <h1 className="hero__h">{HERO.headline}</h1>
          <Ticker boxes={HERO.boxes} />
        </div>
      </div>

      <ul className="logos">
        {HERO.logos.map((l) => (
          <li key={l.key} className={`logos__item logos__item--${l.key}`}>
            {l.src ? (
              // eslint-disable-next-line @next/next/no-img-element -- vendor logo files at fixed size
              <img src={l.src} alt={l.name} width={l.w} height={l.h} loading="lazy" decoding="async" />
            ) : (
              <ApexLogo />
            )}
            {l.key === 'aven' && <span className="logos__line">{HERO.logoLine}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
