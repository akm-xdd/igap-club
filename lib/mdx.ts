import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  content: string;
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];
  
  const files = fs.readdirSync(contentDir);
  
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '');
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        content,
      };
    });
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    slug,
    title: data.title,
    description: data.description,
    content,
  };
}