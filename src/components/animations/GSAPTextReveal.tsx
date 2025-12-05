import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPTextRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  type?: 'character' | 'word' | 'line';
  duration?: number;
  stagger?: number;
  ease?: string;
  trigger?: string;
  start?: string;
  end?: string;
  className?: string;
}

const GSAPTextReveal: React.FC<GSAPTextRevealProps> = ({
  children,
  type = 'character',
  duration = 0.8,
  stagger = 0.05,
  ease = "power3.out",
  trigger,
  start = "top bottom-=100",
  end = "bottom top+=100",
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Split text based on type
      const splitText = () => {
        const text = container.textContent || '';
        container.innerHTML = '';

        if (type === 'character') {
          return text.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            container.appendChild(span);
            return span;
          });
        } else if (type === 'word') {
          return text.split(' ').map(word => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.display = 'inline-block';
            span.style.marginRight = '0.25em';
            container.appendChild(span);
            return span;
          });
        } else {
          // Line type
          const lines = text.split('\n');
          return lines.map(line => {
            const div = document.createElement('div');
            div.textContent = line;
            container.appendChild(div);
            return div;
          });
        }
      };

      const elements = splitText();

      // Set initial state
      gsap.set(elements, {
        opacity: 0,
        y: 50,
        scale: 0.8
      });

      // Create scroll trigger
      ScrollTrigger.create({
        trigger: trigger || container,
        start,
        end,
        onEnter: () => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration,
            stagger,
            ease
          });
        },
        onLeave: () => {
          gsap.to(elements, {
            opacity: 0,
            y: -30,
            scale: 0.8,
            duration: 0.3,
            stagger: 0.02
          });
        },
        onEnterBack: () => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration,
            stagger,
            ease
          });
        },
        onLeaveBack: () => {
          gsap.to(elements, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.3,
            stagger: 0.02
          });
        }
      });

    }, container);

    return () => ctx.revert();
  }, [children, type, duration, stagger, ease, trigger, start, end]);

  return (
    <div
      ref={containerRef}
      className={cn("gsap-text-reveal", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default GSAPTextReveal;


