import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/FooterD';
import { getAllPosts, CATEGORY_IMAGE } from '@/lib/blog';

const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';
const CATEGORY_ORDER = ['Budżet', 'Ekipa', 'Materiały', 'Harmonogram', 'Inwestycje'];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Blog() {
  const allPosts = getAllPosts();
  const [active, setActive] = useState('wszystko');
  const [query, setQuery] = useState('');

  // Build category counts from post.category
  const catCounts: Record<string, number> = {};
  allPosts.forEach(p => {
    const cat = p.category;
    if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  const categories = [
    { slug: 'wszystko', label: 'Wszystko', count: allPosts.length },
    ...CATEGORY_ORDER
      .filter(c => catCounts[c])
      .map(c => ({ slug: c.toLowerCase(), label: c, count: catCounts[c] })),
  ];

  const byCategory = active === 'wszystko'
    ? allPosts
    : allPosts.filter(p => p.category?.toLowerCase() === active);

  const filtered = query.trim()
    ? byCategory.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : byCategory;

  const featured = filtered[0];
  const secondary = filtered.slice(1, 3);
  const grid = filtered.slice(3);

  if (allPosts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0B1E' }}>
        <p className="text-[#636366] text-sm">Brak postów.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0B1E', color: '#E5E7EB', fontFamily: 'Inter, sans-serif' }}>
      <Navigation />

      {/* Header */}
      <section className="relative px-5 md:px-14 pt-32 pb-8">
        <div
          className="pointer-events-none absolute"
          style={{
            top: 0, right: 0, width: 600, height: 400,
            background: 'radial-gradient(ellipse, rgba(127,103,255,0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="relative max-w-[1168px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <p className="eyebrow mb-4" style={{ fontFamily: 'ui-monospace, monospace' }}>§ Dziennik</p>
            <h1
              className="text-white font-bold m-0"
              style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.04em' }}
            >
              Remonty w{' '}
              <em
                className="not-italic"
                style={{
                  fontStyle: 'italic', fontWeight: 400,
                  background: GRAD,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                liczbach.
              </em>
            </h1>
          </div>

          {/* Functional search */}
          <div
            className="flex gap-1.5 p-1 rounded-full border border-white/[0.08] w-full lg:w-auto lg:min-w-[280px]"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <span className="px-4 py-2.5 text-[#6B7280] text-[13px] flex-shrink-0">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Szukaj w dzienniku…"
              className="flex-1 bg-transparent border-0 outline-none text-white text-[13px] pr-4 min-w-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="px-5 md:px-14 py-6 border-b border-white/[0.06]">
        <div className="max-w-[1168px] mx-auto flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer"
              style={{
                background: active === c.slug ? '#fff' : 'transparent',
                color: active === c.slug ? '#0A0B1E' : '#B8BCC8',
                border: active === c.slug ? 'none' : '1px solid rgba(255,255,255,0.10)',
              }}
            >
              {c.label}
              <span className="ml-2 text-[11px]" style={{ color: active === c.slug ? '#6B7280' : '#6B7280', fontFamily: 'ui-monospace, monospace' }}>
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* No results */}
      {filtered.length === 0 && (
        <section className="px-5 md:px-14 py-24 text-center">
          <p className="text-[#6B7280] text-sm" style={{ fontFamily: 'ui-monospace, monospace' }}>
            Brak wyników dla „{query}"
          </p>
        </section>
      )}

      {/* Featured + secondary */}
      {featured && (
        <section className="px-5 md:px-14 py-16">
          <div className="max-w-[1168px] mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">

            {/* Featured card */}
            <Link to={`/blog/${featured.slug}`} className="group no-underline">
              <article
                className="rounded-3xl overflow-hidden border border-white/[0.06] transition-colors duration-200 group-hover:border-white/[0.14]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-full overflow-hidden" style={{ aspectRatio: '16/10', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <img
                    src={CATEGORY_IMAGE[featured.category] ?? '/blog/categories/budzet.png'}
                    alt={featured.category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div
                    className="inline-flex items-center gap-2.5 mb-4"
                    style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00D4FF' }}
                  >
                    <span style={{ width: 16, height: 1, background: '#00D4FF', display: 'inline-block' }} />
                    Wyróżnione · {featured.category || featured.tags?.[0] || 'Blog'}
                  </div>
                  <h2
                    className="text-white font-bold m-0 mb-3.5 transition-colors group-hover:text-[#00D4FF]"
                    style={{ fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1.15 }}
                  >
                    {featured.title}
                  </h2>
                  {featured.description && (
                    <p className="text-[#B8BCC8] m-0 mb-6" style={{ fontSize: 15, lineHeight: 1.55 }}>
                      {featured.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                    <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: GRAD }} />
                    <span className="text-[#E5E7EB]">RenoHub</span>
                    <span>·</span>
                    <span>{formatDate(featured.date)}</span>
                    <span>·</span>
                    <span style={{ fontFamily: 'ui-monospace, monospace' }}>5 min</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Secondary stack */}
            <div className="flex flex-col gap-4">
              {secondary.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group no-underline flex-1">
                  <article
                    className="rounded-2xl border border-white/[0.06] p-6 transition-colors duration-200 group-hover:border-white/[0.14] flex flex-col justify-between h-full"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div>
                      <div
                        className="mb-3.5"
                        style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7F67FF' }}
                      >
                        {p.category || p.tags?.[0] || 'Blog'}
                      </div>
                      <h3
                        className="text-white m-0 font-semibold transition-colors group-hover:text-[#B8BCC8]"
                        style={{ fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.25 }}
                      >
                        {p.title}
                      </h3>
                    </div>
                    <div
                      className="mt-5 text-[12px] text-[#6B7280]"
                      style={{ fontFamily: 'ui-monospace, monospace' }}
                    >
                      {formatDate(p.date)} · 5 min
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      {grid.length > 0 && (
        <section className="px-5 md:px-14 pb-24">
          <div className="max-w-[1168px] mx-auto">
            <div
              className="pb-4 mb-8 border-b border-white/[0.08]"
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B7280' }}
            >
              Nowsze wpisy
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grid.map((p, i) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group no-underline">
                  <article
                    className="rounded-2xl border border-white/[0.06] p-6 transition-colors duration-200 group-hover:border-white/[0.14]"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="w-full rounded-xl mb-5 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                      <img
                        src={CATEGORY_IMAGE[p.category] ?? '/blog/categories/budzet.png'}
                        alt={p.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className="mb-3"
                      style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7F67FF' }}
                    >
                      {p.category || p.tags?.[0] || 'Blog'}
                    </div>
                    <h3
                      className="text-white m-0 mb-4 font-semibold transition-colors group-hover:text-[#00D4FF]"
                      style={{ fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.3 }}
                    >
                      {p.title}
                    </h3>
                    <div
                      className="text-[12px] text-[#6B7280]"
                      style={{ fontFamily: 'ui-monospace, monospace' }}
                    >
                      {formatDate(p.date)} · 5 min
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-14">
              <button className="border border-white/[0.15] text-white bg-transparent rounded-full px-7 py-3.5 text-[14px] font-medium cursor-pointer hover:bg-white/[0.04] transition-colors">
                Zobacz starsze wpisy →
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
