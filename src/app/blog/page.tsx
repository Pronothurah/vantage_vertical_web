import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListing from '@/components/sections/BlogListing';

import { generateMetadata, pageConfigs } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(pageConfigs.blog);
export const dynamic = 'force-static';

interface BlogPageProps {
  searchParams: {
    query?: string;
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default function BlogPage() {
  const blogParams = {
    query: undefined,
    category: undefined,
    tag: undefined,
    page: 1,
    limit: 6
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Blog & <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Expert insights on drone technology, precision agriculture, and aerial intelligence from Kenya's leading drone service provider.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">
                Drone Technology
              </span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">
                Precision Agriculture
              </span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">
                Industry Insights
              </span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">
                Case Studies
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="section-padding">
        <div className="container-custom">
          <Suspense fallback={<BlogListingSkeleton />}>
            <BlogListing searchParams={blogParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

// Loading skeleton component
function BlogListingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search and filters skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-12 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Blog posts skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}