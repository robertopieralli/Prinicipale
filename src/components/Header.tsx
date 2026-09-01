'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navigation, site } from '@/content/site';
import ThemeToggle from './ThemeToggle';

export default function Header({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="wrap flex h-[4.5rem] items-center gap-6">
        <Link href="/" className="flex items-center" aria-label={`${site.legalName} — home`}>
          {/* Il lockup contiene già il nome per esteso: ripeterlo accanto
              sarebbe una doppia intestazione. */}
          <span className="logo-plate h-11 md:h-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.logo.src}
              alt={site.logo.alt}
              width={site.logo.width}
              height={site.logo.height}
              className="h-full w-auto"
            />
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navigazione principale">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-[var(--bg-sunken)] text-[var(--ink)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <Link
            href="/area-soci"
            className="hidden rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 sm:inline-block"
          >
            {loggedIn ? 'Area soci' : 'Accedi'}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label="Apri il menu"
            className="grid h-10 w-10 place-items-center rounded-full border lg:hidden"
          >
            <span aria-hidden>{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t bg-[var(--bg-elevated)] lg:hidden"
      >
        <nav className="wrap flex flex-col py-3" aria-label="Navigazione mobile">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b py-3 text-[0.95rem] font-medium last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/area-soci"
            className="mt-3 rounded-full bg-[var(--brand)] px-5 py-3 text-center text-sm font-semibold text-[var(--brand-ink)]"
          >
            {loggedIn ? 'Vai all’area soci' : 'Accedi all’area soci'}
          </Link>
          <a href={`mailto:${site.email}`} className="py-3 text-sm text-[var(--ink-muted)]">
            {site.email}
          </a>
        </nav>
      </div>
    </header>
  );
}
