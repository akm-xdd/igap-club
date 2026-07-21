import Link from 'next/link';
import { getBlogPosts } from '@/lib/mdx';

function formatDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed);
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">
          Battle-tested solutions from production
        </p>

        <div className="space-y-6">
          {posts.map((post) => {
            const formattedDate = formatDate(post.date);
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="border-b pb-6">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-foreground/70 transition-colors">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-muted-foreground mb-2">{post.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formattedDate && <span>{formattedDate}</span>}
                    {formattedDate && <span> · </span>}
                    <span>{post.readingTime}</span>
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}