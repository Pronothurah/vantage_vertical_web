import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return {
    title: `Blog Post - ${params.slug}`,
    description: 'Individual blog post content will be implemented in subsequent tasks.',
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">Blog Post: {params.slug}</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Individual blog post content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}