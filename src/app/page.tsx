import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import { ServiceGrid } from '@/components/sections/ServiceCard';
import TestimonialSlider from '@/components/sections/TestimonialSlider';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { mainServices, industries, whyChooseUsFeatures, testimonials } from '@/data';
import { generateMetadata, pageConfigs, generateServiceSchema } from '@/lib/seo';
import { OptimizedImage } from '@/components/ui';
import { imageSizes, imageQuality } from '@/lib/imageUtils';

export const metadata: Metadata = generateMetadata(pageConfigs.home);

export default function HomePage() {
  // Generate structured data for main services
  const servicesSchema = mainServices.map(service => 
    generateServiceSchema({
      name: service.title,
      description: service.description,
      serviceType: service.title,
      areaServed: 'Kenya',
    })
  );

  return (
    <>
      {/* Structured Data */}
      {servicesSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      
      <main>
      {/* Hero Section */}
      <HeroSection
        title="See More. Do More. From Above."
        subtitle="Leading drone services company in Kenya offering professional aerial mapping, surveillance, agritech solutions, commercial photography, and comprehensive drone training programs."
        backgroundImage="/drone_home.jpg"
        ctaText="Book a Drone Service"
        ctaLink="/contact"
        secondaryCtaText="Browse Our Drones"
        secondaryCtaLink="/technology"
        tagline="Professional Aerial Intelligence"
      />

      {/* Services Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              Our <span className="text-gradient">Drone Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From precision agriculture to aerial mapping, we deliver cutting-edge drone solutions 
              that help businesses see more, do more, and achieve more from above.
            </p>
          </div>

          {/* Services Grid */}
          <ServiceGrid services={mainServices} columns={2} className="mb-20" />

          {/* Industries We Serve Section */}
          <div className="text-center mb-12">
            <h3 className="text-subsection-title mb-4">
              Industries We <span className="text-gradient">Serve</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our drone solutions are tailored to meet the unique needs of various industries, 
              delivering measurable results and operational efficiency.
            </p>
          </div>

          {/* Industries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.map((industry, index) => (
              <div
                key={industry.name}
                className="group text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Industry Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <ServiceIcon type={industry.iconType} className="w-8 h-8" />
                  </div>
                </div>

                {/* Industry Name */}
                <h4 className="font-heading font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                  {industry.name}
                </h4>

                {/* Industry Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {industry.description}
                </p>

                {/* Benefits List */}
                <ul className="text-xs text-gray-500 space-y-1">
                  {industry.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Ready to transform your operations with professional drone services?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group"
              >
                Get Started Today
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="/portfolio"
                className="btn-secondary inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 group"
              >
                View Our Work
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              Why Choose <span className="text-gradient">Vantage Vertical</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine certified expertise, advanced technology, and proven results to deliver 
              exceptional drone services that exceed expectations.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {whyChooseUsFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="group text-center p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Feature Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <ServiceIcon type={feature.iconType} className="w-8 h-8" />
                  </div>
                </div>

                {/* Feature Title */}
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature Stats */}
                <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>

          {/* KCAA Certification Display */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-16">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1 mb-6 lg:mb-0 lg:mr-8">
                <h3 className="font-heading font-semibold text-2xl text-gray-900 mb-4">
                  KCAA Certified & Compliant
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We are fully certified by the Kenya Civil Aviation Authority (KCAA) and maintain 
                  strict compliance with all aviation regulations. Our pilots undergo regular training 
                  and certification updates to ensure the highest safety standards.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Licensed Operators
                  </div>
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Insured Operations
                  </div>
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Safety Compliant
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 bg-white rounded-xl shadow-medium p-4">
                  <OptimizedImage
                    src="/kcaa.png"
                    alt="KCAA Certification"
                    fill
                    className="object-contain p-2"
                    quality={imageQuality.thumbnail}
                    sizes={imageSizes.logo}
                    fallbackSrc="/images/placeholder-drone.svg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Testimonials */}
          <div className="mb-8">
            <div className="text-center mb-12">
              <h3 className="text-subsection-title mb-4">
                What Our <span className="text-gradient">Clients Say</span>
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about 
                the results they've achieved with our drone services.
              </p>
            </div>

            <TestimonialSlider
              testimonials={testimonials}
              autoPlay={true}
              showMetrics={true}
              showNavigation={true}
              showDots={true}
            />
          </div>
        </div>
      </section>
      </main>
    </>
  );
}