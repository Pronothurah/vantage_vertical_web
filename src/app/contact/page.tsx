'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ContactForm from '@/components/forms/ContactForm';
import DroneInquiryForm from '@/components/forms/DroneInquiryForm';
import ContactFormSelector from '@/components/forms/ContactFormSelector';
import { companyInfo } from '@/data';

// Contact information data
const contactInfo = {
  office: {
    address: 'Westlands Business Park, Suite 402\nWaiyaki Way, Westlands\nNairobi, Kenya',
    phone: '+254 700 123 456',
    email: 'info@vantagevertical.co.ke',
    hours: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Emergency calls only'
  },
  emergency: {
    phone: '+254 722 URGENT (874368)',
    email: 'emergency@vantagevertical.co.ke',
    responseTime: '24/7 Emergency Response\nAverage response time: 2 hours',
    services: [
      'Emergency surveillance',
      'Disaster response mapping',
      'Search and rescue support',
      'Critical infrastructure monitoring'
    ]
  },
  departments: [
    {
      name: 'Sales & General Inquiries',
      phone: '+254 700 123 456',
      email: 'sales@vantagevertical.co.ke',
      description: 'New projects, quotes, and general information'
    },
    {
      name: 'Training Academy',
      phone: '+254 700 123 457',
      email: 'training@vantagevertical.co.ke',
      description: 'Drone pilot certification and training programs'
    },
    {
      name: 'Technical Support',
      phone: '+254 700 123 458',
      email: 'support@vantagevertical.co.ke',
      description: 'Equipment support and technical assistance'
    },
    {
      name: 'Drone Sales',
      phone: '+254 700 123 459',
      email: 'drones@vantagevertical.co.ke',
      description: 'Drone purchases, equipment, and accessories'
    }
  ]
};

const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/company/vantage-vertical', icon: 'linkedin' },
  { name: 'Twitter', url: 'https://twitter.com/vantagevertical', icon: 'twitter' },
  { name: 'Facebook', url: 'https://facebook.com/vantagevertical', icon: 'facebook' },
  { name: 'Instagram', url: 'https://instagram.com/vantagevertical', icon: 'instagram' },
  { name: 'YouTube', url: 'https://youtube.com/vantagevertical', icon: 'youtube' }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Ready to elevate your project? Our KCAA certified team is here to help you achieve more from above.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+254700123456"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a
                href="#contact-form"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200 inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.66-.4l-5.34 2.24 2.24-5.34A8.955 8.955 0 014 12C4 7.582 7.582 4 12 4s8 3.582 8 8z" />
                </svg>
                Send Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you. We're committed to responding quickly and professionally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.departments.map((dept, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                  <div className="space-y-2">
                    <a
                      href={`tel:${dept.phone.replace(/\s/g, '')}`}
                      className="block text-primary hover:text-red-700 font-medium transition-colors duration-200"
                    >
                      {dept.phone}
                    </a>
                    <a
                      href={`mailto:${dept.email}`}
                      className="block text-gray-600 hover:text-primary text-sm transition-colors duration-200"
                    >
                      {dept.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-red-50 border-l-4 border-primary rounded-lg p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Emergency Response</h3>
                <p className="text-gray-700 mb-4">
                  Need immediate drone services for emergency situations? Our certified pilots are available 24/7 for critical response operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Emergency Hotline</h4>
                    <a
                      href={`tel:${contactInfo.emergency.phone.replace(/\s/g, '').replace(/[()]/g, '')}`}
                      className="text-2xl font-bold text-primary hover:text-red-700 transition-colors duration-200"
                    >
                      {contactInfo.emergency.phone}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{contactInfo.emergency.responseTime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Emergency Services</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {contactInfo.emergency.services.map((service, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {service}
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

      {/* Contact Form and Office Info */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div id="contact-form">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                <ContactFormSelector variant="full" />
              </Suspense>
            </div>

            {/* Office Information */}
            <div className="space-y-8">
              {/* Office Details */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Visit Our Office</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600 whitespace-pre-line">{contactInfo.office.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                      <p className="text-gray-600 whitespace-pre-line">{contactInfo.office.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <a
                        href={`mailto:${contactInfo.office.email}`}
                        className="text-primary hover:text-red-700 transition-colors duration-200"
                      >
                        {contactInfo.office.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-8">
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm">Interactive Map</p>
                      <p className="text-xs">Westlands Business Park, Nairobi</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <a
                      href="https://maps.google.com/?q=Westlands+Business+Park+Nairobi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-red-700 font-medium transition-colors duration-200 inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Follow Us</h3>
                <p className="text-gray-600 mb-6">
                  Stay updated with our latest projects, industry insights, and drone technology news.
                </p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-all duration-200 text-gray-700"
                    >
                      <span className="font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* KCAA Certification */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">KCAA Certified Operations</h3>
                    <p className="text-green-700 text-sm mb-3">
                      All our operations are fully certified by the Kenya Civil Aviation Authority (KCAA). 
                      We maintain the highest standards of safety and regulatory compliance.
                    </p>
                    <div className="text-sm text-green-600">
                      <p><strong>Operator Certificate:</strong> ROC-2020-VV-001</p>
                      <p><strong>Valid Until:</strong> December 31, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about our services and contact process.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How quickly do you respond to inquiries?",
                answer: "We respond to all inquiries within 24 hours during business days. For emergency services, our response time is typically within 2 hours, 24/7."
              },
              {
                question: "What information should I include in my project inquiry?",
                answer: "Please include your project location, timeline, specific requirements, and any relevant details about the area to be surveyed or monitored. This helps us provide accurate quotes and recommendations."
              },
              {
                question: "Do you provide services outside Nairobi?",
                answer: "Yes, we provide services across Kenya. Travel costs may apply for locations outside the Nairobi metropolitan area. Contact us for specific location pricing."
              },
              {
                question: "What are your payment terms?",
                answer: "We typically require 50% deposit upon project confirmation, with the balance due upon completion. For ongoing contracts, we offer flexible payment terms."
              },
              {
                question: "Are your operations insured?",
                answer: "Yes, we maintain comprehensive insurance coverage including liability (KES 50M) and hull insurance (KES 10M) through Kenya Aviation Insurance."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}