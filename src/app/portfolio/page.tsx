import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'View our portfolio of drone photography, aerial mapping, surveillance, and agritech projects across Kenya.',
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">Our Portfolio</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Portfolio page content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}