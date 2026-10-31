import type { Metadata } from 'next';

/**
 * Canonical site URL. Override with NEXT_PUBLIC_SITE_URL in the deploy
 * environment (no trailing slash).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://devbench.club';

export const SITE_NAME = 'DevBench.club';

export const SITE_DESCRIPTION =
  'Practical developer utilities, technical articles, and follow-along engineering guides. No paywalls, no ads, no BS.';

interface PageMetaInput {
  title: string;
  description?: string;
  /** Path beginning with "/", used for the canonical URL. */
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

/**
 * Build per-page Metadata with consistent canonical URLs and Open Graph /
 * Twitter tags. The title template in the root layout appends the site name.
 */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  type = 'website',
  publishedTime,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
