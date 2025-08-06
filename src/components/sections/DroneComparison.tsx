'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DroneProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featuredImage: string;
  specifications: Record<string, string | undefined>;
  features: string[];
  applications: string[];
}

interface DroneComparisonProps {
  products: DroneProduct[];
  maxCompare?: number;
}

export default function DroneComparison({ products, maxCompare = 3 }: DroneComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else if (selectedProducts.length < maxCompare) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const compareProducts = products.filter(p => selectedProducts.includes(p.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const comparisonSpecs = [
    { key: 'flightTime', label: 'Flight Time' },
    { key: 'maxSpeed', label: 'Max Speed' },
    { key: 'maxRange', label: 'Max Range' },
    { key: 'camera', label: 'Camera' },
    { key: 'weight', label: 'Weight' },
    { key: 'maxAltitude', label: 'Max Altitude' },
    { key: 'operatingTemp', label: 'Operating Temperature' },
    { key: 'transmissionRange', label: 'Transmission Range' }
  ];

  return (
    <div className="space-y-8">
      {/* Product Selection */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select Drones to Compare (up to {maxCompare})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedProducts.includes(product.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleProduct(product.id)}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-2 right-2">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedProducts.includes(product.id)
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {selectedProducts.includes(product.id) && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Product Image */}
              <div className="relative aspect-[4/3] mb-3 rounded-lg overflow-hidden">
                <Image
                  src={product.featuredImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div>
                <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                  {product.brand}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  {product.name}
                </h4>
                <div className="text-sm font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Disabled Overlay */}
              {selectedProducts.length >= maxCompare && !selectedProducts.includes(product.id) && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-xl flex items-center justify-center">
                  <span className="text-sm text-gray-600 font-medium">
                    Max {maxCompare} selected
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compare Button */}
        {selectedProducts.length >= 2 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowComparison(true)}
              className="btn-primary px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Compare {selectedProducts.length} Drones
            </button>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {showComparison && compareProducts.length >= 2 && (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Drone Comparison
              </h3>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900 w-48">
                    Specification
                  </th>
                  {compareProducts.map(product => (
                    <th key={product.id} className="text-center p-4 min-w-64">
                      <div className="space-y-3">
                        {/* Product Image */}
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mx-auto max-w-32">
                          <Image
                            src={product.featuredImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div>
                          <div className="text-xs text-primary font-semibold uppercase tracking-wide">
                            {product.brand}
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {product.name}
                          </h4>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
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
                          <span className="ml-1 text-xs text-gray-600">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Specifications */}
                {comparisonSpecs.map((spec, index) => (
                  <tr key={spec.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-medium text-gray-900">
                      {spec.label}
                    </td>
                    {compareProducts.map(product => (
                      <td key={product.id} className="p-4 text-center text-gray-700">
                        {product.specifications[spec.key] || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Stock Status */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    Stock Status
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Key Features */}
                <tr className="bg-white">
                  <td className="p-4 font-medium text-gray-900 align-top">
                    Key Features
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-1">
                        {product.features.slice(0, 5).map((feature, i) => (
                          <div key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {feature}
                          </div>
                        ))}
                        {product.features.length > 5 && (
                          <div className="text-xs text-gray-500">
                            +{product.features.length - 5} more
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Applications */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 align-top">
                    Best For
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-1">
                        {product.applications.slice(0, 4).map((app, i) => (
                          <div key={i} className="text-xs text-gray-600">
                            • {app}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Action Buttons */}
                <tr className="bg-white">
                  <td className="p-4 font-medium text-gray-900">
                    Actions
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-2">
                        <Link
                          href={`/contact?service=drone-sales&product=${product.id}`}
                          className="block btn-primary py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          Get Quote
                        </Link>
                        <Link
                          href={`/drones/${product.id}`}
                          className="block btn-secondary py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Text */}
      {selectedProducts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Compare Drone Specifications</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Select 2 or more drones from the grid above to compare their specifications, 
            features, and pricing side by side.
          </p>
        </div>
      )}

      {selectedProducts.length === 1 && (
        <div className="text-center py-4">
          <p className="text-gray-600">
            Select at least one more drone to start comparing.
          </p>
        </div>
      )}
    </div>
  );
}