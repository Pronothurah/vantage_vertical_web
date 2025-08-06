'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui';
import { imageSizes, imageQuality } from '@/lib/imageUtils';
import { BlogSearchParams } from '@/types/forms';
import { 
  getFilteredAndPaginatedPosts, 
  getBlogCategories, 
  getBlogAuthorById,
  formatReadTime,
  formatPublishDate,
  generateBlogPostUrl,
  getFeaturedBlogPosts
} from '@/lib/blog';
import { blogTags } from '@/data';

interface BlogListingProps {
  searchParams: BlogSearchParams;
}

export default function BlogListing({ searchParams }: BlogListingProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.query || '');
  
  const { posts, pagination } = getFilteredAndPaginatedPosts(searchParams);
  const categories = getBlogCategories();
  const featuredPosts = getFeaturedBlogPosts().slice(0, 3);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ query: searchQuery, page: 1 });
  };
  
  // Handle category filter
  const handleCategoryChange = (category: string) => {
    updateUrl({ category: category === 'all' ? undefined : category, page: 1 });
  };
  
  // Handle tag filter
  const handleTagClick = (tag: string) => {
    updateUrl({ tag, page: 1 });
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    router.push('/blog');
  };
  
  // Update URL with new parameters
  const updateUrl = (newParams: Partial<BlogSearchParams>) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/blog?${params.toString()}`);
  };
  
  const hasActiveFilters = searchParams.query || searchParams.category || searchParams.tag;
  
  return (
    <div className="space-y-12">
      {/* Featured Posts Section - Only show on first page without filters */}
      {!hasActiveFilters && searchParams.page === 1 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => {
              const author = getBlogAuthorById(post.author);
              return (
                <article key={post.id} className="group">
                  <Link href={generateBlogPostUrl(post.slug)} className="block">
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                      <OptimizedImage
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        quality={imageQuality.card}
                        sizes={imageSizes.card}
                        fallbackSrc="/images/placeholder-drone.svg"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatPublishDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{formatReadTime(post.readTime)}</span>
                        <span>•</span>
                        <span>{author?.name}</span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault();
                              handleTagClick(tag);
                            }}
                            className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-2 py-1 rounded transition-colors"
                          >
                            {tag.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}
      
      {/* Search and Filters */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Category Filter */}
          <div className="flex gap-4">
            <select
              value={searchParams.category || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-primary transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchParams.query && (
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                Search: "{searchParams.query}"
              </span>
            )}
            {searchParams.category && searchParams.category !== 'all' && (
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                Category: {categories.find(c => c.id === searchParams.category)?.name}
              </span>
            )}
            {searchParams.tag && (
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                Tag: {searchParams.tag.replace('-', ' ')}
              </span>
            )}
          </div>
        )}
      </section>
      
      {/* Blog Posts Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {hasActiveFilters ? 'Search Results' : 'Latest Articles'}
          </h2>
          <p className="text-gray-600">
            {pagination.totalPosts} article{pagination.totalPosts !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const author = getBlogAuthorById(post.author);
              return (
                <article key={post.id} className="group">
                  <Link href={generateBlogPostUrl(post.slug)} className="block">
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                      <OptimizedImage
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        quality={imageQuality.card}
                        sizes={imageSizes.card}
                        fallbackSrc="/images/placeholder-drone.svg"
                      />
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatPublishDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{formatReadTime(post.readTime)}</span>
                        <span>•</span>
                        <span>{author?.name}</span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault();
                              handleTagClick(tag);
                            }}
                            className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-2 py-1 rounded transition-colors"
                          >
                            {tag.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <section className="flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === pagination.currentPage;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    isActive
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </section>
      )}
      
      {/* Popular Tags */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-xl font-bold mb-6">Popular Topics</h3>
        <div className="flex flex-wrap gap-3">
          {blogTags.slice(0, 10).map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.slug)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                searchParams.tag === tag.slug
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
              }`}
            >
              {tag.name} ({tag.count})
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}