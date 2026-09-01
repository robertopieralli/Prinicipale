import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { services } from '@/content/site';

export const metadata: Metadata = {
  title: 'Servizi agli iscritti',
  description:
    'Consulenza legale, fiscale, patrimoniale, assicurativa e sindacale: i servizi inclusi nella quota associativa SNAMI Bologna.',
};

export default function ServiziPage() {
  return (
    <>
      <PageHeader
        eyebrow="Incluso nella quota"
        title="Servizi agli iscritti"
        lead="Supporto e consulenze dedicate ai medici: fiscali, patrimoniali, assicurative, legali. Professionisti che conoscono la sanità convenzionata, senza costi aggiuntivi per gli iscritti."
      />

      <div className="wrap grid gap-4 py-16 md:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/servizi/${service.slug}`}
            className="card-hover surface flex flex-col p-8"
          >
            <h2 className="text-xl font-semibold tracking-tight">{service.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
              {service.summary}
            </p>
            <span className="mt-6 text-sm font-semibold text-[var(--accent)]">
              Come funziona <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
