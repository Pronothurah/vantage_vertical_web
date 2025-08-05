import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest insights on drone technology, aerial photography, precision agriculture, and industry trends from Vantage Vertical.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">Blog & Insights</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Blog page content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}