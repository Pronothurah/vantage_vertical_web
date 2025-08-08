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
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            {/* Title Area */}
            <div className="text-center blog-section-lg">
              {/* Category Badge */}
              {category && (
                <Link
                  href={generateCategoryUrl(category.slug)}
                  className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium blog-section-md hover:bg-red-700 transition-colors"
                >
                  {category.name}
                </Link>
              )}
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold blog-section-md leading-tight">
                {post.title}
              </h1>
              
              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-0 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            
            {/* Featured Image */}
            <FeaturedImageSection
              src={post.featuredImage}
              alt={post.title}
              title={post.title}
              priority
            />
            
            {/* Meta/Social Area */}
            <div className="text-center blog-section-lg">
              {/* Meta Information */}
              <div className="flex flex-wrap justify-center items-center blog-meta-gap text-gray-600 blog-section-md">
                {author && (
                  <div className="flex items-center gap-3">
                    <OptimizedImage
                      src={author.avatar}
                      alt={author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                      quality={imageQuality.thumbnail}
                      sizes={imageSizes.avatar}
                      fallbackSrc="/images/placeholder-drone.svg"
                    />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{author.name}</p>
                      <p className="text-sm">{author.role}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span>{formatPublishDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{formatReadTime(post.readTime)}</span>
                </div>
              </div>
              
              {/* Social Share */}
              <SocialShare 
                url={`https://vantagevertical.co.ke/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-8 md:pb-12">
          <div className="container-custom max-w-4xl">
            <BlogPostContent content={post.content} />
          </div>
        </section>

        {/* Tags */}
        <section className="border-t border-gray-200 py-6 md:py-8">
          <div className="container-custom max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <span className="text-gray-600 font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={generateTagUrl(tag)}
                  className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {tag.replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Author Bio */}
        {author && (
          <section className="border-t border-gray-200 py-6 md:py-8">
            <div className="container-custom max-w-4xl">
              <div className="bg-gray-50 rounded-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <OptimizedImage
                    src={author.avatar}
                    alt={author.name}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto md:mx-0"
                    quality={imageQuality.thumbnail}
                    sizes={imageSizes.avatar}
                    fallbackSrc="/images/placeholder-drone.svg"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">{author.name}</h3>
                    <p className="text-primary font-medium mb-3">{author.role}</p>
                    <p className="text-gray-600 mb-4">{author.bio}</p>
                    {author.socialLinks && (
                      <div className="flex justify-center md:justify-start gap-4">
                        {author.socialLinks.linkedin && (
                          <a
                            href={author.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary transition-colors"
                          >
                            LinkedIn
                          </a>
                        )}
                        {author.socialLinks.email && (
                          <a
                            href={`mailto:${author.socialLinks.email}`}
                            className="text-gray-600 hover:text-primary transition-colors"
                          >
                            Email
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 py-8 md:py-12">
            <div className="container-custom max-w-6xl">
              <h2 className="text-3xl font-bold text-center blog-section-lg">Related Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 blog-card-gap">
                {relatedPosts.map((relatedPost) => {
                  const relatedAuthor = getBlogAuthorById(relatedPost.author);
                  return (
                    <article key={relatedPost.id} className="group">
                      <Link href={generateBlogPostUrl(relatedPost.slug)} className="block">
                        <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
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
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatPublishDate(relatedPost.publishedAt)}</span>
                            <span>•</span>
                            <span>{formatReadTime(relatedPost.readTime)}</span>
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-3">
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
        <section className="bg-primary text-white py-8 md:py-12">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h2>
            <p className="text-xl mb-6 opacity-90">
              Contact Vantage Vertical to discuss how our drone services can benefit your business.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}