import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { droneProducts } from '@/data';
import { generateMetadata as generateSEOMetadata, generateProductSchema } from '@/lib/seo';
import { DroneInquiryForm } from '@/components/forms';

interface DroneDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: DroneDetailPageProps): Promise<Metadata> {
  const drone = droneProducts.find(p => p.id === params.id);
  
  if (!drone) {
    return {
      title: 'Drone Not Found - Vantage Vertical',
      description: 'The requested drone product could not be found.',
    };
  }

  return generateSEOMetadata({
    title: `${drone.name} - Professional Drone for Sale`,
    description: `${drone.description} Buy ${drone.name} in Kenya with expert support, training, and warranty. ${drone.features.slice(0, 3).join(', ')}.`,
    keywords: [drone.name, drone.brand, `${drone.category} drone`, 'buy drone Kenya', ...drone.tags],
    openGraph: {
      title: `${drone.name} - Professional Drone for Sale`,
      description: `${drone.description} Buy ${drone.name} in Kenya with expert support.`,
      image: drone.featuredImage,
      type: 'product',
    },
  });
}

export async function generateStaticParams() {
  return droneProducts.map((drone) => ({
    id: drone.id,
  }));
}

export default function DroneDetailPage({ params }: DroneDetailPageProps) {
  const drone = droneProducts.find(p => p.id === params.id);

  if (!drone) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const relatedDrones = droneProducts
    .filter(p => p.id !== drone.id && p.category === drone.category)
    .slice(0, 3);

  // Generate product structured data
  const productSchema = generateProductSchema({
    name: drone.name,
    description: drone.description,
    image: drone.featuredImage,
    brand: drone.brand,
    price: drone.price,
    currency: 'KES',
    availability: drone.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    condition: 'https://schema.org/NewCondition',
    url: `/drones/${drone.id}`,
    category: drone.category,
    features: drone.features,
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      
      <main>
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/drones" className="text-gray-500 hover:text-primary transition-colors duration-200">
              Drones
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{drone.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={drone.featuredImage}
                  alt={drone.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {drone.featured && (
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                  {drone.bestSeller && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Best Seller
                    </span>
                  )}
                  {drone.originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Sale
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    drone.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {drone.inStock ? `In Stock (${drone.stockLevel} available)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {drone.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity duration-200">
                    <Image
                      src={image}
                      alt={`${drone.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  {drone.brand}
                </span>
                <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                  {drone.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900">
                {drone.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(drone.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {drone.rating} out of 5 ({drone.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(drone.price)}
                  </span>
                  {drone.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(drone.originalPrice)}
                    </span>
                  )}
                </div>
                {drone.originalPrice && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-red-600">
                      Save {formatPrice(drone.originalPrice - drone.price)}
                    </span>
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      {Math.round(((drone.originalPrice - drone.price) / drone.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {drone.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {drone.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                  {drone.applications.map((app, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certification */}
              {drone.certification && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center text-green-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">{drone.certification}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Link
                    href={`/contact?service=drone-sales&product=${drone.id}`}
                    className="flex-1 btn-primary text-center py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    Get Quote & Consultation
                  </Link>
                  <button className="btn-secondary py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105">
                    Add to Compare
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Free consultation
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    KCAA compliance
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Flexible payment
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Specifications */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Technical Specifications
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(drone.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
                What's Included
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <ul className="space-y-2">
                  {drone.features.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drone Inquiry Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title mb-4">
                Interested in the <span className="text-gradient">{drone.name}</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get personalized recommendations, pricing, and expert consultation for your specific needs. 
                Our team will help you make the right choice.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <DroneInquiryForm 
                variant="full" 
                preselectedDroneId={drone.id}
                className="max-w-3xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedDrones.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-section-title mb-4">
                Similar <span className="text-gradient">Drones</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore other {drone.category} drones that might interest you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedDrones.map((relatedDrone, index) => (
                <div
                  key={relatedDrone.id}
                  className="group bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={relatedDrone.featuredImage}
                      alt={relatedDrone.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                      {relatedDrone.brand}
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                      <Link href={`/drones/${relatedDrone.id}`}>
                        {relatedDrone.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedDrone.shortDescription}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(relatedDrone.price)}
                      </span>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(relatedDrone.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          {relatedDrone.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/contact?service=drone-sales&product=${relatedDrone.id}`}
                        className="flex-1 btn-primary text-center py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        Get Quote
                      </Link>
                      <Link
                        href={`/drones/${relatedDrone.id}`}
                        className="flex-1 btn-secondary text-center py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
    </>
  );
}