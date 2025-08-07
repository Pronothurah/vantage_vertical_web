import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { OptimizedImage } from '@/components/ui';
import { imageSizes, imageQuality } from '@/lib/imageUtils';
import { HeroSection } from '@/components/sections';
import { ServiceGrid } from '@/components/sections/ServiceCard';
import { ContactForm } from '@/components/forms';
import { 
  trainingPrograms, 
  trainingInstructors, 
  trainingFacilities, 
  trainingTestimonials,
  trainingMetrics 
} from '@/data';

import { generateMetadata, pageConfigs } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(pageConfigs.training);

export default function TrainingPage() {
  // Convert training programs to service card format
  const trainingServices = trainingPrograms.map(program => ({
    title: program.title,
    description: program.description,
    iconType: 'training' as const,
    features: program.objectives,
    ctaText: `Enroll in ${program.level} Course`,
    ctaLink: `/contact?service=training&program=${program.id}`,
    variant: program.featured ? 'featured' as const : 'default' as const,
    badge: `${program.duration} • ${program.price}`,
    level: program.level
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Master the Skies"
        subtitle="Professional Drone Training Programs"
        backgroundImage="/hands_on_drone.jpg"
        ctaText="Start Your Journey"
        ctaLink="#programs"
        tagline="From Beginner to Professional Pilot"
      />

      {/* Training Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-6">
              Launch Your Drone Career
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join Kenya's premier drone training academy. Our KCAA-certified programs combine expert instruction, 
              hands-on experience, and modern facilities to prepare you for success in the rapidly growing drone industry.
            </p>
          </div>

          {/* Training Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {trainingMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{metric.value}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{metric.label}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Why Choose Our Training */}
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-heading font-bold text-center mb-8">
              Why Choose Vantage Vertical Training Academy?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">KCAA Certified</h4>
                <p className="text-gray-600 text-sm">All programs meet KCAA standards and prepare you for official licensing</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Expert Instructors</h4>
                <p className="text-gray-600 text-sm">Learn from industry professionals with years of practical experience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Modern Facilities</h4>
                <p className="text-gray-600 text-sm">State-of-the-art training facilities with latest equipment and technology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section id="programs" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-6">Training Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of training programs designed to take you from beginner to professional pilot.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {trainingPrograms.map((program, index) => (
              <div key={program.id} className={`bg-white rounded-xl shadow-lg overflow-hidden ${program.featured ? 'ring-2 ring-primary' : ''}`}>
                {program.featured && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                        program.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        program.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        program.level === 'Advanced' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {program.level}
                      </span>
                      <h3 className="text-xl font-heading font-bold mb-2">{program.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{program.price}</div>
                      <div className="text-sm text-gray-600">{program.duration}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{program.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Learning Objectives:</h4>
                    <ul className="space-y-2">
                      {program.objectives.slice(0, 4).map((objective, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Next Available Sessions:</h4>
                    <div className="space-y-2">
                      {program.schedule.slice(0, 2).map((session, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {new Date(session.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {new Date(session.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            session.status === 'available' ? 'bg-green-100 text-green-800' :
                            session.status === 'filling-fast' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {session.slots} slots left
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/contact?service=training&program=${program.id}`}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      program.featured
                        ? 'bg-primary text-white hover:bg-red-700'
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-6">Meet Our Expert Instructors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from industry professionals with years of practical experience and proven track records.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainingInstructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-1">{instructor.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-3">{instructor.title}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{instructor.bio}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-semibold">{instructor.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students Trained:</span>
                      <span className="font-semibold">{instructor.studentsTrained}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pass Rate:</span>
                      <span className="font-semibold text-green-600">{instructor.passRate}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialties.slice(0, 2).map((specialty, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-6">World-Class Training Facilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our modern facilities provide the perfect environment for learning, with state-of-the-art equipment and dedicated training areas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/drone_home.jpg"
                  alt="Training Classroom"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-xl mb-4">{trainingFacilities.classroom.name}</h3>
                <p className="text-gray-600 mb-6">
                  Modern classroom equipped with the latest technology for interactive learning and theoretical instruction.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {trainingFacilities.classroom.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Equipment:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {trainingFacilities.classroom.equipment.slice(0, 3).map((equipment, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {equipment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/aerial_drone.jpg"
                  alt="Flight Training Area"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-xl mb-4">{trainingFacilities.flightArea.name}</h3>
                <p className="text-gray-600 mb-6">
                  Dedicated {trainingFacilities.flightArea.size} flight training area with KCAA-approved airspace for safe practical training.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {trainingFacilities.flightArea.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Equipment:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {trainingFacilities.flightArea.equipment.slice(0, 3).map((equipment, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {equipment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our graduates who have transformed their careers and built successful businesses in the drone industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {trainingTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-start mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <OptimizedImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      quality={imageQuality.thumbnail}
                      sizes={imageSizes.avatar}
                      fallbackSrc="/images/placeholder-drone.svg"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-primary font-semibold text-sm">{testimonial.currentRole}</p>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Graduated: {new Date(testimonial.graduationDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {testimonial.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Before Training</p>
                      <p className="text-sm font-medium">{testimonial.beforeAfter.before}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">After Training</p>
                      <p className="text-sm font-medium text-primary">{testimonial.beforeAfter.after}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Ready to Start Your Drone Career?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join hundreds of successful graduates who have launched their careers in the drone industry. 
            Enroll today and take the first step towards becoming a certified drone pilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?service=training"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Enroll Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-300"
            >
              Get More Information
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}