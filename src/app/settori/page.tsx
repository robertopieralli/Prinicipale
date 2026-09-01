import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { sectors } from '@/content/site';

export const metadata: Metadata = {
  title: 'Settori associativi',
  description:
    'Assistenza primaria, continuità assistenziale, emergenza territoriale, pediatria, specialistica ambulatoriale e gli altri settori rappresentati dallo SNAMI Bologna.',
};

export default function SettoriPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rappresentanza"
        title="Settori associativi"
        lead="Lo SNAMI è un sindacato polisettoriale: ogni area della professione ha delegati propri, tavoli propri e vertenze proprie. Qui trovi il perimetro di ciascuna."
      />

      <div className="wrap grid gap-4 py-16 md:grid-cols-2">
        {sectors.map((sector) => (
          <Link
            key={sector.slug}
            href={`/settori/${sector.slug}`}
            className="card-hover surface flex flex-col p-8"
          >
            <h2 className="text-xl font-semibold tracking-tight">{sector.name}</h2>
            <p className="mt-1.5 text-sm font-medium text-[var(--secondary-text)]">{sector.short}</p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
              {sector.description}
            </p>
            <span className="mt-6 text-sm font-semibold text-[var(--accent)]">
              Notizie del settore <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
