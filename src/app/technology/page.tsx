import type { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata, pageConfigs } from '@/lib/seo';
import { HeroSection } from '@/components/sections';

export const metadata: Metadata = generateMetadata(pageConfigs.technology);

export default function TechnologyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="The Future of Flight Intelligence"
        subtitle="Where Artificial Intelligence Meets Aerial Innovation. Pioneering the next generation of autonomous drone systems and Urban Air Mobility solutions for tomorrow's world."
        backgroundImage="/drone_on_air.jpg"
        ctaText="Explore AI Technology"
        ctaLink="#ai-technology"
        secondaryCtaText="View UAM Vision"
        secondaryCtaLink="#urban-mobility"
        tagline="Advanced AI-Powered Drone Solutions"
      />

      {/* AI-Powered Drone Technology Section */}
      <section id="ai-technology" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              AI-Powered <span className="text-gradient">Drone Technology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionizing aerial operations through cutting-edge artificial intelligence and machine learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Computer Vision Systems */}
            <div className="service-card group text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">Computer Vision</h3>
              <p className="text-gray-600 mb-6">
                Real-time object detection, tracking, and classification using advanced neural networks
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automated crop health analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Wildlife monitoring & counting
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Infrastructure inspection
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Security threat detection
                </li>
              </ul>
            </div>

            {/* Autonomous Flight Systems */}
            <div className="service-card group text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">Autonomous Flight</h3>
              <p className="text-gray-600 mb-6">
                Machine learning-powered navigation with intelligent path optimization and obstacle avoidance
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dynamic route planning
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Weather adaptation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Collision avoidance
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Swarm coordination
                </li>
              </ul>
            </div>

            {/* Intelligent Data Analysis */}
            <div className="service-card group text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">Data Intelligence</h3>
              <p className="text-gray-600 mb-6">
                Predictive analytics and pattern recognition for actionable insights from aerial data
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Predictive maintenance
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Yield forecasting
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Risk assessment
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Trend analysis
                </li>
              </ul>
            </div>
          </div>

          {/* Video Demonstration */}
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">See AI in Action</h3>
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer hover:bg-gray-700 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
              <div className="text-center text-gray-300 relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">AI-Powered Drone Technology Demo</p>
                <p className="text-sm mt-2 text-gray-400">Video showcasing autonomous operations and computer vision</p>
                <p className="text-xs mt-3 text-blue-400">Click to play • 3:45 duration</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Watch Full Demo
              </button>
              <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Urban Air Mobility Section */}
      <section id="urban-mobility" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              Urban Air <span className="text-gradient">Mobility</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Pioneering the future of urban transportation through intelligent aerial systems
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-subsection-title mb-6">The Future is Airborne</h3>
              <p className="text-lg mb-6 text-gray-600 leading-relaxed">
                Vantage Vertical is at the forefront of Urban Air Mobility, developing intelligent systems that will revolutionize how people and goods move through urban environments. Our vision encompasses autonomous air taxis, cargo delivery networks, and smart city integration.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Autonomous passenger transport</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Smart cargo delivery systems</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Integrated traffic management</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Sustainable urban mobility</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 relative overflow-hidden group cursor-pointer hover:bg-gray-200 transition-all duration-300">
                <div className="text-center text-gray-600 relative z-10">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">Urban Air Mobility Vision</p>
                  <p className="text-sm mt-2 text-gray-600">Future cityscape with autonomous aerial vehicles</p>
                  <p className="text-xs mt-3 text-primary">Click to play • 5:20 duration</p>
                </div>
              </div>
            </div>
          </div>

          {/* UAM Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="service-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Smart City Integration</h4>
              <p className="text-gray-600 text-sm">
                Seamless integration with urban infrastructure, traffic systems, and emergency services for optimized city-wide mobility.
              </p>
            </div>

            <div className="service-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Safety & Security</h4>
              <p className="text-gray-600 text-sm">
                Advanced safety protocols, redundant systems, and AI-powered risk assessment ensure the highest levels of passenger and cargo security.
              </p>
            </div>

            <div className="service-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Sustainable Future</h4>
              <p className="text-gray-600 text-sm">
                Electric propulsion, optimized flight paths, and reduced ground traffic contribute to cleaner, more sustainable urban environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current AI Applications */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              AI Applications <span className="text-gradient">Today</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of artificial intelligence in our current drone services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Precision Agriculture */}
            <div className="service-card">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Precision Agriculture</h3>
                  <p className="text-primary font-semibold">ML-powered crop health analysis</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Our AI systems analyze multispectral imagery to detect crop stress, disease, and nutrient deficiencies before they're visible to the human eye.
              </p>
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer hover:bg-gray-200 transition-colors duration-300">
                <div className="text-center text-gray-600 relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Precision Agriculture Demo</p>
                  <p className="text-xs mt-1 text-primary">Click to play • 2:30 duration</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  NDVI crop health mapping
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automated pest detection
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Yield prediction modeling
                </li>
              </ul>
            </div>

            {/* Automated Surveillance */}
            <div className="service-card">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Automated Surveillance</h3>
                  <p className="text-primary font-semibold">Intelligent threat detection</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Advanced computer vision algorithms automatically identify and track suspicious activities, unauthorized intrusions, and security threats.
              </p>
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer hover:bg-gray-200 transition-colors duration-300">
                <div className="text-center text-gray-600 relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Surveillance AI Demo</p>
                  <p className="text-xs mt-1 text-primary">Click to play • 4:15 duration</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time threat detection
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Perimeter monitoring
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Behavioral analysis
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience the Future?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Partner with Vantage Vertical to leverage cutting-edge AI technology for your aerial operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group"
              >
                Schedule Consultation
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
              </Link>
              <Link
                href="/portfolio"
                className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 group"
              >
                View Our Services
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
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}