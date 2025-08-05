import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  companyInfo, 
  teamMembers, 
  achievements, 
  kcaaInfo 
} from '@/data';

export const metadata: Metadata = {
  title: 'About Vantage Vertical - Kenya\'s Leading Drone Services Company',
  description: 'Learn about Vantage Vertical\'s mission, KCAA-certified team, and commitment to excellence in aerial mapping, surveillance, and agricultural drone services across Kenya.',
  keywords: 'about vantage vertical, drone company kenya, KCAA certified pilots, aerial services team, drone technology experts',
  openGraph: {
    title: 'About Vantage Vertical - Kenya\'s Leading Drone Services Company',
    description: 'Meet our KCAA-certified team and learn about our mission to revolutionize industries through innovative aerial intelligence solutions.',
    images: ['/og-image.jpg'],
  },
};

// Icon components for values and certifications
const IconShield = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconLightbulb = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconStar = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const IconHandshake = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const IconLeaf = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconHeart = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const IconCertificate = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const getValueIcon = (iconType: string) => {
  switch (iconType) {
    case 'shield': return <IconShield />;
    case 'lightbulb': return <IconLightbulb />;
    case 'star': return <IconStar />;
    case 'handshake': return <IconHandshake />;
    case 'leaf': return <IconLeaf />;
    case 'heart': return <IconHeart />;
    default: return <IconStar />;
  }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-hero mb-6 animate-fade-in-down">
              About <span className="text-gradient">Vantage Vertical</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 animate-fade-in-up">
              {companyInfo.tagline}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{companyInfo.founded}</div>
                <div className="text-sm text-gray-400">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{companyInfo.employees}</div>
                <div className="text-sm text-gray-400">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{companyInfo.projectsCompleted}</div>
                <div className="text-sm text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-400">KCAA Certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-section-title mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {companyInfo.mission}
              </p>
              <h3 className="text-subsection-title mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {companyInfo.vision}
              </p>
            </div>
            <div className="relative">
              <Image
                src="/drone_home.jpg"
                alt="Vantage Vertical drone operations"
                width={600}
                height={400}
                className="rounded-2xl shadow-large"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-large">
                <div className="text-2xl font-bold">5+ Years</div>
                <div className="text-sm">of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These values guide every decision we make and every service we provide, ensuring we deliver exceptional results while maintaining the highest standards of professionalism.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.values.map((value, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-medium transition-shadow duration-300">
                <div className="text-primary mb-4 flex justify-center">
                  {getValueIcon(value.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">Meet Our Expert Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our team of KCAA-certified professionals brings years of experience and expertise to deliver exceptional drone services across Kenya.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {teamMembers.map((member) => (
              <div key={member.id} className="card p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto sm:mx-0"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4 leading-relaxed">{member.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-800">Experience:</span>
                        <span className="text-gray-600 ml-1">{member.experience}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Projects:</span>
                        <span className="text-gray-600 ml-1">{member.projects}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Certifications:</h4>
                      <div className="space-y-1">
                        {member.certifications.slice(0, 2).map((cert, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <IconCertificate />
                            <span>{cert}</span>
                          </div>
                        ))}
                        {member.certifications.length > 2 && (
                          <div className="text-sm text-gray-500">
                            +{member.certifications.length - 2} more certifications
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From our founding in 2019 to becoming Kenya's leading drone services provider, here are the key milestones in our growth story.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-primary"></div>
              
              {achievements.map((achievement, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-medium z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="card p-6">
                      <div className="text-primary font-bold text-lg mb-2">{achievement.year}</div>
                      <h3 className="text-xl font-semibold mb-3">{achievement.title}</h3>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KCAA Certification Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">KCAA Certification & Compliance</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are fully certified by the Kenya Civil Aviation Authority (KCAA) and maintain the highest standards of aviation safety and regulatory compliance.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Certification Details */}
              <div className="space-y-8">
                <div className="card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <IconCertificate />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Operator Certificate</h3>
                      <p className="text-gray-600">Certificate No: {kcaaInfo.operatorCertificate}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="font-medium">{kcaaInfo.validUntil}</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Authorized Operations:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {kcaaInfo.authorizedOperations.map((operation, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-gray-600">{operation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-8">
                  <h3 className="text-xl font-semibold mb-6">Insurance Coverage</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Liability Coverage:</span>
                      <span className="font-medium">{kcaaInfo.insuranceCoverage.liability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hull Coverage:</span>
                      <span className="font-medium">{kcaaInfo.insuranceCoverage.hull}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{kcaaInfo.insuranceCoverage.provider}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Limits */}
              <div className="space-y-8">
                <div className="card p-8">
                  <h3 className="text-xl font-semibold mb-6">Operational Limits</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maximum Altitude:</span>
                      <span className="font-medium">{kcaaInfo.operationalLimits.maxAltitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Day Operations:</span>
                      <span className="font-medium text-green-600">{kcaaInfo.operationalLimits.dayOperations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Night Operations:</span>
                      <span className="font-medium text-yellow-600">{kcaaInfo.operationalLimits.nightOperations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">BVLOS Operations:</span>
                      <span className="font-medium text-yellow-600">{kcaaInfo.operationalLimits.beyondVisualLineOfSight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Over People:</span>
                      <span className="font-medium text-yellow-600">{kcaaInfo.operationalLimits.overPeople}</span>
                    </div>
                  </div>
                </div>

                <div className="card p-8">
                  <h3 className="text-xl font-semibold mb-6">Company Certifications</h3>
                  <div className="space-y-3">
                    {companyInfo.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="text-primary">
                          <IconCertificate />
                        </div>
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* KCAA Logo Section */}
            <div className="text-center mt-16">
              <div className="bg-gray-50 rounded-2xl p-8 inline-block">
                <Image
                  src="/kcaa-logo.png"
                  alt="Kenya Civil Aviation Authority (KCAA)"
                  width={200}
                  height={100}
                  className="mx-auto mb-4"
                />
                <p className="text-gray-600 max-w-md">
                  Certified and regulated by the Kenya Civil Aviation Authority, ensuring the highest standards of safety and professionalism in all our operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary to-red-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Work with Kenya's Leading Drone Experts?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join hundreds of satisfied clients who trust Vantage Vertical for their aerial intelligence needs. Let's discuss how we can help transform your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-secondary bg-white text-primary hover:bg-gray-100">
              Get Started Today
            </Link>
            <Link href="/portfolio" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}