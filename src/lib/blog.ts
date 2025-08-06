import { BlogPost, BlogCategory, BlogSearchParams, BlogPagination } from '@/types/forms';
import { blogPosts, blogCategories, blogAuthors } from '@/data';

// Blog utility functions

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.published).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter(post => post.featured);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug && post.published);
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  if (categorySlug === 'all') {
    return getAllBlogPosts();
  }
  return getAllBlogPosts().filter(post => post.category === categorySlug);
}

export function getBlogPostsByTag(tagSlug: string): BlogPost[] {
  return getAllBlogPosts().filter(post => 
    post.tags.some(tag => tag === tagSlug)
  );
}

export function searchBlogPosts(query: string): BlogPost[] {
  const searchTerm = query.toLowerCase();
  return getAllBlogPosts().filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function paginateBlogPosts(
  posts: BlogPost[], 
  page: number = 1, 
  limit: number = 6
): { posts: BlogPost[]; pagination: BlogPagination } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(posts.length / limit);
  
  return {
    posts: paginatedPosts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts: posts.length,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export function getFilteredAndPaginatedPosts(params: BlogSearchParams) {
  let posts = getAllBlogPosts();
  
  // Apply search filter
  if (params.query) {
    posts = searchBlogPosts(params.query);
  }
  
  // Apply category filter
  if (params.category && params.category !== 'all') {
    posts = posts.filter(post => post.category === params.category);
  }
  
  // Apply tag filter
  if (params.tag) {
    posts = posts.filter(post => post.tags.includes(params.tag!));
  }
  
  // Apply pagination
  return paginateBlogPosts(posts, params.page || 1, params.limit || 6);
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const allPosts = getAllBlogPosts().filter(post => post.id !== currentPost.id);
  
  // Score posts based on shared tags and category
  const scoredPosts = allPosts.map(post => {
    let score = 0;
    
    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 3;
    }
    
    // Shared tags get points
    const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
    score += sharedTags.length;
    
    return { post, score };
  });
  
  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

export function getBlogAuthorById(authorId: string) {
  return blogAuthors.find(author => author.id === authorId);
}

export function getBlogCategories(): BlogCategory[] {
  return blogCategories;
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export function formatPublishDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateBlogPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function generateCategoryUrl(categorySlug: string): string {
  return `/blog?category=${categorySlug}`;
}

export function generateTagUrl(tagSlug: string): string {
  return `/blog?tag=${tagSlug}`;
}