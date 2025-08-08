import type { Metadata } from 'next';
import { droneProducts, droneCategories, droneSpecs } from '@/data';
import DroneProductGrid from '@/components/sections/DroneProductGrid';
import DroneFilters from '@/components/sections/DroneFilters';
import DroneComparison from '@/components/sections/DroneComparison';
import HeroSection from '@/components/sections/HeroSection';
import { DroneInquiryForm } from '@/components/forms';

import { generateMetadata, pageConfigs } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(pageConfigs.drones);

export default function DronesPage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        title="Professional Drones for Every Mission"
        subtitle="Discover our curated selection of commercial-grade drones for agriculture, mapping, surveillance, and commercial applications. Expert consultation and support included."
        backgroundImage="/drone_on_black_background.jpg"
        ctaText="Browse Drones"
        ctaLink="#products"
        secondaryCtaText="Get Consultation"
        secondaryCtaLink="/contact?service=drone-sales"
        tagline="Quality Equipment. Expert Support."
      />

      {/* Drone Categories Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              Drone <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From precision agriculture to commercial photography, find the perfect drone 
              for your specific needs with our expert guidance and comprehensive support.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {droneCategories.map((category, index) => (
              <div
                key={category.id}
                className="group text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <category.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="text-sm text-primary font-semibold">
                  {category.productCount} Models Available
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">
              Our <span className="text-gradient">Drone Collection</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional-grade drones selected for their reliability, performance, and value. 
              Each drone comes with comprehensive support and training.
            </p>
          </div>

          {/* Product Grid with Filters */}
          <DroneProductGrid products={droneProducts} showFilters={true} />
        </div>
      </section>

      {/* Drone Comparison Tool */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">
              Compare <span className="text-gradient">Specifications</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare key specifications across different drone models to find the perfect 
              match for your specific requirements and budget.
            </p>
          </div>

          <DroneComparison products={droneProducts} />
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              Why Choose <span className="text-gradient">Vantage Vertical</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              More than just drone sales - we provide complete solutions with expert support, 
              training, and ongoing maintenance services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Consultation',
                description: 'Get personalized recommendations based on your specific needs and budget from our certified drone experts.',
                icon: '🎯'
              },
              {
                title: 'Comprehensive Training',
                description: 'Free basic training included with every purchase, plus advanced certification programs available.',
                icon: '🎓'
              },
              {
                title: 'Local Support',
                description: 'Kenya-based support team with local knowledge of regulations, weather, and operational conditions.',
                icon: '🇰🇪'
              },
              {
                title: 'Warranty & Service',
                description: 'Full manufacturer warranty plus local repair and maintenance services for peace of mind.',
                icon: '🛠️'
              },
              {
                title: 'KCAA Compliance',
                description: 'All drones sold with KCAA registration assistance and compliance documentation.',
                icon: '✅'
              },
              {
                title: 'Flexible Financing',
                description: 'Flexible payment options and financing solutions to make professional drones accessible.',
                icon: '💳'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group text-center p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drone Inquiry Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title mb-4">
                Ready to Find Your <span className="text-gradient">Perfect Drone</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get expert consultation and personalized recommendations for your specific needs. 
                Our team will help you choose the right drone solution with comprehensive support.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <DroneInquiryForm 
                variant="full" 
                className="max-w-3xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-lg mb-6 max-w-xl mx-auto opacity-90">
            Speak directly with our drone experts for instant answers to your questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254704277687"
              className="btn-secondary bg-white text-primary hover:bg-gray-100 inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 group"
            >
              <svg
                className="mr-2 w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call +254 704 277 687
            </a>
            <a
              href="mailto:vantagevarticalltd@gmail.com"
              className="btn-secondary border-white text-white hover:bg-white hover:text-primary inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 group"
            >
              <svg
                className="mr-2 w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}