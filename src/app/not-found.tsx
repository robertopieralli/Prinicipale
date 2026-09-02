import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">Errore 404</p>
        <h1 className="display mt-4 text-4xl md:text-5xl">Pagina non trovata</h1>
        <p className="mx-auto mt-5 max-w-md text-[var(--ink-muted)]">
          Il contenuto che cercavi è stato spostato o non esiste più. Dall&apos;archivio delle
          notizie trovi tutti i comunicati pubblicati.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)]"
          >
            Torna alla home
          </Link>
          <Link href="/notizie" className="rounded-full border px-6 py-3 text-sm font-semibold">
            Vai alle notizie
          </Link>
        </div>
      </div>
    </div>
  );
}
