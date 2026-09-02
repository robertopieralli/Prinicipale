import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { getCurrentMember } from '@/lib/wix/member';
import { getReservedDocuments } from '@/lib/wix/documents';
import { isWixConfigured } from '@/lib/wix/client';
import { services, site } from '@/content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Area soci',
  description: 'Archivio documenti riservato agli iscritti SNAMI Bologna.',
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  configurazione:
    "L'accesso non è ancora collegato: manca la configurazione descritta nel README.",
  login: 'Non è stato possibile avviare il login. Riprova tra qualche istante.',
};

export default async function AreaSociPage({
  searchParams,
}: {
  searchParams: Promise<{ errore?: string }>;
}) {
  const { errore } = await searchParams;
  const member = await getCurrentMember();

  if (!member) {
    return (
      <>
        <PageHeader
          eyebrow="Riservato agli iscritti"
          title="Area soci"
          lead="Circolari, accordi integrativi, verbali e modulistica: l'archivio documentale della sezione provinciale, accessibile ai soli iscritti in regola con la quota."
        />

        <div className="wrap grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface p-8 md:p-10">
            <h2 className="text-xl font-semibold tracking-tight">Accedi</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              Usa le credenziali che hai ricevuto al momento dell&apos;iscrizione. Se è la prima
              volta, puoi registrarti con l&apos;indirizzo email comunicato alla segreteria.
            </p>

            {errore ? (
              <p className="mt-6 rounded-xl border border-[var(--accent)] px-4 py-3 text-sm text-[var(--accent)]">
                {ERRORS[errore] ?? 'Si è verificato un problema. Riprova.'}
              </p>
            ) : null}

            <a
              href="/api/auth/login"
              className="mt-8 inline-block rounded-full bg-[var(--brand)] px-7 py-3.5 font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
            >
              Accedi all&apos;area riservata
            </a>

            {!isWixConfigured() ? (
              <p className="mt-6 text-xs leading-relaxed text-[var(--ink-faint)]">
                Nota per chi installa il sito: l&apos;accesso richiede il client ID dell&apos;app
                headless Wix. Vedi README, sezione «Collegare Wix».
              </p>
            ) : null}

            <p className="mt-8 border-t pt-6 text-sm text-[var(--ink-muted)]">
              Non sei ancora iscritto?{' '}
              <Link href="/iscriviti" className="font-semibold text-[var(--accent)]">
                Scopri come aderire
              </Link>
            </p>
          </div>

          <div>
            <h2 className="display text-2xl">Cosa trovi nell&apos;archivio</h2>
            <ul className="mt-7 space-y-4">
              {[
                {
                  title: 'Accordi e normativa',
                  body: 'ACN, accordi integrativi regionali e aziendali, delibere e circolari AUSL, sempre nella versione vigente.',
                },
                {
                  title: 'Verbali e comunicazioni interne',
                  body: 'Verbali dei tavoli aziendali e regionali, comunicazioni della segreteria e documenti dei direttivi di settore.',
                },
                {
                  title: 'Modulistica',
                  body: 'Moduli di adesione, deleghe per la trattenuta della quota e modelli per le domande di incarico.',
                },
                {
                  title: 'Consulenze',
                  body: `I riferimenti diretti dei professionisti convenzionati per le ${services.length} consulenze incluse nella quota.`,
                },
              ].map((item) => (
                <li key={item.title} className="surface p-6">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }

  const { documents, error } = await getReservedDocuments();
  const recent = documents.slice(0, 4);
  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="wrap relative flex flex-wrap items-end justify-between gap-6 py-14 md:py-20">
          <div>
            <p className="eyebrow">Area riservata</p>
            <h1 className="display mt-4 text-4xl md:text-5xl">Ciao {member.firstName || 'collega'}</h1>
            <p className="mt-4 text-[var(--ink-muted)]">{member.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand)] font-bold text-[var(--brand-ink)]"
            >
              {member.initials}
            </span>
            <a
              href="/api/auth/logout"
              className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--line-strong)]"
            >
              Esci
            </a>
          </div>
        </div>
      </section>

      <div className="wrap py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface p-6">
            <p className="display text-4xl">{documents.length}</p>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)]">documenti disponibili</p>
          </div>
          <div className="surface p-6">
            <p className="display text-4xl">{categories.length}</p>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)]">categorie in archivio</p>
          </div>
          <div className="surface p-6">
            <p className="display text-4xl">{services.length}</p>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)]">consulenze incluse</p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-2xl md:text-3xl">Ultimi documenti</h2>
          <Link href="/area-soci/documenti" className="text-sm font-semibold text-[var(--accent)]">
            Apri l&apos;archivio completo →
          </Link>
        </div>

        {error === 'unavailable' ? (
          <p className="surface mt-8 p-8 text-sm leading-relaxed text-[var(--ink-muted)]">
            L&apos;archivio non è ancora collegato. Chi amministra il sito trova in{' '}
            <code>README.md</code> la procedura per creare la collection dei documenti riservati.
          </p>
        ) : recent.length ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {recent.map((doc) => (
              <li key={doc.id} className="surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  {doc.category}
                </p>
                <h3 className="mt-2.5 text-base font-semibold">{doc.title}</h3>
                {doc.description ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {doc.description}
                  </p>
                ) : null}
                {doc.fileUrl ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]"
                  >
                    Scarica →
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="surface mt-8 p-8 text-sm text-[var(--ink-muted)]">
            Non ci sono ancora documenti in archivio.
          </p>
        )}

        <div className="surface mt-14 flex flex-wrap items-center justify-between gap-6 p-8">
          <div>
            <h2 className="text-lg font-semibold">Ti serve una consulenza?</h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--ink-muted)]">
              Scrivi a{' '}
              <a href={`mailto:${site.email}`} className="font-medium text-[var(--accent)]">
                {site.email}
              </a>{' '}
              indicando il settore: la segreteria ti mette in contatto con il professionista giusto.
            </p>
          </div>
          <Link
            href="/servizi"
            className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:border-[var(--line-strong)]"
          >
            Vedi i servizi
          </Link>
        </div>
      </div>
    </>
  );
}
