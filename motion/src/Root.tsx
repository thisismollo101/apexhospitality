import { Composition } from 'remotion';
import { AD_FPS, AD_FRAMES, WelcomeAd } from './films/WelcomeAd';
import { WELCOME_HERO_FRAMES, WelcomeHero } from './films/WelcomeHero';
import { REEL_FPS, REEL_FRAMES, WelcomeReel } from './films/WelcomeReel';
import { STORY_FPS, STORY_FRAMES, WelcomeStory } from './films/WelcomeStory';

export const Root = () => (
  <>
    <Composition id="WelcomeHero" component={WelcomeHero} durationInFrames={WELCOME_HERO_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="WelcomeAd16x9" component={WelcomeAd} durationInFrames={AD_FRAMES} fps={AD_FPS} width={1920} height={1080} />
    <Composition id="WelcomeAd9x16" component={WelcomeAd} durationInFrames={AD_FRAMES} fps={AD_FPS} width={1080} height={1920} />
    <Composition id="WelcomeStory16x9" component={WelcomeStory} durationInFrames={STORY_FRAMES} fps={STORY_FPS} width={1920} height={1080} />
    <Composition id="WelcomeStory9x16" component={WelcomeStory} durationInFrames={STORY_FRAMES} fps={STORY_FPS} width={1080} height={1920} />
    <Composition id="WelcomeReel16x9" component={WelcomeReel} durationInFrames={REEL_FRAMES} fps={REEL_FPS} width={1920} height={1080} />
    <Composition id="WelcomeReel9x16" component={WelcomeReel} durationInFrames={REEL_FRAMES} fps={REEL_FPS} width={1080} height={1920} />
  </>
);
