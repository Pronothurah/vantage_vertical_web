'use client';

import { useState } from 'react';

interface DroneFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  inStock: boolean;
  features: string[];
}

export default function DroneFilters({ onFilterChange }: DroneFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 3000000],
    sortBy: 'featured',
    inStock: false,
    features: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'agricultural', label: 'Agricultural' },
    { value: 'surveillance', label: 'Surveillance' },
    { value: 'mapping', label: 'Mapping' },
    { value: 'photography', label: 'Photography' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' }
  ];

  const availableFeatures = [
    'RTK Positioning',
    'Thermal Imaging',
    '4K Video',
    'Obstacle Avoidance',
    'Long Flight Time',
    'Weather Resistant',
    'Professional Camera',
    'Precision Spraying'
  ];

  const priceRanges = [
    { label: 'Under KES 200K', min: 0, max: 200000 },
    { label: 'KES 200K - 500K', min: 200000, max: 500000 },
    { label: 'KES 500K - 1M', min: 500000, max: 1000000 },
    { label: 'KES 1M - 2M', min: 1000000, max: 2000000 },
    { label: 'Above KES 2M', min: 2000000, max: 5000000 }
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilter('features', newFeatures);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      category: 'all',
      priceRange: [0, 3000000],
      sortBy: 'featured',
      inStock: false,
      features: []
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Quick Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Range
          </label>
          <select
            onChange={(e) => {
              const range = priceRanges.find(r => `${r.min}-${r.max}` === e.target.value);
              if (range) {
                updateFilter('priceRange', [range.min, range.max]);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            <option value="">Select Price Range</option>
            {priceRanges.map(range => (
              <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Availability
          </label>
          <div className="flex items-center h-10">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
        >
          <span>Advanced Filters</span>
          <svg
            className={`ml-2 w-4 h-4 transform transition-transform duration-200 ${
              showAdvanced ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Price Range
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.priceRange[0]}
                      onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.priceRange[1]}
                      onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Current range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </div>
              </div>

              {/* Features Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableFeatures.map(feature => (
                    <label key={feature} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters & Clear */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {categories.find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className="ml-2 hover:text-primary-dark"
                >
                  ×
                </button>
              </span>
            )}
            {filters.inStock && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock Only
                <button
                  onClick={() => updateFilter('inStock', false)}
                  className="ml-2 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.features.map(feature => (
              <span
                key={feature}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {feature}
                <button
                  onClick={() => toggleFeature(feature)}
                  className="ml-2 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Clear All Filters */}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}