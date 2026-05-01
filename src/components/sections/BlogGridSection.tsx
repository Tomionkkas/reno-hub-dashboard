import { Link } from 'react-router-dom';
import { getAllPosts, CATEGORY_IMAGE } from '@/lib/blog';

export default function BlogGridSection() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="px-5 md:px-14 py-24" style={{ background: '#0A0B1E' }}>
      <div className="max-w-[1168px] mx-auto">

        {/* Section label */}
        <div className="flex items-baseline justify-between pb-4 mb-12 border-b border-white/[0.08]">
          <span className="eyebrow" style={{ fontFamily: 'ui-monospace, monospace' }}>
            § 02 — Dziennik
          </span>
          <Link
            to="/blog"
            className="eyebrow transition-colors hover:text-white/60"
            style={{ fontFamily: 'ui-monospace, monospace', color: '#6B7280' }}
          >
            → Wszystkie wpisy
          </Link>
        </div>

        {/* 3-col card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const formattedDate = new Date(post.date).toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'short',
            });
            const readTime = '5 min';
            const category = post.tags?.[0] ?? 'Blog';

            return (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group no-underline">
                <article
                  className="rounded-2xl overflow-hidden border border-white/[0.06] transition-colors duration-200 group-hover:border-white/[0.14]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="w-full overflow-hidden" style={{ aspectRatio: '16/10', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <img
                      src={CATEGORY_IMAGE[post.category] ?? '/blog/categories/budzet.png'}
                      alt={post.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <div
                      className="flex gap-2 mb-3"
                      style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#6B7280' }}
                    >
                      <span>{formattedDate}</span>
                      <span>·</span>
                      <span>{category}</span>
                      <span>·</span>
                      <span>{readTime}</span>
                    </div>
                    <h3
                      className="text-white m-0 transition-colors duration-200 group-hover:text-[#00D4FF]"
                      style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}
                    >
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
