import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * Permanent redirects for routes renamed on 27 Oct 2026, so old links never 404.
   * Guidebooks became Concierge; the Premium plan was retired; the deposit became
   * a separate setup fee.
   */
  async redirects() {
    return [
      /* Temporary (Aidan, 28 Oct): the Welcome page stands in as the home page until the home
         page is redesigned. Not permanent, so browsers do not cache it; delete this line to undo. */
      { source: '/', destination: '/products/vip-guest-services/welcome', permanent: false },
      { source: '/products/guidebooks', destination: '/products/concierge', permanent: true },
      { source: '/products/guidebooks/:path*', destination: '/products/concierge/:path*', permanent: true },
      { source: '/plans/premium', destination: '/plans', permanent: true },
      { source: '/deployment/deposit', destination: '/deployment/setup-fee', permanent: true },
    ];
  },
};

export default nextConfig;
