'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimateOnLoadProps {
  children: React.ReactNode;
  animation?: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'fade-in';
  delay?: 0 | 100 | 200 | 300 | 400;
  className?: string;
  triggerOnScroll?: boolean;
  threshold?: number;
}

export default function AnimateOnLoad({ 
  children, 
  animation = 'fade-in-up', 
  delay = 0,
  className = '',
  triggerOnScroll = true,
  threshold = 0.1
}: AnimateOnLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerOnScroll) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once the element is visible
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px' // Start animation when element is 50px from entering viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [triggerOnScroll, threshold]);

  const getAnimationClass = () => {
    if (!isVisible) {
      // Return base class without animation when not visible
      return '';
    }
    const baseClass = `animate-${animation}`;
    const delayClass = delay > 0 ? `animate-delay-${delay}` : '';
    return `${baseClass} ${delayClass}`.trim();
  };

  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{ 
        opacity: triggerOnScroll && !isVisible ? 0 : undefined,
        transform: triggerOnScroll && !isVisible ? 
          (animation === 'fade-in-up' ? 'translateY(30px)' :
           animation === 'fade-in-left' ? 'translateX(-30px)' :
           animation === 'fade-in-right' ? 'translateX(30px)' : 'none') : undefined
      }}
    >
      {children}
    </div>
  );
}
