import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/*
 * eslint-config-next ships flat configs from 15.3 on, so they are spread
 * directly here.
 *
 * This file used to route them through FlatCompat, which threw
 * "Converting circular structure to JSON" while loading the config — before it
 * read a single source file, so nothing in the repo was ever linted. FlatCompat
 * also imports @eslint/eslintrc, which was never a declared dependency: it
 * resolved only as long as something else happened to hoist it, and `npm run
 * lint` on a clean install failed outright with ERR_MODULE_NOT_FOUND.
 */
const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,

  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },

  {
    /*
     * The app has two root layouts — (site) and (samples) — and moving between
     * them has to replace the document. A next/link push would keep the origin
     * route's stylesheet alive underneath the destination and colour it, which
     * is the whole thing the split exists to prevent. So every link out of a
     * sample is deliberately a plain <a>, and this rule cannot see why.
     *
     * Scoped to the samples group rather than switched off repo-wide: inside
     * (site), where one layout owns every route, the rule is right and stays on.
     */
    files: ['src/app/(samples)/**/*.tsx'],
    rules: { '@next/next/no-html-link-for-pages': 'off' },
  },

  {
    /*
     * React 19's rule against setState in an effect body. Downgraded to a
     * warning: the components it flags read a value that only exists on the
     * client (scroll position, a media query) and set it once on mount, which
     * is the documented way to do that and cannot be expressed as lazy state
     * without breaking hydration. Left visible as a warning so genuinely
     * cascading cases still get noticed.
     */
    rules: { 'react-hooks/set-state-in-effect': 'warn' },
  },
];

export default config;
