import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Vantage Vertical for drone services, training programs, or drone purchases. Professional support available.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">Contact Us</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Contact page content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}