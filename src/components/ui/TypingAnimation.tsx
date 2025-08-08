'use client';

import { useState, useEffect, useRef } from 'react';

interface TypingAnimationProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
}

export default function TypingAnimation({
  text,
  className = '',
  typingSpeed = 150,
  pauseDuration = 3000,
  deletingSpeed = 75,
  loop = true
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setShouldAnimate(false);
      setDisplayText(text);
      return;
    }

    const animate = () => {
      if (isTyping) {
        // Typing phase
        if (currentIndexRef.current < text.length) {
          setDisplayText(text.slice(0, currentIndexRef.current + 1));
          currentIndexRef.current++;
          timeoutRef.current = setTimeout(animate, typingSpeed);
        } else {
          // Finished typing, pause before deleting
          setIsTyping(false);
          timeoutRef.current = setTimeout(animate, pauseDuration);
        }
      } else {
        // Deleting phase
        if (currentIndexRef.current > 0) {
          currentIndexRef.current--;
          setDisplayText(text.slice(0, currentIndexRef.current));
          timeoutRef.current = setTimeout(animate, deletingSpeed);
        } else {
          // Finished deleting, start typing again if loop is enabled
          if (loop) {
            setIsTyping(true);
            timeoutRef.current = setTimeout(animate, typingSpeed);
          }
        }
      }
    };

    // Start animation
    timeoutRef.current = setTimeout(animate, typingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, typingSpeed, pauseDuration, deletingSpeed, loop, isTyping]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!shouldAnimate) {
    return (
      <span className={className} aria-label={text}>
        {text}
      </span>
    );
  }

  return (
    <span 
      className={`typing-animation-container ${className}`}
      aria-label={text}
      aria-live="polite"
    >
      <span className="typing-text">
        {displayText}
      </span>
      <span 
        className="typing-cursor text-primary"
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}