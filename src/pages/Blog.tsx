import { Navigate } from 'react-router-dom';
import { getLatestPost } from '@/lib/blog';

export default function Blog() {
  const latest = getLatestPost();

  if (!latest) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[#636366] text-sm">Brak postów.</p>
      </div>
    );
  }

  return <Navigate to={`/blog/${latest.slug}`} replace />;
}
