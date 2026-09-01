import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { isLoggedIn } from '@/lib/wix/client';
import { site } from '@/content/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.snami.bologna.it';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.claim,
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: site.legalName,
    title: `${site.name} — ${site.tagline}`,
    description: site.claim,
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

/**
 * Il tema viene applicato prima della prima pittura per evitare il lampo
 * bianco su chi ha scelto lo scuro.
 */
const themeScript = `try{var t=localStorage.getItem('snami-theme');if(t){document.documentElement.dataset.theme=t}}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const loggedIn = await isLoggedIn();

  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap"
        />
      </head>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--brand)] focus:px-5 focus:py-3 focus:text-[var(--brand-ink)]"
        >
          Vai al contenuto
        </a>
        <Header loggedIn={loggedIn} />
        <main id="contenuto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
