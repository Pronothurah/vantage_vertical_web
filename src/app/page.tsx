import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Professional drone services in Kenya - aerial mapping, surveillance, agritech solutions, and commercial photography by certified pilots.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <div className="text-center">
          <h1 className="text-hero text-gradient mb-6">
            See More. Do More. From Above.
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Leading drone services company in Kenya offering professional aerial mapping, 
            surveillance, agritech solutions, commercial photography, and comprehensive 
            drone training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Book a Drone Service
            </button>
            <button className="btn-secondary">
              Browse Our Drones
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}