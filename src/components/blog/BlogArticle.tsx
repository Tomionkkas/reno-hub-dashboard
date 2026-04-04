import ReactMarkdown from 'react-markdown';
import type { BlogPost } from '@/lib/blog';

interface BlogArticleProps {
  post: BlogPost;
}

const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-extrabold text-[#f5f5f7] mb-3 leading-tight mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-bold text-[#f5f5f7] mt-10 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-[#e0e0e8] mt-7 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[#a0a0a8] leading-[1.75] mb-5 text-[0.97rem]">
      {children}
    </p>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-[3px] border-[#7F67FF] bg-[rgba(127,103,255,0.06)] pl-5 pr-4 py-3 rounded-r-lg my-6 italic text-[#c0b8ff] text-[0.93rem] leading-relaxed">
      {children}
    </blockquote>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 overflow-x-auto my-5">
      {children}
    </pre>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isBlock = !!className;
    if (isBlock) {
      return (
        <code className="text-[#00D4FF] font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-[rgba(255,255,255,0.06)] text-[#00D4FF] font-mono text-sm px-1.5 py-0.5 rounded">
        {children}
      </code>
    );
  },
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      href={href}
      className="text-[#7F67FF] hover:underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-[#a0a0a8] list-disc list-inside mb-5 space-y-1.5">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-[#a0a0a8] list-decimal list-inside mb-5 space-y-1.5">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  hr: () => <hr className="border-[rgba(255,255,255,0.08)] my-10" />,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-[#e0e0e8] font-semibold">{children}</strong>
  ),
};

export default function BlogArticle({ post }: BlogArticleProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="w-full">
      {/* Post header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-[rgba(127,103,255,0.15)] text-[#7F67FF]"
            >
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-extrabold text-[#f5f5f7] leading-tight mb-3">
          {post.title}
        </h1>
        <p className="text-sm text-[#636366]">{formattedDate}</p>
        <div className="mt-5 h-px bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Article body */}
      <ReactMarkdown components={components as any}>
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
