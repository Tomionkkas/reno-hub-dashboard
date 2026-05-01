import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/FooterD';
import BlogArticle from './BlogArticle';
import BlogMobileButton from './BlogMobileButton';
import BlogMobileSheet from './BlogMobileSheet';
import { NewsletterModal } from '@/components/ui/newsletter-modal';
import type { BlogPost } from '@/lib/blog';
import { CATEGORY_IMAGE } from '@/lib/blog';

const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';

function extractHeadings(content: string): string[] {
  const regex = /^#{2}\s+(.+)$/gm;
  const headings: string[] = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    headings.push(m[1].trim());
  }
  return headings;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[łĺ]/g, 'l').replace(/[śšş]/g, 's').replace(/[żźž]/g, 'z')
    .replace(/[ńñ]/g, 'n').replace(/[óö]/g, 'o').replace(/[ćč]/g, 'c')
    .replace(/[ąà]/g, 'a').replace(/[ęè]/g, 'e')
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

interface BlogShellProps {
  post: BlogPost;
  allPosts: BlogPost[];
}

export default function BlogShell({ post, allPosts }: BlogShellProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const handleMobileClose = useCallback(() => setMobileSheetOpen(false), []);

  const headings = extractHeadings(post.content);
  const related = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const category = post.category || post.tags?.[0] || 'Blog';

  const formattedDate = new Date(post.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen" style={{ background: '#0A0B1E', color: '#E5E7EB', fontFamily: 'Inter, sans-serif' }}>
      <Navigation />

      {/* Article header */}
      <header className="px-5 md:px-14 pt-28 pb-12 border-b border-white/[0.06]">
        <div className="max-w-[1168px] mx-auto">
          <div
            className="flex items-center gap-3 mb-5 text-[13px]"
            style={{ fontFamily: 'ui-monospace, monospace', color: '#6B7280', letterSpacing: '0.04em' }}
          >
            <Link
              to="/blog"
              className="hover:text-white transition-colors no-underline text-[#6B7280]"
            >
              ← Dziennik
            </Link>
            <span>/</span>
            <span style={{ color: '#7F67FF' }}>{category}</span>
          </div>

          <h1
            className="text-white font-bold m-0 mb-10"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              maxWidth: 960,
            }}
          >
            {post.title}
          </h1>

          {/* Hero image */}
          {CATEGORY_IMAGE[category] && (
            <div className="rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: '16/7' }}>
              <img
                src={CATEGORY_IMAGE[category]}
                alt={category}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-5 text-[14px] text-[#B8BCC8]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ background: GRAD }} />
              <div>
                <div className="text-white font-medium leading-tight text-[14px]">RenoHub</div>
                <div className="text-[12px] text-[#6B7280]">Redakcja</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#6B7280', letterSpacing: '0.04em' }}
            >
              {formattedDate.toUpperCase()} · 5 MIN CZYTANIA
            </div>
          </div>
        </div>
      </header>

      {/* 3-column body */}
      <section className="px-5 md:px-14 py-14">
        <div className="max-w-[1168px] mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr_220px] gap-12">

          {/* Left: TOC */}
          <aside className="hidden lg:block">
            {headings.length > 0 && (
              <div className="sticky top-24">
                <div
                  className="mb-4"
                  style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B7280' }}
                >
                  Spis treści
                </div>
                <div className="flex flex-col gap-2.5">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${slugify(h)}`}
                      className="text-[#B8BCC8] hover:text-white transition-colors no-underline text-[13px] leading-snug"
                      style={{ borderLeft: '2px solid rgba(255,255,255,0.10)', paddingLeft: 12 }}
                    >
                      {h}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Center: article */}
          <div className="min-w-0">
            <BlogArticle post={post} headingSlugs={headings.map(slugify)} />

            {/* Waitlist CTA */}
            <div
              className="mt-14 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(127,103,255,0.08), rgba(255,0,128,0.08))',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div>
                <div
                  className="mb-2"
                  style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00D4FF' }}
                >
                  Premiera wiosną 2026
                </div>
                <div className="text-white font-semibold text-[20px]" style={{ letterSpacing: '-0.02em' }}>
                  Sprawdź koszty remontu w CalcReno
                </div>
              </div>
              <button
                onClick={() => setNewsletterOpen(true)}
                className="bg-white text-[#0A0B1E] border-0 rounded-full px-6 py-3 text-[14px] font-semibold cursor-pointer hover:bg-white/90 transition-colors flex-shrink-0"
              >
                Dołącz do listy oczekujących →
              </button>
            </div>
          </div>

          {/* Right: share + related */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">

              {/* Share */}
              <div
                className="rounded-2xl p-5 mb-6 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div
                  className="mb-3"
                  style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B7280' }}
                >
                  Udostępnij
                </div>
                <div className="flex gap-2">
                  {['𝕏', 'f', 'in', '↗'].map((s, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#B8BCC8] text-[13px] cursor-pointer hover:bg-white/10 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <>
                  <div
                    className="mb-3"
                    style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B7280' }}
                  >
                    Powiązane
                  </div>
                  {related.map((p, i) => (
                    <Link
                      key={p.slug}
                      to={`/blog/${p.slug}`}
                      className="block no-underline py-3.5 hover:bg-white/[0.02] transition-colors rounded-lg"
                      style={{
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        borderBottom: i === related.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      }}
                    >
                      <div
                        className="mb-1.5"
                        style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#7F67FF', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                      >
                        {p.tags?.[0] ?? 'Blog'}
                      </div>
                      <div
                        className="text-white font-medium leading-snug"
                        style={{ fontSize: 13, letterSpacing: '-0.01em' }}
                      >
                        {p.title}
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />

      {/* Mobile posts drawer */}
      <BlogMobileButton onClick={() => setMobileSheetOpen(true)} />
      <BlogMobileSheet
        open={mobileSheetOpen}
        onClose={handleMobileClose}
        posts={allPosts}
        currentSlug={post.slug}
      />

      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </div>
  );
}
