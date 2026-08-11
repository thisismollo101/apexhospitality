import Link from 'next/link';
import { breadcrumbs } from '@/lib/nav';

/**
 * Shared page frame: breadcrumb trail + title band.
 * Breadcrumb labels resolve from navigation.json — no nav string is retyped here.
 */
export default function PageShell({
  path,
  title,
  lede,
  children,
}: {
  path: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  const trail = breadcrumbs(path);

  return (
    <main className="page">
      <div className="pwrap">
        {trail.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              {trail.map((c, i) => (
                <li key={c.href}>
                  {i === trail.length - 1 ? (
                    <span aria-current="page">{c.label}</span>
                  ) : (
                    <Link href={c.href}>{c.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <header className="phead">
          <h1>{title}</h1>
          {lede && <p className="plede">{lede}</p>}
        </header>

        {children}
      </div>
    </main>
  );
}
