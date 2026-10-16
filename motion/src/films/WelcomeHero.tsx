import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { EndCard } from '../parts/EndCard';
import { Bug, Glint, Grade, Wipe } from '../parts/Polish';
import { Compare, StatCallout } from '../parts/Stats';
import { KineticTitle, Statement } from '../parts/Titles';
import { HERO as T } from './welcome-hero.data';

/*
 * The Welcome hero film with the hero section's three points cut into it.
 * Every word and figure is in welcome-hero.data.ts; this file is only the
 * layering order.
 */
export const WELCOME_HERO_FRAMES = T.endCard.at + T.endCard.dur;

export const WelcomeHero = () => (
  <AbsoluteFill style={{ background: '#06080F' }}>
    <OffthreadVideo src={staticFile(T.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.06) saturate(1.05)' }} />
    <Grade />

    <KineticTitle kicker={T.title.kicker} lines={T.title.lines} from={T.title.from} to={T.title.to} />
    {T.stats.map((s, i) => <StatCallout key={i} {...s} />)}
    <Compare {...T.compare} />
    <Statement {...T.statement} />

    {T.glints.map((g) => <Glint key={g} at={g} />)}
    <Bug from={T.bug.from} to={T.bug.to} />

    <Wipe at={4} dur={22} dir="in" />
    <Wipe at={T.endCard.at - 18} dir="out" />
    <Sequence from={T.endCard.at} durationInFrames={T.endCard.dur}>
      <EndCard line={T.endCard.line} />
    </Sequence>
  </AbsoluteFill>
);
