import Link from 'next/link';
import type { PostCard as Post } from '@/lib/wix/blog';

export function formatDate(value: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article
      className={`card-hover surface group overflow-hidden ${featured ? 'md:grid md:grid-cols-2' : ''}`}
    >
      <Link href={`/notizie/${post.slug}`} className="block">
        {post.cover ? (
          <div className={`overflow-hidden bg-[var(--bg-sunken)] ${featured ? 'h-full min-h-64' : 'aspect-[16/9]'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className={`relative bg-[var(--bg-sunken)] ${featured ? 'h-full min-h-64' : 'aspect-[16/9]'}`} />
        )}
      </Link>

      <div className={`flex flex-col p-6 ${featured ? 'justify-center md:p-9' : ''}`}>
        <div className="flex items-center gap-3 text-xs text-[var(--ink-muted)]">
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.minutesToRead} min di lettura</span>
        </div>

        <h3 className={`mt-3 font-semibold leading-snug tracking-tight ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          <Link href={`/notizie/${post.slug}`} className="transition hover:text-[var(--accent)]">
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className={`mt-3 text-sm leading-relaxed text-[var(--ink-muted)] ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {post.excerpt}
          </p>
        ) : null}

        <Link
          href={`/notizie/${post.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]"
        >
          Leggi <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
