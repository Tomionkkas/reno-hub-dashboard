import ReactMarkdown, { type Components } from 'react-markdown';
import type { ReactNode } from 'react';
import type { BlogPost } from '@/lib/blog';

interface BlogArticleProps {
  post: BlogPost;
  headingSlugs?: string[];
}

let headingIndex = 0;

function makeComponents(headingSlugs: string[]): Components {
  headingIndex = 0;
  return {
    h2: ({ children }: { children?: ReactNode }) => {
      const id = headingSlugs[headingIndex++] ?? undefined;
      return (
        <h2
          id={id}
          className="text-white font-bold mb-4 leading-tight scroll-mt-24"
          style={{ fontSize: 28, letterSpacing: '-0.02em', marginTop: 48 }}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children?: ReactNode }) => (
      <h3
        className="text-white font-semibold mb-3 leading-snug scroll-mt-24"
        style={{ fontSize: 20, letterSpacing: '-0.01em', marginTop: 32 }}
      >
        {children}
      </h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mb-5 leading-[1.7]" style={{ fontSize: 17, color: '#D8DBE2' }}>
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote
        className="my-12 italic"
        style={{
          fontSize: 24, lineHeight: 1.4, fontWeight: 400, color: '#fff',
          letterSpacing: '-0.01em',
          borderLeft: '2px solid #00D4FF',
          paddingLeft: 40, paddingTop: 8, paddingBottom: 8,
          margin: '48px 0',
        }}
      >
        {children}
      </blockquote>
    ),
    pre: ({ children }: { children?: ReactNode }) => (
      <pre
        className="rounded-xl p-5 overflow-x-auto my-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {children}
      </pre>
    ),
    code: ({ children, className }: { children?: ReactNode; className?: string }) => {
      const isBlock = className?.startsWith('language-');
      if (isBlock) {
        return <code className="text-[#00D4FF] font-mono text-sm">{children}</code>;
      }
      return (
        <code
          className="font-mono text-sm px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#00D4FF' }}
        >
          {children}
        </code>
      );
    },
    a: ({ children, href }: { children?: ReactNode; href?: string }) => (
      <a
        href={href}
        className="hover:underline transition-colors"
        style={{ color: '#00D4FF' }}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="list-none pl-0 mb-5 space-y-2.5" style={{ color: '#D8DBE2' }}>
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal list-outside pl-5 mb-5 space-y-2.5" style={{ color: '#D8DBE2' }}>
        {children}
      </ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="flex items-start gap-3 leading-relaxed" style={{ fontSize: 16 }}>
        <span
          className="mt-[0.45em] w-1 h-1 rounded-full flex-shrink-0"
          style={{ background: '#00D4FF' }}
        />
        <span>{children}</span>
      </li>
    ),
    hr: () => <hr className="my-10 border-0 border-t border-white/[0.08]" />,
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold" style={{ color: '#fff' }}>{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic" style={{ color: '#E5E7EB' }}>{children}</em>
    ),
    table: ({ children }: { children?: ReactNode }) => (
      <div className="overflow-x-auto my-6">
        <table
          className="w-full text-[14px]"
          style={{ borderCollapse: 'collapse', fontFamily: 'ui-monospace, monospace' }}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th
        className="text-left py-2 px-4 text-[#6B7280] font-medium"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td
        className="py-3 px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#D8DBE2' }}
      >
        {children}
      </td>
    ),
  };
}

export default function BlogArticle({ post, headingSlugs = [] }: BlogArticleProps) {
  const components = makeComponents(headingSlugs);

  return (
    <article style={{ fontSize: 17, lineHeight: 1.7, color: '#D8DBE2' }}>
      {post.description && (
        <p
          className="mb-8 leading-[1.55]"
          style={{ fontSize: 20, color: '#E5E7EB' }}
        >
          {post.description}
        </p>
      )}
      <ReactMarkdown components={components}>
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
