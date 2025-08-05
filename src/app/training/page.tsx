import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drone Training Programs',
  description: 'Professional drone training programs in Kenya - learn to fly, get certified, and master commercial drone operations.',
};

export default function TrainingPage() {
  return (
    <main className="min-h-screen">
      <div className="container-custom section-padding">
        <h1 className="text-section-title text-center mb-8">Drone Training Programs</h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Training page content will be implemented in subsequent tasks.
        </p>
      </div>
    </main>
  );
}