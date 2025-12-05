import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPPerformanceProps {
  children: React.ReactNode;
  autoRefresh?: boolean;
  refreshPriority?: 'high' | 'normal' | 'low';
  batchSize?: number;
  throttleTime?: number;
}

const GSAPPerformance: React.FC<GSAPPerformanceProps> = ({
  children,
  autoRefresh = true,
  refreshPriority = 'normal',
  batchSize = 10,
  throttleTime = 16
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Performance optimizations
    const optimizePerformance = () => {
      // Set GSAP performance settings
      gsap.config({
        nullTargetWarn: false,
        trialWarn: false
      });

      // Optimize ScrollTrigger
      ScrollTrigger.config({
        autoRefreshEvents: autoRefresh ? "visibilitychange,DOMContentLoaded,load" : "none",
        ignoreMobileResize: true,
        syncInterval: throttleTime
      });

      // Batch updates for better performance
      if (refreshPriority === 'high') {
        ScrollTrigger.batch(".gsap-batch", {
          onEnter: (elements) => {
            gsap.fromTo(elements, 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }
            );
          },
          onLeave: (elements) => {
            gsap.to(elements, { opacity: 0, y: -50, duration: 0.3 });
          },
          onEnterBack: (elements) => {
            gsap.to(elements, { opacity: 1, y: 0, duration: 0.6 });
          },
          onLeaveBack: (elements) => {
            gsap.to(elements, { opacity: 0, y: 50, duration: 0.3 });
          }
        });
      }
    };

    optimizePerformance();

    // Auto-refresh ScrollTrigger on window resize
    const handleResize = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        ScrollTrigger.refresh();
      }, throttleTime);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      // Kill all ScrollTriggers when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [autoRefresh, refreshPriority, throttleTime]);

  // Performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const monitorPerformance = () => {
        const triggers = ScrollTrigger.getAll();
        const activeAnimations = gsap.globalTimeline.getChildren();
        
        console.log(`GSAP Performance - Active ScrollTriggers: ${triggers.length}, Active Animations: ${activeAnimations.length}`);
        
        // Warn if too many animations are running
        if (activeAnimations.length > 50) {
          console.warn('GSAP Performance Warning: Too many active animations detected');
        }
      };

      const interval = setInterval(monitorPerformance, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div ref={containerRef} className="gsap-performance-container">
      {children}
    </div>
  );
};

// Utility functions for performance optimization
export const gsapPerformanceUtils = {
  // Debounce function for performance
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for performance
  throttle: (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Batch animation updates
  batchAnimations: (elements: Element[], animation: Function, stagger = 0.1) => {
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < elements.length; i += batchSize) {
      batches.push(elements.slice(i, i + batchSize));
    }
    
    batches.forEach((batch, index) => {
      gsap.delayedCall(index * stagger, () => {
        batch.forEach(element => animation(element));
      });
    });
  },

  // Cleanup all GSAP animations
  cleanup: () => {
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  },

  // Pause all animations
  pauseAll: () => {
    gsap.globalTimeline.pause();
    ScrollTrigger.getAll().forEach(trigger => trigger.disable());
  },

  // Resume all animations
  resumeAll: () => {
    gsap.globalTimeline.resume();
    ScrollTrigger.getAll().forEach(trigger => trigger.enable());
  }
};

export default GSAPPerformance;


