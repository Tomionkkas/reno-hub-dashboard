import { Link } from 'react-router-dom';
import { getAllPosts } from '@/lib/blog';

export default function LatestPostsStrip() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[#4a4a52] mb-1">
              z bloga
            </p>
            <h2 className="text-2xl font-extrabold text-[#f0f0f2] leading-tight">
              Ostatnie{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #00D4FF, #7F67FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                wpisy
              </span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-xs text-[#5a5a65] border border-[rgba(255,255,255,0.1)] px-3 py-1 rounded-full hover:border-[rgba(255,255,255,0.2)] hover:text-[#8a8a95] transition-colors duration-150"
          >
            Wszystkie →
          </Link>
        </div>

        {/* Row list */}
        <div className="flex flex-col">
          {posts.map((post, index) => {
            const formattedDate = new Date(post.date).toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'short',
            });
            const isFirst = index === 0;

            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between py-4 border-b border-[rgba(255,255,255,0.05)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)] rounded-lg px-2 -mx-2 transition-colors duration-150"
              >
                <div className="flex items-baseline gap-3 flex-1 min-w-0">
                  <div
                    className={[
                      'w-1.5 h-1.5 rounded-full flex-shrink-0 mb-0.5',
                      isFirst ? 'bg-[#7F67FF]' : 'bg-[rgba(255,255,255,0.18)]',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'text-sm truncate group-hover:text-[#f0f0f2] transition-colors duration-150',
                      isFirst ? 'text-[#f0f0f2] font-semibold' : 'text-[#8a8a95]',
                    ].join(' ')}
                  >
                    {post.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {post.tags[0] && (
                    <span className="text-[0.6rem] text-[#4a4a58] hidden sm:block">
                      #{post.tags[0]}
                    </span>
                  )}
                  <span className="text-[0.6rem] text-[#3a3a44]">{formattedDate}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
