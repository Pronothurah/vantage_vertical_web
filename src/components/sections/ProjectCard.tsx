'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PortfolioProject } from '@/types/forms';

interface ProjectCardProps {
  project: PortfolioProject;
  onViewDetails: (project: PortfolioProject) => void;
}

export default function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mapping':
        return 'bg-blue-100 text-blue-800';
      case 'surveillance':
        return 'bg-red-100 text-red-800';
      case 'agritech':
        return 'bg-green-100 text-green-800';
      case 'commercial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden">
        {!imageError ? (
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(project.category)}`}>
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Project Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* Client and Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="mr-4">{project.client}</span>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{project.location}</span>
        </div>

        {/* Project Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Key Results */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Results:</h4>
          <div className="grid grid-cols-2 gap-2">
            {project.results.slice(0, 2).map((result, index) => (
              <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-primary">{result.value}</div>
                <div className="text-xs text-gray-600">{result.metric}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{formatDate(project.date)}</span>
          <span>{project.duration}</span>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(project)}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
        >
          View Project Details
        </button>
      </div>
    </div>
  );
}