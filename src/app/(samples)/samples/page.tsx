import Link from 'next/link';
import { samples } from '@/lib/samples';

export const metadata = { title: 'Design references' };

export default function SamplesIndex() {
  const live = samples.filter((s) => s.status === 'live').length;

  return (
    <main className="sx">
      <div className="sxin">
        <a className="sxback" href="/">← Apex Hospitality</a>
        <h1>Revolut design references</h1>
        <p className="sxlede">
          Recreations of Revolut pages, built from their own markup so we have the
          real layouts to pull from. Header and footer are left off deliberately —
          each page is the body only, styled by its own stylesheet, with stand-in
          photography in place of the originals&rsquo; assets.
        </p>
        <p className="sxlede">
          {live} of {samples.length} built.
        </p>

        <ul className="sxlist">
          {samples.map((s) => {
            const inner = (
              <>
                <b>{s.label}</b>
                <span>{s.summary}</span>
                <span className={`sxtag${s.status === 'live' ? ' is-live' : ''}`}>
                  {s.status === 'live' ? 'Built' : 'Awaiting code'}
                </span>
              </>
            );
            return (
              <li key={s.slug}>
                {s.status === 'live' ? (
                  <Link className="sxrow" href={`/samples/${s.slug}`}>{inner}</Link>
                ) : (
                  <div className="sxrow is-empty">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="sxnote">
          <b>Adding one.</b> Drop the markup at{' '}
          <code>src/app/(samples)/samples/&lt;slug&gt;/page.tsx</code> with its
          stylesheet beside it as <code>style.css</code>, then add the slug to{' '}
          <code>src/data/samples.json</code> — that registers it here and in the
          header dropdown at the same time. Images come from the{' '}
          <Link href="/samples/kit">placeholder kit</Link>; nothing on these pages
          should reach outside the repo for an asset.
        </div>
      </div>
    </main>
  );
}
