import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { services, site } from '@/content/site';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: 'Servizio non trovato' };
  return { title: service.name, description: service.summary };
}

export default async function ServizioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader eyebrow="Servizio agli iscritti" title={service.name} lead={service.summary} />

      <div className="wrap grid gap-14 py-16 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="prose-snami">
            <p>{service.description}</p>
          </div>

          <div className="surface mt-12 p-8">
            <h2 className="text-lg font-semibold">Come richiederlo</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--ink-muted)]">
              <li>
                <strong className="text-[var(--ink)]">1. Verifica l&apos;iscrizione.</strong> Il
                servizio è riservato ai soci in regola con la quota associativa.
              </li>
              <li>
                <strong className="text-[var(--ink)]">2. Scrivi alla segreteria.</strong> Manda una
                mail a{' '}
                <a href={`mailto:${site.email}`} className="text-[var(--accent)]">
                  {site.email}
                </a>{' '}
                indicando il settore di appartenenza e una sintesi del caso.
              </li>
              <li>
                <strong className="text-[var(--ink)]">3. Ti mettiamo in contatto.</strong> La
                segreteria smista la richiesta al professionista competente, che ti risponde
                direttamente.
              </li>
            </ol>
            <Link
              href="/contatti"
              className="mt-8 inline-block rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Richiedi il servizio
            </Link>
          </div>
        </div>

        <aside>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Altri servizi
          </h2>
          <ul className="mt-5 space-y-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/servizi/${other.slug}`}
                  className="card-hover surface block p-5 text-sm font-medium"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
