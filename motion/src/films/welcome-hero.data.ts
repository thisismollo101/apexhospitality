/*
 * Copy and timing for the Welcome hero film, at 30fps. The three points and
 * their figures are the ones in the hero section of
 * src/app/(site)/products/vip-guest-services/welcome/WelcomeBody.tsx — keep
 * them in step with the page. Figures with * are unverified, as on the page.
 *
 * Timings sit on the cuts in public/media/welcome/hero.mp4 (a new shot
 * roughly every 2s; the dining overhead is at 10s, sunset at 28s).
 */
const s = (sec: number) => Math.round(sec * 30);

export const HERO = {
  src: 'media/welcome/hero.mp4',

  title: {
    kicker: 'Apex Welcome',
    lines: ['This Is the Single Largest', 'Commercial Leak on Your P&L.'],
    from: s(0.4),
    to: s(4.6),
  },

  stats: [
    {
      kicker: 'Today',
      lo: 2,
      hi: 5,
      label: 'Front desk check-in upsells convert at 2% to 5%.',
      source: 'BookingWhizz / Akia. Source pending verification.',
      from: s(5),
      to: s(9.6),
      align: 'left' as const,
    },
    {
      kicker: 'With Apex',
      lo: 15,
      hi: 25,
      label: 'Data Driven Mobile Cinema converts at 15% to 25%.',
      source: 'BookingWhizz / Akia. Source pending verification.',
      from: s(10),
      to: s(15.4),
      align: 'right' as const,
    },
    {
      kicker: 'The result',
      lo: 5,
      unit: 'x',
      star: false,
      label: 'Your pre-arrival revenue, with zero staff labor.',
      from: s(22),
      to: s(27.2),
      align: 'left' as const,
    },
  ],

  compare: {
    title: 'Same guest. Different moment.',
    rows: [
      { label: 'Front desk, at check-in', value: '2–5%*', pct: 20 },
      { label: 'Mobile Cinema, before arrival', value: '15–25%*', pct: 100, hot: true },
    ],
    source: 'BookingWhizz / Akia. Source pending verification.',
    from: s(15.8),
    to: s(21.6),
  },

  statement: {
    text: 'Your revenue walks out the door before your guest walks in.',
    from: s(27.6),
    to: s(32.6),
  },

  glints: [s(4.8), s(9.8), s(15.6), s(21.8), s(27.4)],
  bug: { from: s(1), to: s(33) },
  endCard: { at: s(33.6), dur: s(4.4), line: 'VIP Guest Services · Welcome' },
};
