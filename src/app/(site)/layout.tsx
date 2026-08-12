import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { nav, brand } from '@/lib/nav';
import '../globals.css';

// Self-hosted at build time. v34 pulled Inter from fonts.googleapis.com, which is a
// render-blocking third-party round trip; production must make zero external requests.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://apexhospitality.online'),
  title: {
    default: 'Apex Hospitality — Turn your property into a digital booking machine',
    template: '%s — Apex Hospitality',
  },
  description:
    'Deliver the immersive, short-form video content that modern travelers expect, without the logistical headaches of a traditional film crew.',
  openGraph: { siteName: brand.tradingName, type: 'website' },
};

/**
 * Root layout for the site proper. It is one of two roots: `(samples)` has its
 * own, so the design references there render with no header, no footer and none
 * of this stylesheet. Route groups do not appear in URLs, so `/` and every
 * `/products/...` path is unchanged by the split.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={nav.footer.locale.code} className={inter.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
