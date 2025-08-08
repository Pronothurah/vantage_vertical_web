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
      // Convert headers with improved hierarchy classes
      .replace(/^# (.*$)/gim, '<h1 class="blog-content-h1">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="blog-content-h2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="blog-content-h3">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="blog-content-h4">$1</h4>')
      
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="blog-content-strong">$1</strong>')
      
      // Convert italic text
      .replace(/\*(.*?)\*/g, '<em class="blog-content-em">$1</em>')
      
      // Convert links with improved accessibility
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="blog-content-link" target="_blank" rel="noopener noreferrer" aria-label="External link: $1">$1</a>')
      
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.startsWith('<h') || paragraph.startsWith('<ul') || paragraph.startsWith('<ol')) {
          return paragraph;
        }
        return `<p class="blog-content-paragraph">${paragraph.trim()}</p>`;
      })
      .join('\n');

    setProcessedContent(processed);
  }, [content]);

  return (
    <div className="blog-content-wrapper" role="document">
      <div 
        className="blog-content-text"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      
      <style jsx>{`
        .blog-content-wrapper {
          line-height: 1.8;
        }
        
        .blog-content-text h1:first-child {
          margin-top: 0;
        }
        
        /* Typography hierarchy with consistent spacing */
        .blog-content-text .blog-content-h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.5rem;
          margin-top: 2rem;
          line-height: 1.2;
          font-family: var(--font-urbanist);
        }
        
        .blog-content-text .blog-content-h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
          margin-top: 2rem;
          line-height: 1.3;
          font-family: var(--font-urbanist);
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 0.5rem;
        }
        
        .blog-content-text .blog-content-h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
          line-height: 1.4;
          font-family: var(--font-urbanist);
        }
        
        .blog-content-text .blog-content-h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
          line-height: 1.4;
          font-family: var(--font-urbanist);
        }
        
        .blog-content-text .blog-content-paragraph {
          margin-bottom: 1.5rem;
          color: #374151;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        
        .blog-content-text .blog-content-strong {
          color: #111827;
          font-weight: 600;
        }
        
        .blog-content-text .blog-content-em {
          font-style: italic;
          color: #4b5563;
        }
        
        .blog-content-text .blog-content-link {
          color: #D72638;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }
        
        .blog-content-text .blog-content-link:hover {
          text-decoration: underline;
          border-bottom-color: #D72638;
        }
        
        .blog-content-text .blog-content-link:focus {
          outline: 2px solid #D72638;
          outline-offset: 2px;
          border-radius: 2px;
        }
        
        /* Lists with improved spacing */
        .blog-content-text ul,
        .blog-content-text ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .blog-content-text li {
          margin-bottom: 0.5rem;
          color: #374151;
          line-height: 1.7;
        }
        
        /* Blockquotes with enhanced styling */
        .blog-content-text blockquote {
          border-left: 4px solid #D72638;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          position: relative;
        }
        
        .blog-content-text blockquote::before {
          content: '"';
          font-size: 3rem;
          color: #D72638;
          position: absolute;
          top: 0.5rem;
          left: 1rem;
          font-family: serif;
          opacity: 0.3;
        }
        
        /* Code styling with improved readability */
        .blog-content-text code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }
        
        .blog-content-text pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
          border: 1px solid #374151;
        }
        
        .blog-content-text pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
          border: none;
        }
        
        /* Images with improved layout */
        .blog-content-text img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Tables with enhanced styling */
        .blog-content-text table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .blog-content-text th,
        .blog-content-text td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .blog-content-text th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #111827;
        }
        
        .blog-content-text tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        /* Horizontal rules */
        .blog-content-text hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 3rem 0;
          border-radius: 1px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .blog-content-text .blog-content-h1 {
            font-size: 2rem;
          }
          
          .blog-content-text .blog-content-h2 {
            font-size: 1.75rem;
          }
          
          .blog-content-text .blog-content-h3 {
            font-size: 1.375rem;
          }
          
          .blog-content-text .blog-content-h4 {
            font-size: 1.125rem;
          }
          
          .blog-content-text .blog-content-paragraph {
            font-size: 1rem;
          }
          
          .blog-content-text ul,
          .blog-content-text ol {
            padding-left: 1.5rem;
          }
          
          .blog-content-text blockquote {
            padding: 1rem;
            margin: 1.5rem 0;
          }
          
          .blog-content-text pre {
            padding: 1rem;
            margin: 1.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}