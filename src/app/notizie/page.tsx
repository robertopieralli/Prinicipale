import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';
import { getCategories, getPosts } from '@/lib/wix/blog';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Notizie',
  description:
    'Comunicati, graduatorie, zone carenti e aggiornamenti sindacali per i medici della provincia di Bologna.',
};

const PER_PAGE = 12;

export default async function NotiziePage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; categoria?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.pagina ?? '1') || 1);
  const categories = await getCategories();
  const active = categories.find((c) => c.slug === params.categoria) ?? null;

  const { posts, total } = await getPosts({
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    categoryIds: active?.ids,
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const query = (p: number) =>
    `/notizie?${new URLSearchParams({
      ...(active ? { categoria: active.slug } : {}),
      ...(p > 1 ? { pagina: String(p) } : {}),
    }).toString()}`;

  return (
    <>
      <PageHeader
        eyebrow="Aggiornamenti"
        title={active ? active.label : 'Notizie'}
        lead={
          active?.description ??
          'Comunicati stampa, graduatorie regionali, zone carenti e prese di posizione della sezione provinciale.'
        }
      />

      <div className="wrap py-14">
        {categories.length ? (
          <nav aria-label="Filtra per settore" className="flex flex-wrap gap-2">
            <Link
              href="/notizie"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active ? 'text-[var(--ink-muted)] hover:border-[var(--line-strong)]' : 'border-transparent bg-[var(--brand)] text-[var(--brand-ink)]'
              }`}
            >
              Tutte
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/notizie?categoria=${cat.slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active?.slug === cat.slug
                    ? 'border-transparent bg-[var(--brand)] text-[var(--brand-ink)]'
                    : 'text-[var(--ink-muted)] hover:border-[var(--line-strong)]'
                }`}
              >
                {cat.label}
                <span className="ml-2 text-xs opacity-60">{cat.postCount}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        {posts.length ? (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Paginazione"
                className="mt-14 flex items-center justify-center gap-3 text-sm"
              >
                {page > 1 ? (
                  <Link href={query(page - 1)} className="rounded-full border px-5 py-2.5 font-medium">
                    ← Precedente
                  </Link>
                ) : null}
                <span className="text-[var(--ink-faint)]">
                  Pagina {page} di {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={query(page + 1)} className="rounded-full border px-5 py-2.5 font-medium">
                    Successiva →
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="mt-12">
            <EmptyState
              title="Nessun articolo disponibile"
              message="Non ci sono contenuti da mostrare per questa selezione. Se il sito è appena stato installato, completa il collegamento con Wix descritto nel README."
              actionHref="/notizie"
              actionLabel="Torna a tutte le notizie"
            />
          </div>
        )}
      </div>
    </>
  );
}
