import { Link } from 'react-router-dom';
import type { BlogPost } from '@/lib/blog';

interface BlogSidebarProps {
  posts: BlogPost[];
  currentSlug: string;
}

export default function BlogSidebar({ posts, currentSlug }: BlogSidebarProps) {
  return (
    <div className="h-full flex flex-col px-4 pt-8 pb-6">
      <p className="text-[0.6rem] uppercase tracking-widest text-[#4a4a52] mb-5">
        Wszystkie posty
      </p>
      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {posts.map((post) => {
          const isActive = post.slug === currentSlug;
          const formattedDate = new Date(post.date).toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={[
                'block px-3 py-2.5 rounded-lg text-left transition-colors duration-150',
                isActive
                  ? 'bg-[rgba(127,103,255,0.12)] border-l-2 border-[#7F67FF]'
                  : 'border-l-2 border-transparent hover:bg-[rgba(255,255,255,0.04)]',
              ].join(' ')}
            >
              <span
                className={[
                  'block text-[0.7rem] font-medium leading-snug mb-0.5',
                  isActive ? 'text-[#f0f0f2]' : 'text-[#8a8a95]',
                ].join(' ')}
              >
                {post.title}
              </span>
              <span className="text-[0.55rem] text-[#4a4a52]">{formattedDate}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
