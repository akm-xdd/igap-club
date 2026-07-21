import Link from 'next/link';
import { getBlogPost, getBlogPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { mdxComponents } from '@/components/mdx-components';

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(parsed);
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const formattedDate = formatDate(post.date);

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline decoration-2 underline-offset-4"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.description && (
          <p className="text-xl text-muted-foreground mb-4">{post.description}</p>
        )}
        {(formattedDate || post.readingTime) && (
          <p className="text-sm text-muted-foreground mb-8">
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && <span> · </span>}
            <span>{post.readingTime}</span>
          </p>
        )}
        <div className="prose prose-neutral max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </div>
    </article>
  );
}