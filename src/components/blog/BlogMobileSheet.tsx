import { useEffect } from 'react';
import BlogSidebar from './BlogSidebar';
import type { BlogPost } from '@/lib/blog';

interface BlogMobileSheetProps {
  open: boolean;
  onClose: () => void;
  posts: BlogPost[];
  currentSlug: string;
}

export default function BlogMobileSheet({
  open,
  onClose,
  posts,
  currentSlug,
}: BlogMobileSheetProps) {
  // Close sheet on navigation (slug change handled by BlogPost page re-render)
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-50 bg-black/60 lg:hidden transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={[
          'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
          'bg-[rgba(12,12,18,0.98)] border-t border-[rgba(127,103,255,0.25)]',
          'rounded-t-2xl max-h-[70vh] overflow-hidden',
          'transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Lista postów"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
        </div>

        <div className="overflow-y-auto max-h-[calc(70vh-2rem)]">
          <BlogSidebar posts={posts} currentSlug={currentSlug} />
        </div>
      </div>
    </>
  );
}
