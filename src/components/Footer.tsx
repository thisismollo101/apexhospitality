import Link from 'next/link';
import ApexMark from '@/components/ApexMark';
import { nav, brand } from '@/lib/nav';

const footer = nav.footer as {
  clusters: { heading: string; items: { label: string; href: string }[] }[];
  disclosure: string;
  social: { network: string; href: string; icon: string }[];
  locale: { label: string; code: string };
  legal: { label: string; href: string }[];
};

/** 24x24 stroked, per v34's icon rule — no filled marks, no icon font. */
const ICONS: Record<string, React.ReactNode> = {
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5V17M7.5 7.5v.01M11.5 17v-6.5M11.5 13.2a2.7 2.7 0 0 1 5.4 0V17" /></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10.2 9.7l4.8 2.8-4.8 2.8z" /></>,
  tiktok: <><path d="M14.4 3v9.9a3.9 3.9 0 1 1-3.3-3.85" /><path d="M14.4 3c.3 2.4 1.9 4 4.3 4.2" /></>,
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="fwrap">
        {/* The same lockup as the nav, a step down in size. `fold` rather
            than `tumble`: the nav's sting is the arrival: down here the mark
            settles rather than announces, and it only plays once the footer
            is actually reached. */}
        <Link className="fbrand" href="/" aria-label="Apex Hospitality — home">
          <ApexMark className="fbrand-mark" anim="fold" />
          Apex <em>Hospitality</em>
        </Link>

        <div className="fclusters">
          {footer.clusters.map((c) => (
            <div className="fcl" key={c.heading}>
              <h3>{c.heading}</h3>
              <ul>
                {c.items.map((i) => (
                  <li key={i.href}><Link href={i.href}>{i.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="fdisclosure">{footer.disclosure}</p>

        <div className="fstrip">
          <div className="fsocial">
            {footer.social.map((s) => (
              <a key={s.network} href={s.href} rel="noopener" target="_blank" aria-label={s.network}>
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">{ICONS[s.icon]}</svg>
              </a>
            ))}
          </div>
          <button className="flocale" type="button" aria-label="Change region and language">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.6 2.6 2.6 15 0 18M12 3c-2.6 2.6-2.6 15 0 18" />
            </svg>
            <span>{footer.locale.label}</span>
          </button>
        </div>

        <div className="fstrip">
          <p className="fcopy">{brand.copyright}</p>
          <ul className="flegal">
            {footer.legal.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
