import { Composition } from 'remotion';
import { WELCOME_HERO_FRAMES, WelcomeHero } from './films/WelcomeHero';

export const Root = () => (
  <>
    <Composition id="WelcomeHero" component={WelcomeHero} durationInFrames={WELCOME_HERO_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
