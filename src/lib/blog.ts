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

// Browser-safe frontmatter parser — replaces gray-matter which requires Node.js Buffer.
// Handles string fields and YAML list fields (keywords: \n  - item).
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, frontmatter, body] = match;
  const data: Record<string, unknown> = {};
  let currentArrayKey = '';
  let arrayItems: string[] = [];

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trimEnd();
    // Array item:  - "value" or  - value
    if (/^\s+-\s+/.test(trimmed) && currentArrayKey) {
      arrayItems.push(trimmed.replace(/^\s+-\s+/, '').replace(/^"|"$/g, '').trim());
      continue;
    }
    // Flush pending array
    if (currentArrayKey && arrayItems.length > 0) {
      data[currentArrayKey] = arrayItems;
      currentArrayKey = '';
      arrayItems = [];
    }
    // Key with no value (array start):  keywords:
    const arrayStart = trimmed.match(/^(\w+):\s*$/);
    if (arrayStart) {
      currentArrayKey = arrayStart[1];
      continue;
    }
    // Key: "value" or key: value
    const kv = trimmed.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) {
      data[kv[1]] = kv[2];
    }
  }
  // Flush trailing array
  if (currentArrayKey && arrayItems.length > 0) {
    data[currentArrayKey] = arrayItems;
  }

  return { data, content: body.trim() };
}

function parsePost(path: string, raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  const slug = (data.slug as string) || path.split('/').pop()?.replace('.mdx', '') || '';
  return {
    slug,
    title: (data.title as string) || '',
    date: (data.date as string) || '',
    description: (data.description as string) || '',
    tags: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
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
