import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PostCard from '@/components/PostCard';
import { sectors } from '@/content/site';
import { getCategories, getPosts } from '@/lib/wix/blog';

export const revalidate = 600;

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = sectors.find((s) => s.slug === slug);
  if (!sector) return { title: 'Settore non trovato' };
  return { title: sector.name, description: sector.description };
}

export default async function SettorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = sectors.find((s) => s.slug === slug);
  if (!sector) notFound();

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === sector.categorySlug);
  const { posts } = category
    ? await getPosts({ limit: 6, categoryIds: category.ids })
    : { posts: [] };

  return (
    <>
      <PageHeader eyebrow="Settore associativo" title={sector.name} lead={sector.description} />

      <div className="wrap py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-2xl md:text-3xl">Ultime dal settore</h2>
          {category ? (
            <Link
              href={`/notizie?categoria=${category.slug}`}
              className="text-sm font-semibold text-[var(--accent)]"
            >
              Archivio completo →
            </Link>
          ) : null}
        </div>

        {posts.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-[var(--ink-muted)]">
            Non ci sono ancora notizie pubblicate per questo settore.
          </p>
        )}

        <div className="surface mt-16 flex flex-wrap items-center justify-between gap-6 p-8">
          <div>
            <h2 className="text-lg font-semibold">Hai una questione aperta su questo settore?</h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--ink-muted)]">
              I delegati della sezione provinciale seguono direttamente i tavoli aziendali e
              regionali. Scrivici: la segreteria smista alla persona giusta.
            </p>
          </div>
          <Link
            href="/contatti"
            className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)]"
          >
            Contatta la sezione
          </Link>
        </div>
      </div>
    </>
  );
}
