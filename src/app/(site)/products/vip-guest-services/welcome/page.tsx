import type { Metadata } from 'next';
import WelcomeBody from './WelcomeBody';
import './official.css';

/**
 * Apex Welcome — the official product page.
 *
 * A real file at this path rather than the nav-driven catch-all, which still
 * generates the other seventeen products from products.json through the shared
 * ProductDetail template. Next resolves the static segment first, so this page
 * takes over /products/vip-guest-services/welcome and nothing else moves.
 *
 * The page is the design artifact ported as it stands: WelcomeBody is the
 * markup, Behaviors wires up everything that moves, data.ts holds the copy the
 * scripts draw. The (site) layout supplies the Header and Footer.
 */
export const metadata: Metadata = {
  title: 'Apex Welcome',
  description:
    'Personal pre-arrival films, starring your own team, sent to every guest between booking and check-in. Zero staff labor.',
};

export default function WelcomePage() {
  return (
    <main>
      <WelcomeBody />
    </main>
  );
}
