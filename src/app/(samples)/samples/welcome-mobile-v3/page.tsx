import { redirect } from 'next/navigation';

/** The route opens on option A; each option has its own page so it screenshots alone. */
export default function WelcomeMobileV3() {
  redirect('/samples/welcome-mobile-v3/hero-a');
}
