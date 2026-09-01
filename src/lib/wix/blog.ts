import { unstable_cache } from 'next/cache';
import { getPublicWixClient, isWixConfigured } from './client';
import { wixImage } from './media';
import { groupCategories } from './categories';
import type { BlogCategory } from './categories';

export type PostCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  minutesToRead: number;
  categoryIds: string[];
  cover: string | null;
  pinned: boolean;
};

export type { BlogCategory } from './categories';

function toCard(post: Record<string, any>): PostCard {
  const image = post?.media?.wixMedia?.image;
  return {
    id: post._id ?? post.id ?? '',
    title: (post.title ?? '').trim(),
    slug: post.slug ?? '',
    excerpt: (post.excerpt ?? '').trim(),
    publishedAt: post.firstPublishedDate ?? null,
    minutesToRead: post.minutesToRead ?? 1,
    categoryIds: post.categoryIds ?? [],
    cover: wixImage(image?.url ?? image?.id ?? null),
    pinned: Boolean(post.pinned),
  };
}

async function fetchCategories(): Promise<BlogCategory[]> {
  if (!isWixConfigured()) return [];
  try {
    const client = getPublicWixClient();
    const res = await client.categories.listCategories({ paging: { limit: 100 } });
    return groupCategories(res.categories ?? []).filter((c) => c.postCount > 0);
  } catch (error) {
    console.error('[snami] lettura categorie non riuscita:', error);
    return [];
  }
}

async function fetchPosts(options: {
  limit?: number;
  offset?: number;
  categoryIds?: string[];
} = {}): Promise<{ posts: PostCard[]; total: number }> {
  if (!isWixConfigured()) return { posts: [], total: 0 };
  const { limit = 12, offset = 0, categoryIds } = options;
  try {
    const client = getPublicWixClient();
    const res = await client.posts.listPosts({
      paging: { limit, offset },
      ...(categoryIds?.length ? { categoryIds } : {}),
      fieldsets: ['URL'],
    });
    return {
      posts: (res.posts ?? []).map((p) => toCard(p as Record<string, any>)),
      total: res.metaData?.total ?? res.posts?.length ?? 0,
    };
  } catch (error) {
    console.error('[snami] lettura post non riuscita:', error);
    return { posts: [], total: 0 };
  }
}

async function fetchPost(slug: string) {
  if (!isWixConfigured()) return null;
  try {
    const client = getPublicWixClient();
    const res = await client.posts.getPostBySlug(slug, {
      fieldsets: ['URL', 'RICH_CONTENT', 'SEO', 'CONTENT_TEXT'],
    });
    const post = res.post as Record<string, any> | undefined;
    if (!post) return null;
    return {
      ...toCard(post),
      richContent: post.richContent ?? null,
      contentText: post.contentText ?? '',
      seoTitle: post.seoData?.tags?.find((t: any) => t.type === 'title')?.children ?? null,
    };
  } catch (error) {
    console.error(`[snami] lettura post "${slug}" non riuscita:`, error);
    return null;
  }
}

/**
 * L'intestazione del sito legge la sessione del socio, quindi ogni pagina è
 * renderizzata su richiesta. Senza una cache esplicita ogni visita si
 * tradurrebbe in altrettante chiamate a Wix: qui i contenuti pubblici vengono
 * memorizzati per dieci minuti, il tempo entro cui un comunicato appena
 * pubblicato compare comunque online.
 */
const CACHE_SECONDS = 600;

export const getCategories = unstable_cache(fetchCategories, ['snami-categorie'], {
  revalidate: CACHE_SECONDS,
  tags: ['blog'],
});

export const getPosts = unstable_cache(fetchPosts, ['snami-post'], {
  revalidate: CACHE_SECONDS,
  tags: ['blog'],
});

export const getPost = unstable_cache(fetchPost, ['snami-post-singolo'], {
  revalidate: CACHE_SECONDS,
  tags: ['blog'],
});
