import { BlogPost, BlogCategory, BlogTag, BlogAuthor } from '@/types/forms';
import { blogPosts, blogCategories, blogAuthors } from '@/data';

// Blog Management Utilities
// This provides a foundation for content management that could be extended with a CMS

export interface BlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  published?: boolean;
}

export interface BlogPostUpdate extends Partial<BlogPostInput> {
  id: string;
  updatedAt?: string;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Calculate reading time based on content
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Validate blog post data
export function validateBlogPost(post: BlogPostInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!post.title || post.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!post.excerpt || post.excerpt.trim().length === 0) {
    errors.push('Excerpt is required');
  }

  if (!post.content || post.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!post.author || !blogAuthors.find(author => author.id === post.author)) {
    errors.push('Valid author is required');
  }

  if (!post.category || !blogCategories.find(cat => cat.id === post.category)) {
    errors.push('Valid category is required');
  }

  if (!post.featuredImage || post.featuredImage.trim().length === 0) {
    errors.push('Featured image is required');
  }

  if (!post.tags || post.tags.length === 0) {
    errors.push('At least one tag is required');
  }

  if (post.excerpt && post.excerpt.length > 300) {
    errors.push('Excerpt should be less than 300 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Create new blog post
export function createBlogPost(postData: BlogPostInput): BlogPost {
  const validation = validateBlogPost(postData);
  if (!validation.isValid) {
    throw new Error(`Invalid blog post data: ${validation.errors.join(', ')}`);
  }

  const slug = generateSlug(postData.title);
  const readTime = calculateReadTime(postData.content);
  const now = new Date().toISOString().split('T')[0];

  const newPost: BlogPost = {
    id: Date.now().toString(), // In a real app, use a proper ID generator
    slug,
    title: postData.title,
    excerpt: postData.excerpt,
    content: postData.content,
    author: postData.author,
    publishedAt: now,
    tags: postData.tags,
    category: postData.category,
    featuredImage: postData.featuredImage,
    readTime,
    seoTitle: postData.seoTitle || postData.title,
    seoDescription: postData.seoDescription || postData.excerpt,
    featured: postData.featured || false,
    published: postData.published !== false // Default to true
  };

  return newPost;
}

// Update existing blog post
export function updateBlogPost(updateData: BlogPostUpdate): BlogPost {
  const existingPost = blogPosts.find(post => post.id === updateData.id);
  if (!existingPost) {
    throw new Error('Blog post not found');
  }

  const updatedPost: BlogPost = {
    ...existingPost,
    ...updateData,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  // Recalculate slug if title changed
  if (updateData.title && updateData.title !== existingPost.title) {
    updatedPost.slug = generateSlug(updateData.title);
  }

  // Recalculate read time if content changed
  if (updateData.content && updateData.content !== existingPost.content) {
    updatedPost.readTime = calculateReadTime(updateData.content);
  }

  // Validate updated post
  const validation = validateBlogPost(updatedPost);
  if (!validation.isValid) {
    throw new Error(`Invalid blog post data: ${validation.errors.join(', ')}`);
  }

  return updatedPost;
}

// Delete blog post
export function deleteBlogPost(postId: string): boolean {
  const postIndex = blogPosts.findIndex(post => post.id === postId);
  if (postIndex === -1) {
    return false;
  }

  blogPosts.splice(postIndex, 1);
  return true;
}

// Category management
export function createCategory(name: string, description: string): BlogCategory {
  const slug = generateSlug(name);
  const existingCategory = blogCategories.find(cat => cat.slug === slug);
  
  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  const newCategory: BlogCategory = {
    id: slug,
    name,
    slug,
    description,
    count: 0
  };

  return newCategory;
}

export function updateCategory(categoryId: string, updates: Partial<Pick<BlogCategory, 'name' | 'description'>>): BlogCategory {
  const category = blogCategories.find(cat => cat.id === categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  const updatedCategory = { ...category, ...updates };
  
  // Update slug if name changed
  if (updates.name && updates.name !== category.name) {
    updatedCategory.slug = generateSlug(updates.name);
  }

  return updatedCategory;
}

// Tag management
export function createTag(name: string): BlogTag {
  const slug = generateSlug(name);
  const existingTag = blogTags.find(tag => tag.slug === slug);
  
  if (existingTag) {
    throw new Error('Tag with this name already exists');
  }

  const newTag: BlogTag = {
    id: slug,
    name,
    slug,
    count: 0
  };

  return newTag;
}

export function getPopularTags(limit: number = 10): BlogTag[] {
  return blogTags
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Content statistics
export function getBlogStatistics() {
  const totalPosts = blogPosts.filter(post => post.published).length;
  const totalDrafts = blogPosts.filter(post => !post.published).length;
  const totalCategories = blogCategories.filter(cat => cat.id !== 'all').length;
  const totalTags = blogTags.length;
  const totalAuthors = blogAuthors.length;

  const postsByCategory = blogCategories.map(category => ({
    category: category.name,
    count: category.count
  }));

  const postsByAuthor = blogAuthors.map(author => ({
    author: author.name,
    count: blogPosts.filter(post => post.author === author.id && post.published).length
  }));

  const recentPosts = blogPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return {
    totalPosts,
    totalDrafts,
    totalCategories,
    totalTags,
    totalAuthors,
    postsByCategory,
    postsByAuthor,
    recentPosts
  };
}

// Search and filtering utilities
export function searchPosts(query: string, options?: {
  includeUnpublished?: boolean;
  category?: string;
  author?: string;
  tags?: string[];
}): BlogPost[] {
  let posts = options?.includeUnpublished ? blogPosts : blogPosts.filter(post => post.published);

  // Apply filters
  if (options?.category) {
    posts = posts.filter(post => post.category === options.category);
  }

  if (options?.author) {
    posts = posts.filter(post => post.author === options.author);
  }

  if (options?.tags && options.tags.length > 0) {
    posts = posts.filter(post => 
      options.tags!.some(tag => post.tags.includes(tag))
    );
  }

  // Apply search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Export utilities for markdown-based content management
export function generateMarkdownFrontmatter(post: BlogPost): string {
  return `---
title: "${post.title}"
excerpt: "${post.excerpt}"
author: "${post.author}"
publishedAt: "${post.publishedAt}"
${post.updatedAt ? `updatedAt: "${post.updatedAt}"` : ''}
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
category: "${post.category}"
featuredImage: "${post.featuredImage}"
readTime: ${post.readTime}
seoTitle: "${post.seoTitle}"
seoDescription: "${post.seoDescription}"
featured: ${post.featured}
published: ${post.published}
---

${post.content}`;
}

export function parseMarkdownFrontmatter(markdown: string): { frontmatter: Partial<BlogPost>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const [, frontmatterStr, content] = match;
  const frontmatter: Partial<BlogPost> = {};

  // Parse frontmatter (basic YAML parsing)
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      const cleanKey = key.trim() as keyof BlogPost;
      
      // Parse different value types
      if (value.startsWith('[') && value.endsWith(']')) {
        // Array
        frontmatter[cleanKey] = value
          .slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/"/g, '')) as any;
      } else if (value === 'true' || value === 'false') {
        // Boolean
        frontmatter[cleanKey] = (value === 'true') as any;
      } else if (!isNaN(Number(value))) {
        // Number
        frontmatter[cleanKey] = Number(value) as any;
      } else {
        // String
        frontmatter[cleanKey] = value.replace(/"/g, '') as any;
      }
    }
  });

  return { frontmatter, content: content.trim() };
}

// Import the blogTags from data (needed for the functions above)
import { blogTags } from '@/data';