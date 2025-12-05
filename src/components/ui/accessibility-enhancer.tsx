import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AccessibilityEnhancerProps {
  children: React.ReactNode;
  className?: string;
  focusTrap?: boolean;
  autoFocus?: boolean;
  skipToContent?: boolean;
  announceChanges?: boolean;
  liveRegion?: 'polite' | 'assertive' | 'off';
}

const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({
  children,
  className,
  focusTrap = false,
  autoFocus = false,
  skipToContent = false,
  announceChanges = false,
  liveRegion = 'polite'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const [isFocusTrapped, setIsFocusTrapped] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto focus first focusable element
    if (autoFocus) {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // Focus trap implementation
    if (focusTrap) {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);
      setIsFocusTrapped(true);

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
        setIsFocusTrapped(false);
      };
    }
  }, [focusTrap, autoFocus]);

  // Announce changes to screen readers
  const announceToScreenReader = (message: string) => {
    if (announceChanges && liveRegion !== 'off') {
      setAnnouncement(message);
      // Clear announcement after a delay
      setTimeout(() => setAnnouncement(''), 1000);
    }
  };

  // Skip to content functionality
  const handleSkipToContent = () => {
    const mainContent = document.querySelector('main') as HTMLElement;
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      announceToScreenReader('Przeskoczono do głównej treści');
    }
  };

  return (
    <>
      {/* Skip to content link */}
      {skipToContent && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-reno-purple text-white px-4 py-2 rounded-lg z-50"
          onClick={handleSkipToContent}
        >
          Przejdź do głównej treści
        </a>
      )}

      {/* Live region for announcements */}
      {announceChanges && liveRegion !== 'off' && (
        <div
          aria-live={liveRegion}
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {announcement}
        </div>
      )}

      {/* Main container */}
      <div
        ref={containerRef}
        className={cn(
          "accessibility-enhanced",
          isFocusTrapped && "focus-trap-active",
          className
        )}
        role={focusTrap ? "dialog" : undefined}
        aria-modal={focusTrap ? "true" : undefined}
      >
        {children}
      </div>
    </>
  );
};

// Accessibility utilities
export const accessibilityUtils = {
  // Announce to screen reader
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Focus management
  focusFirst: (container: HTMLElement) => {
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  },

  focusLast: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
    }
  },

  // Keyboard navigation helpers
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        onIndexChange(nextIndex);
        items[nextIndex]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        onIndexChange(prevIndex);
        items[prevIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        onIndexChange(0);
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        onIndexChange(items.length - 1);
        items[items.length - 1]?.focus();
        break;
    }
  },

  // High contrast mode detection
  isHighContrastMode: () => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },

  // Reduced motion detection
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Color scheme detection
  getColorScheme: () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
};

export default AccessibilityEnhancer;


