import Link from 'next/link';
import { navigation, sectors, site } from '@/content/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t bg-[var(--bg-elevated)]">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-[var(--brand-ink)]"
            >
              SN
            </span>
            <span className="font-bold leading-tight">
              SNAMI Bologna
              <span className="block text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Sezione Provinciale
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--ink-muted)]">
            {site.extendedName}. Un sindacato autonomo e polisettoriale, al fianco dei medici della
            provincia di Bologna.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-4 py-2 text-xs font-semibold transition hover:border-[var(--line-strong)]"
            >
              Facebook
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-4 py-2 text-xs font-semibold transition hover:border-[var(--line-strong)]"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <nav aria-label="Sezioni del sito">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Il sito
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/area-soci" className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]">
                Area soci
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Settori associativi">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Settori
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {sectors.slice(0, 6).map((sector) => (
              <li key={sector.slug}>
                <Link
                  href={`/settori/${sector.slug}`}
                  className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                >
                  {sector.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Contatti
          </h2>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-[var(--ink-muted)]">
            <p>{site.address}</p>
            <p>
              <a href={`mailto:${site.email}`} className="transition hover:text-[var(--ink)]">
                {site.email}
              </a>
            </p>
            <p>C.F. {site.taxCode}</p>
          </address>
          <ul className="mt-5 space-y-2.5 text-sm">
            {site.related.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="wrap flex flex-col gap-3 py-6 text-xs text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.legalName}. Tutti i diritti riservati.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="transition hover:text-[var(--ink)]">
              Privacy policy
            </Link>
            <Link href="/contatti" className="transition hover:text-[var(--ink)]">
              Scrivici
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
