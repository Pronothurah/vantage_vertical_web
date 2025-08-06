'use client';

import { useEffect, useState } from 'react';

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    // Simple markdown-like processing for the content
    // This is a basic implementation - in a real app you might use a library like react-markdown
    const processed = content
      // Convert headers
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold mb-2 mt-4">$1</h4>')
      
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      
      // Convert italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Convert links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.startsWith('<h') || paragraph.startsWith('<ul') || paragraph.startsWith('<ol')) {
          return paragraph;
        }
        return `<p class="mb-6 leading-relaxed text-gray-700">${paragraph.trim()}</p>`;
      })
      .join('\n');

    setProcessedContent(processed);
  }, [content]);

  return (
    <div className="prose prose-lg max-w-none">
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      
      <style jsx>{`
        .blog-content {
          line-height: 1.8;
        }
        
        .blog-content h1:first-child {
          margin-top: 0;
        }
        
        .blog-content p {
          margin-bottom: 1.5rem;
          color: #374151;
          line-height: 1.8;
        }
        
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          color: #111827;
          font-weight: 700;
        }
        
        .blog-content h2 {
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 0.5rem;
        }
        
        .blog-content strong {
          color: #111827;
          font-weight: 600;
        }
        
        .blog-content a {
          color: #D72638;
          text-decoration: none;
        }
        
        .blog-content a:hover {
          text-decoration: underline;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #D72638;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        
        .blog-content th,
        .blog-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .blog-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .blog-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 3rem 0;
        }
      `}</style>
    </div>
  );
}