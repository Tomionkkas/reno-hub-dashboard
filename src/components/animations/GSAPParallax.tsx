import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  trigger?: string;
  start?: string;
  end?: string;
}

const GSAPParallax: React.FC<GSAPParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  trigger,
  start = "top bottom",
  end = "bottom top",
  className,
  ...props
}) => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = parallaxRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const getTransformValue = () => {
        switch (direction) {
          case 'up':
            return { y: (i, target) => -target.offsetHeight * speed };
          case 'down':
            return { y: (i, target) => target.offsetHeight * speed };
          case 'left':
            return { x: (i, target) => -target.offsetWidth * speed };
          case 'right':
            return { x: (i, target) => target.offsetWidth * speed };
          default:
            return { y: (i, target) => -target.offsetHeight * speed };
        }
      };

      gsap.to(element, {
        ...getTransformValue(),
        ease: "none",
        scrollTrigger: {
          trigger: trigger || element,
          start,
          end,
          scrub: 1
        }
      });
    }, element);

    return () => ctx.revert();
  }, [speed, direction, trigger, start, end]);

  return (
    <div
      ref={parallaxRef}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default GSAPParallax;


