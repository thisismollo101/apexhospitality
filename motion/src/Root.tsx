import { Composition } from 'remotion';
import { MOTION_HERO_FPS, MOTION_HERO_FRAMES, MotionHero } from './films/MotionHero';
import { WELCOME_HERO_FRAMES, WelcomeHero } from './films/WelcomeHero';

export const Root = () => (
  <>
    <Composition id="WelcomeHero" component={WelcomeHero} durationInFrames={WELCOME_HERO_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="MotionHero16x9" component={MotionHero} durationInFrames={MOTION_HERO_FRAMES} fps={MOTION_HERO_FPS} width={1920} height={1080} />
    <Composition id="MotionHero9x16" component={MotionHero} durationInFrames={MOTION_HERO_FRAMES} fps={MOTION_HERO_FPS} width={1080} height={1920} />
  </>
);
