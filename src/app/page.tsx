import Link from 'next/link';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';
import { getPosts } from '@/lib/wix/blog';
import { getPlans, formatAmount, periodLabel } from '@/lib/wix/plans';
import { sectors, services, site, stats } from '@/content/site';

export const revalidate = 600;

export default async function HomePage() {
  const [{ posts }, plans] = await Promise.all([getPosts({ limit: 7 }), getPlans()]);
  const [lead, ...rest] = posts;
  const highlighted = plans.find((p) => p.slug === 'medici-convenzionati-ssn') ?? plans[0];

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div className="wrap relative grid gap-14 py-20 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="rise">
            <hr className="rule-brand mb-8" />
            <p className="eyebrow">{site.extendedName}</p>
            <h1 className="display mt-5 text-[clamp(2.6rem,6vw,4.6rem)]">
              La voce dei medici
              <br />
              autonomi a Bologna.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
              Rappresentanza, tutela e assistenza per i medici convenzionati e dipendenti della
              provincia. Un sindacato autonomo, senza appartenenze politiche, che siede ai tavoli e
              dice le cose come stanno.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/iscriviti"
                className="rounded-full bg-[var(--brand)] px-7 py-3.5 font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
              >
                Iscriviti allo SNAMI
              </Link>
              <Link
                href="/notizie"
                className="rounded-full border px-7 py-3.5 font-semibold transition hover:border-[var(--line-strong)]"
              >
                Leggi le notizie
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="display text-3xl text-[var(--accent)]">{stat.value}</dt>
                  <dd className="mt-1.5 text-xs leading-snug text-[var(--ink-faint)]">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {lead ? (
            <div className="rise" style={{ animationDelay: '120ms' }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                In primo piano
              </p>
              <PostCard post={lead} />
            </div>
          ) : null}
        </div>
      </section>

      {/* --------------------------------------------------------- scorrimento */}
      {posts.length > 2 ? (
        <div className="marquee overflow-hidden border-y bg-[var(--bg-elevated)] py-4">
          <div className="marquee-track">
            {[...posts, ...posts].map((post, i) => (
              <Link
                key={`${post.id}-${i}`}
                href={`/notizie/${post.slug}`}
                className="whitespace-nowrap text-sm text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
              >
                <span className="mr-3 font-bold text-[var(--accent)]">·</span>
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------------- notizie */}
      <section className="wrap py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Aggiornamenti</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">Dal territorio</h2>
          </div>
          <Link href="/notizie" className="text-sm font-semibold text-[var(--accent)]">
            Tutte le notizie →
          </Link>
        </div>

        {rest.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              title="Nessuna notizia da mostrare"
              message="Il collegamento con l'archivio non è ancora attivo. Vedi il README, sezione «Collegare Wix», per completare la configurazione."
            />
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- settori */}
      <section className="border-y bg-[var(--bg-elevated)] py-20 md:py-28">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow">Rappresentanza</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">Un sindacato polisettoriale</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
              Dalla medicina generale all&apos;emergenza territoriale, dalla pediatria di libera
              scelta alla medicina penitenziaria: ogni settore ha i suoi delegati e i suoi tavoli.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector) => (
              <Link
                key={sector.slug}
                href={`/settori/${sector.slug}`}
                className="card-hover surface group flex flex-col p-6"
              >
                <h3 className="text-base font-semibold tracking-tight">{sector.name}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {sector.short}
                </p>
                <span className="mt-5 text-sm font-semibold text-[var(--accent)]">
                  Approfondisci <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- servizi */}
      <section className="wrap py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Incluso nella quota</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">Sei consulenze, un solo interlocutore</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
              Fiscale, patrimoniale, assicurativa, legale: professionisti selezionati che conoscono
              la sanità convenzionata e rispondono agli iscritti senza costi aggiuntivi.
            </p>
            <Link
              href="/servizi"
              className="mt-8 inline-block rounded-full border px-6 py-3 text-sm font-semibold transition hover:border-[var(--line-strong)]"
            >
              Vedi tutti i servizi
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/servizi/${service.slug}`}
                className="card-hover surface p-6"
              >
                <h3 className="text-base font-semibold tracking-tight">{service.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {service.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ adesione */}
      <section className="border-t bg-[var(--bg-elevated)] py-20 md:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Adesione</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">
              Iscriversi costa poco.
              <br />
              Non farlo costa di più.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--ink-muted)]">
              Per i medici convenzionati la quota è trattenuta direttamente dall&apos;AUSL, per i
              dipendenti dallo stipendio: nessun adempimento, nessun rinnovo da ricordare.
            </p>
            <Link
              href="/iscriviti"
              className="mt-8 inline-block rounded-full bg-[var(--brand)] px-7 py-3.5 font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
            >
              Vedi le quote
            </Link>
          </div>

          {highlighted ? (
            <div className="surface p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                {highlighted.name}
              </p>
              <p className="display mt-4 text-5xl">
                {formatAmount(highlighted)}
                {highlighted.amount > 0 ? (
                  <span className="ml-2 text-base font-normal text-[var(--ink-faint)]">
                    {periodLabel(highlighted)}
                  </span>
                ) : null}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--ink-muted)]">
                {highlighted.description}
              </p>
              <ul className="mt-7 space-y-2.5 text-sm text-[var(--ink-muted)]">
                {services.slice(0, 4).map((service) => (
                  <li key={service.slug} className="flex gap-2.5">
                    <span aria-hidden className="text-[var(--secondary)]">✓</span>
                    {service.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
