import type { ComponentType } from 'react';
import { ContinuumA, ContinuumB, ContinuumC } from './Continuum';
import { EventsA, EventsB, EventsC } from './Events';
import { ExpectA, ExpectB, ExpectC } from './Expect';
import { HowA, HowB, HowC } from './How';
import { SourcesA, SourcesB, SourcesC } from './Sources';
import { StarsA, StarsB, StarsC } from './Stars';
import { SubA, SubB, SubC } from './Sub';
import { UnlockA, UnlockB, UnlockC } from './Unlock';
import { WhatIfA, WhatIfB, WhatIfC } from './WhatIf';
import { WhoA, WhoB, WhoC } from './Who';
import { WrongWayA, WrongWayB, WrongWayC } from './WrongWay';

/**
 * The eleven sections after Hero, Why and the films, three options each, keyed
 * by their route slug (<section>-<a|b|c>). Hero, Why, Films and Staff voice
 * keep their own route folders, which take precedence over [slug].
 */
export const MORE: Record<string, ComponentType> = {
  'wrongway-a': WrongWayA,
  'wrongway-b': WrongWayB,
  'wrongway-c': WrongWayC,
  'stars-a': StarsA,
  'stars-b': StarsB,
  'stars-c': StarsC,
  'how-a': HowA,
  'how-b': HowB,
  'how-c': HowC,
  'expect-a': ExpectA,
  'expect-b': ExpectB,
  'expect-c': ExpectC,
  'who-a': WhoA,
  'who-b': WhoB,
  'who-c': WhoC,
  'sub-a': SubA,
  'sub-b': SubB,
  'sub-c': SubC,
  'whatif-a': WhatIfA,
  'whatif-b': WhatIfB,
  'whatif-c': WhatIfC,
  'unlock-a': UnlockA,
  'unlock-b': UnlockB,
  'unlock-c': UnlockC,
  'events-a': EventsA,
  'events-b': EventsB,
  'events-c': EventsC,
  'continuum-a': ContinuumA,
  'continuum-b': ContinuumB,
  'continuum-c': ContinuumC,
  'sources-a': SourcesA,
  'sources-b': SourcesB,
  'sources-c': SourcesC,
};
