import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './samples.css';

// Revolut sets body copy in Inter and headings in Aeonik Pro. Aeonik is
// licensed to them, so the references fall back for headings — but Inter is
// open, self-hosted at build time here, and gets the body ramp right.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

/**
 * Second root layout, for the Revolut design references under /samples.
 *
 * These pages are recreations of someone else's markup, kept as close to the
 * original as the port allows so we can lift pieces of them into Apex later.
 * That only works if nothing of ours leaks in, so this root deliberately does
 * not render Header or Footer and does not import globals.css — a sample page
 * gets the reset in samples.css and whatever stylesheet it ships with, nothing
 * else. Navigating between /samples and the site crosses root layouts, which
 * Next handles as a full document load; that is what keeps the two CSS worlds
 * from ever being live at the same time.
 */
export const metadata: Metadata = {
  title: { default: 'Sample — Apex reference', template: '%s — Apex reference' },
  robots: { index: false, follow: false },
};

export default function SamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
