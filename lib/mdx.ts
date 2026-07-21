import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content/blog');
const WORDS_PER_MINUTE = 200;

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  content: string;
  readingTime: string;
}

interface RawPost extends BlogPost {
  draft: boolean;
}

function computeReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function readPost(file: string): RawPost {
  const slug = file.replace(/\.mdx$/, '');
  const filePath = path.join(contentDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    content,
    readingTime: computeReadingTime(content),
    draft: Boolean(data.draft),
  };
}

function dateValue(date?: string): number {
  return date ? new Date(date).getTime() : 0;
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.mdx'))
    .map(readPost)
    .filter((post) => !post.draft)
    .sort((a, b) => dateValue(b.date) - dateValue(a.date));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const post = readPost(`${slug}.mdx`);
  return post.draft ? null : post;
}
