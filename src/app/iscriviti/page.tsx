import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { getPlans, formatAmount, periodLabel } from '@/lib/wix/plans';
import { services, site } from '@/content/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Iscriviti',
  description:
    'Quote associative SNAMI Bologna per medici convenzionati, dipendenti, liberi professionisti e pensionati.',
};

export default async function IscrivitiPage() {
  const plans = await getPlans();

  return (
    <>
      <PageHeader
        eyebrow="Adesione"
        title="Iscriviti allo SNAMI"
        lead="Quattro profili, una sola tutela. Per i convenzionati e i dipendenti la quota è trattenuta alla fonte: nessun bollettino, nessun rinnovo da ricordare."
      />

      <div className="wrap py-16">
        {plans.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.id} className="surface flex flex-col p-8">
                <h2 className="text-lg font-semibold tracking-tight">{plan.name}</h2>
                <p className="display mt-5 text-4xl">
                  {formatAmount(plan)}
                  {plan.amount > 0 ? (
                    <span className="ml-1.5 text-sm font-normal text-[var(--ink-faint)]">
                      {periodLabel(plan)}
                    </span>
                  ) : null}
                </p>
                {plan.description ? (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {plan.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                {plan.withheld ? (
                  <p className="mt-5 rounded-lg bg-[var(--bg-sunken)] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                    Nessun pagamento online: la quota è trattenuta alla fonte.
                  </p>
                ) : null}
                <Link
                  href="/contatti"
                  className="mt-7 rounded-full bg-[var(--brand)] px-5 py-3 text-center text-sm font-semibold text-[var(--brand-ink)]"
                >
                  Richiedi l&apos;adesione
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Quote non disponibili al momento"
            message="Il collegamento con l'anagrafica dei piani non è ancora attivo. Nel frattempo puoi scrivere alla segreteria per conoscere la quota del tuo profilo."
            actionHref="/contatti"
            actionLabel="Scrivi alla segreteria"
          />
        )}

        <section className="mt-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="display text-3xl">Cosa comprende la quota</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
              L&apos;iscrizione dà accesso a tutte le consulenze, all&apos;archivio riservato dei
              documenti e all&apos;assistenza diretta dei delegati di settore.
            </p>
            <Link
              href="/area-soci"
              className="mt-8 inline-block rounded-full border px-6 py-3 text-sm font-semibold transition hover:border-[var(--line-strong)]"
            >
              Scopri l&apos;area soci
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug} className="surface p-5">
                <p className="text-sm font-semibold">{service.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                  {service.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="surface mt-16 p-8">
          <h2 className="text-lg font-semibold">Domande sull&apos;iscrizione?</h2>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            La segreteria della sezione provinciale risponde su modulistica, deleghe per la
            trattenuta e passaggi di settore. Scrivi a{' '}
            <a href={`mailto:${site.email}`} className="font-medium text-[var(--accent)]">
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
