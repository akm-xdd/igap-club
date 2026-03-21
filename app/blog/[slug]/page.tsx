import { getBlogPost, getBlogPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.description && (
          <p className="text-xl text-muted-foreground mb-8">{post.description}</p>
        )}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}