import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RichContent from '@/components/RichContent';
import PostCard, { formatDate } from '@/components/PostCard';
import { getCategories, getPost, getPosts } from '@/lib/wix/blog';

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Articolo non trovato' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [categories, { posts: related }] = await Promise.all([
    getCategories(),
    getPosts({ limit: 4, categoryIds: post.categoryIds.length ? post.categoryIds : undefined }),
  ]);

  const postCategories = categories.filter((cat) =>
    cat.ids.some((id) => post.categoryIds.includes(id)),
  );

  return (
    <article>
      <header className="relative overflow-hidden border-b">
        <div className="wrap relative py-16 md:py-24">
          <Link href="/notizie" className="text-sm font-semibold text-[var(--accent)]">
            ← Tutte le notizie
          </Link>

          <h1 className="display mt-6 max-w-4xl text-[clamp(2rem,4.5vw,3.4rem)]">{post.title}</h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--ink-faint)]">
            <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{post.minutesToRead} min di lettura</span>
            {postCategories.length ? (
              <>
                <span aria-hidden>·</span>
                <span className="flex flex-wrap gap-2">
                  {postCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/notizie?categoria=${cat.slug}`}
                      className="rounded-full border px-3 py-1 text-xs font-medium text-[var(--ink-muted)]"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {post.cover ? (
        <div className="wrap -mt-2 pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            className="max-h-[32rem] w-full rounded-2xl border object-cover"
          />
        </div>
      ) : null}

      <div className="wrap py-14 md:py-20">
        <RichContent content={post.richContent} fallback={post.contentText} />
      </div>

      {related.filter((p) => p.slug !== post.slug).length ? (
        <section className="border-t bg-[var(--bg-elevated)] py-16">
          <div className="wrap">
            <h2 className="display text-2xl">Continua a leggere</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related
                .filter((p) => p.slug !== post.slug)
                .slice(0, 3)
                .map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
