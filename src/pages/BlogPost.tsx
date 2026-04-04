import { useParams, Navigate } from 'react-router-dom';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import BlogShell from '@/components/blog/BlogShell';
import { SEOHead } from '@/components/ui/seo-head';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const allPosts = getAllPosts();

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <SEOHead
        title={`${post.title} — RenoHub`}
        description={post.description}
        keywords={post.tags.join(', ')}
      />
      <BlogShell post={post} allPosts={allPosts} />
    </>
  );
}
