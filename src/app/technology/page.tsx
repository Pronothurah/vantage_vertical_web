import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology & Services',
  description: 'Discover our advanced drone technology, aerial mapping services, surveillance solutions, and agritech capabilities.',
};

export default function TechnologyPage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">Technology & Services</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Technology page content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}