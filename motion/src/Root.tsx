import { Composition } from 'remotion';
import { AD_FPS, AD_FRAMES, WelcomeAd } from './films/WelcomeAd';
import { WELCOME_HERO_FRAMES, WelcomeHero } from './films/WelcomeHero';

export const Root = () => (
  <>
    <Composition id="WelcomeHero" component={WelcomeHero} durationInFrames={WELCOME_HERO_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="WelcomeAd16x9" component={WelcomeAd} durationInFrames={AD_FRAMES} fps={AD_FPS} width={1920} height={1080} />
    <Composition id="WelcomeAd9x16" component={WelcomeAd} durationInFrames={AD_FRAMES} fps={AD_FPS} width={1080} height={1920} />
  </>
);
