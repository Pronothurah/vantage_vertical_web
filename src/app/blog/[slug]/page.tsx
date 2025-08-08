import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui';
import { imageSizes, imageQuality } from '@/lib/imageUtils';
import { 
  getBlogPostBySlug, 
  getBlogAuthorById, 
  getRelatedPosts,
  formatPublishDate,
  formatReadTime,
  generateBlogPostUrl,
  generateCategoryUrl,
  generateTagUrl,
  getAllBlogPosts
} from '@/lib/blog';
import { generateMetadata as generateSEOMetadata, generateArticleSchema } from '@/lib/seo';
import { blogCategories } from '@/data';
import BlogPostContent from '@/components/sections/BlogPostContent';
import FeaturedImageSection from '@/components/sections/FeaturedImageSection';
import SocialShare from '@/components/sections/SocialShare';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const author = getBlogAuthorById(post.author);
  
  return generateSEOMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.tags,
    canonical: `/blog/${post.slug}`,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      image: post.featuredImage,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      author: author?.name,
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      image: post.featuredImage,
      creator: author?.socialLinks?.twitter || '@vantagevertical',
    },
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const author = getBlogAuthorById(post.author);
  const relatedPosts = getRelatedPosts(post);
  const category = blogCategories.find(cat => cat.id === post.category);
  
  // Generate structured data using the SEO utility
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    author: author?.name || 'Vantage Vertical',
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt || post.publishedAt,
    image: post.featuredImage,
    url: `https://vantagevertical.co.ke/blog/${post.slug}`,
    keywords: post.tags,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <main className="min-h-screen">
        {/* Breadcrumb Navigation */}
        <section className="bg-gray-50 py-4">
          <div className="container-custom">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <header className="section-padding" role="banner">
          <div className="blog-header-container">
            {/* Title Area */}
            <section className="blog-title-section" aria-labelledby="blog-title">
              {/* Category Badge */}
              {category && (
                <nav aria-label="Article category">
                  <Link
                    href={generateCategoryUrl(category.slug)}
                    className="blog-category-badge"
                    aria-label={`View all posts in ${category.name} category`}
                  >
                    {category.name}
                  </Link>
                </nav>
              )}
              
              {/* Title */}
              <h1 id="blog-title" className="blog-title px-2 sm:px-0">
                {post.title}
              </h1>
              
              {/* Excerpt */}
              <p className="blog-excerpt px-2 sm:px-0" role="doc-subtitle">
                {post.excerpt}
              </p>
            </section>
            
            {/* Featured Image */}
            <section className="blog-image-section" aria-label="Featured image">
              <FeaturedImageSection
                src={post.featuredImage}
                alt={post.title}
                title={post.title}
                priority
                className="blog-image-loading"
              />
            </section>
            
            {/* Meta/Social Area */}
            <section className="blog-meta-section" aria-label="Article metadata and sharing">
              {/* Meta Information */}
              <div className="blog-meta-info px-2 sm:px-0">
                {author && (
                  <div className="blog-author-info" role="doc-credit">
                    <OptimizedImage
                      src={author.avatar}
                      alt={`${author.name} profile picture`}
                      width={40}
                      height={40}
                      className="rounded-full"
                      quality={imageQuality.thumbnail}
                      sizes={imageSizes.avatar}
                      fallbackSrc="/images/placeholder-drone.svg"
                    />
                    <div className="text-left">
                      <p className="blog-author-name">{author.name}</p>
                      <p className="blog-author-role">{author.role}</p>
                    </div>
                  </div>
                )}
                <div className="blog-publish-info" role="doc-biblioentry">
                  <time dateTime={post.publishedAt} aria-label={`Published on ${formatPublishDate(post.publishedAt)}`}>
                    {formatPublishDate(post.publishedAt)}
                  </time>
                  <span aria-hidden="true">•</span>
                  <span aria-label={`Estimated reading time: ${formatReadTime(post.readTime)}`}>
                    {formatReadTime(post.readTime)}
                  </span>
                </div>
              </div>
              
              {/* Social Share */}
              <nav className="px-2 sm:px-0" aria-label="Share this article">
                <SocialShare 
                  url={`https://vantagevertical.co.ke/blog/${post.slug}`}
                  title={post.title}
                  description={post.excerpt}
                  variant="header"
                  size="medium"
                />
              </nav>
            </section>
          </div>
        </header>

        {/* Article Content */}
        <article className="blog-content-section" role="main" aria-labelledby="blog-title">
          <div className="blog-content-container">
            <div className="blog-content-prose">
              <BlogPostContent content={post.content} />
            </div>
          </div>
        </article>

        {/* Tags */}
        <section className="blog-section-divider" aria-label="Article tags">
          <div className="blog-content-container">
            <nav className="blog-tags-container" aria-label="Related topics">
              <span className="blog-tag-label">Tags:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={generateTagUrl(tag)}
                  className="blog-tag-item"
                  aria-label={`View all posts tagged with ${tag.replace('-', ' ')}`}
                >
                  {tag.replace('-', ' ')}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Author Bio */}
        {author && (
          <section className="blog-section-divider" aria-labelledby="author-bio-heading">
            <div className="blog-content-container">
              <div className="blog-author-bio-container">
                <div className="blog-author-bio-content">
                  <OptimizedImage
                    src={author.avatar}
                    alt={`${author.name} profile picture`}
                    width={80}
                    height={80}
                    className="blog-author-avatar"
                    quality={imageQuality.thumbnail}
                    sizes={imageSizes.avatar}
                    fallbackSrc="/images/placeholder-drone.svg"
                  />
                  <div className="blog-author-details">
                    <h3 id="author-bio-heading" className="blog-author-bio-name">
                      {author.name}
                    </h3>
                    <p className="blog-author-bio-role">{author.role}</p>
                    <p className="blog-author-bio-text">{author.bio}</p>
                    {author.socialLinks && (
                      <nav className="blog-author-social-links" aria-label="Author social links">
                        {author.socialLinks.linkedin && (
                          <a
                            href={author.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blog-author-social-link"
                            aria-label={`${author.name} on LinkedIn`}
                          >
                            LinkedIn
                          </a>
                        )}
                        {author.socialLinks.email && (
                          <a
                            href={`mailto:${author.socialLinks.email}`}
                            className="blog-author-social-link"
                            aria-label={`Email ${author.name}`}
                          >
                            Email
                          </a>
                        )}
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="blog-section-divider" aria-labelledby="related-posts-heading">
            <div className="blog-related-posts-container">
              <h2 id="related-posts-heading" className="blog-related-posts-title">
                Related Articles
              </h2>
              <div className="blog-related-posts-grid" role="list">
                {relatedPosts.map((relatedPost) => {
                  const relatedAuthor = getBlogAuthorById(relatedPost.author);
                  return (
                    <article key={relatedPost.id} className="blog-related-post-card group" role="listitem">
                      <Link 
                        href={generateBlogPostUrl(relatedPost.slug)} 
                        className="block"
                        aria-label={`Read article: ${relatedPost.title}`}
                      >
                        <div className="blog-related-post-image">
                          <OptimizedImage
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            quality={imageQuality.card}
                            sizes={imageSizes.card}
                            fallbackSrc="/images/placeholder-drone.svg"
                          />
                        </div>
                        <div className="blog-related-post-content">
                          <div className="blog-related-post-meta">
                            <time dateTime={relatedPost.publishedAt}>
                              {formatPublishDate(relatedPost.publishedAt)}
                            </time>
                            <span aria-hidden="true">•</span>
                            <span>{formatReadTime(relatedPost.readTime)}</span>
                          </div>
                          <h3 className="blog-related-post-title">
                            {relatedPost.title}
                          </h3>
                          <p className="blog-related-post-excerpt">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="blog-cta-section" aria-labelledby="cta-heading">
          <div className="container-custom blog-cta-container">
            <h2 id="cta-heading" className="blog-cta-title">
              Ready to Transform Your Operations?
            </h2>
            <p className="blog-cta-description">
              Contact Vantage Vertical to discuss how our drone services can benefit your business.
            </p>
            <Link
              href="/contact"
              className="blog-cta-button"
              aria-label="Contact Vantage Vertical to get started"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}