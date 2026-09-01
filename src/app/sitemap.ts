import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/wix/blog';
import { sectors, services } from '@/content/site';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.snami.bologna.it').replace(/\/$/, '');

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, priority: 1 },
    { url: `${siteUrl}/notizie`, lastModified: now, priority: 0.9 },
    { url: `${siteUrl}/settori`, lastModified: now, priority: 0.8 },
    { url: `${siteUrl}/servizi`, lastModified: now, priority: 0.8 },
    { url: `${siteUrl}/iscriviti`, lastModified: now, priority: 0.9 },
    { url: `${siteUrl}/videoteca`, lastModified: now, priority: 0.5 },
    { url: `${siteUrl}/contatti`, lastModified: now, priority: 0.6 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, priority: 0.2 },
  ];

  const sectorPages = sectors.map((sector) => ({
    url: `${siteUrl}/settori/${sector.slug}`,
    lastModified: now,
    priority: 0.6,
  }));

  const servicePages = services.map((service) => ({
    url: `${siteUrl}/servizi/${service.slug}`,
    lastModified: now,
    priority: 0.6,
  }));

  // Fino a 200 post: copre l'intero archivio storico della sezione.
  const { posts } = await getPosts({ limit: 100 });
  const { posts: older } = await getPosts({ limit: 100, offset: 100 });
  const postPages = [...posts, ...older].map((post) => ({
    url: `${siteUrl}/notizie/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    priority: 0.7,
  }));

  return [...staticPages, ...sectorPages, ...servicePages, ...postPages];
}
