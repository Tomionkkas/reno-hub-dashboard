import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

// Raw string import — no MDX compilation needed.
// Vite picks up all .mdx files in src/content/blog/ at build time.
const rawFiles = import.meta.glob<string>('../content/blog/*.mdx', {
  query: '?raw',
  eager: true,
  import: 'default',
});

function parsePost(path: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const slug = data.slug || path.split('/').pop()?.replace('.mdx', '') || '';
  return {
    slug,
    title: data.title || '',
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date || ''),
    description: data.description || '',
    tags: Array.isArray(data.keywords) ? data.keywords : [],  // frontmatter key is 'keywords'
    content,
  };
}

let _cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (_cache) return _cache;
  _cache = Object.entries(rawFiles)
    .map(([path, raw]) => parsePost(path, raw))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return _cache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getLatestPost(): BlogPost | undefined {
  return getAllPosts()[0];
}
