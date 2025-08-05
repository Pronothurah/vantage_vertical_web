import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Vantage Vertical - Kenya\'s leading drone services company with certified pilots and advanced technology.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">About Vantage Vertical</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          About page content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}