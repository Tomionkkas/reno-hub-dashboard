
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = Date.now();
    const renderTime = mountTime.current - renderStartTime.current;
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${renderTime}ms`);
    }
    
    // Track performance metrics
    if ('performance' in window && 'measure' in window.performance) {
      try {
        window.performance.mark(`${componentName}-start`);
        window.performance.mark(`${componentName}-end`);
        window.performance.measure(
          `${componentName}-render`,
          `${componentName}-start`,
          `${componentName}-end`
        );
      } catch (error) {
        // Silently fail if performance API is not available
      }
    }
  }, [componentName]);

  // Reset start time on each render
  renderStartTime.current = Date.now();
};

export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
};
