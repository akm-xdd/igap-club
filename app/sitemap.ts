import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { toolsRegistry } from '@/lib/tools/registry';
import { getBlogPosts } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    '',
    '/tools',
    '/blog',
    '/about',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const toolRoutes = toolsRegistry.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: now,
  }));

  const blogRoutes = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
