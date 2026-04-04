import { useState, useRef, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import BlogArticle from './BlogArticle';
import BlogSidebar from './BlogSidebar';
import BlogMobileButton from './BlogMobileButton';
import BlogMobileSheet from './BlogMobileSheet';
import type { BlogPost } from '@/lib/blog';

interface BlogShellProps {
  post: BlogPost;
  allPosts: BlogPost[];
}

export default function BlogShell({ post, allPosts }: BlogShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleRailEnter = () => {
    clearTimeout(hideTimeoutRef.current);
    setSidebarOpen(true);
  };

  const handleSidebarLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setSidebarOpen(false), 120);
  };

  const handleSidebarEnter = () => {
    clearTimeout(hideTimeoutRef.current);
  };

  const handleMobileClose = useCallback(() => setMobileSheetOpen(false), []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Desktop hover rail */}
      <div
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-2 flex-col items-center justify-center gap-1.5 cursor-pointer"
        onMouseEnter={handleRailEnter}
        onMouseLeave={handleSidebarLeave}
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-[rgba(127,103,255,0.4)]"
          />
        ))}
      </div>

      {/* Desktop sidebar panel */}
      <div
        className={[
          'hidden lg:block fixed left-2 top-0 h-full w-64 z-40',
          'bg-[rgba(10,10,15,0.97)] border-r border-[rgba(255,255,255,0.07)]',
          'overflow-y-auto',
          'transition-all duration-300 ease-out',
          sidebarOpen
            ? 'opacity-100 translate-x-0 pointer-events-auto shadow-[4px_0_30px_rgba(0,0,0,0.6)]'
            : 'opacity-0 -translate-x-3 pointer-events-none',
        ].join(' ')}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
      >
        <BlogSidebar posts={allPosts} currentSlug={post.slug} />
      </div>

      {/* Article */}
      <main className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <BlogArticle post={post} />
      </main>

      <Footer />

      {/* Mobile */}
      <BlogMobileButton onClick={() => setMobileSheetOpen(true)} />
      <BlogMobileSheet
        open={mobileSheetOpen}
        onClose={handleMobileClose}
        posts={allPosts}
        currentSlug={post.slug}
      />
    </div>
  );
}
