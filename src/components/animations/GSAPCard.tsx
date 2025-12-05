import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  hover?: 'lift' | 'glow' | 'scale' | 'none';
  trigger?: 'scroll' | 'hover' | 'both';
}

const GSAPCard = React.forwardRef<HTMLDivElement, GSAPCardProps>(
  ({ className, children, delay = 0, hover = 'lift', trigger = 'both', ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;

      const ctx = gsap.context(() => {
        // Initial state
        gsap.set(card, {
          opacity: 0,
          y: 50,
          scale: 0.95
        });

        // Scroll trigger animation
        if (trigger === 'scroll' || trigger === 'both') {
          ScrollTrigger.create({
            trigger: card,
            start: "top bottom-=100",
            onEnter: () => {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: delay * 0.1,
                ease: "power3.out"
              });
            }
          });
        } else {
          // Immediate animation
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: delay * 0.1,
            ease: "power3.out"
          });
        }

        // Hover animations
        if (trigger === 'hover' || trigger === 'both') {
          const hoverAnimations = {
            lift: () => {
              gsap.to(card, {
                y: -8,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
              });
            },
            glow: () => {
              gsap.to(card, {
                boxShadow: "0 0 30px rgba(90, 75, 255, 0.4)",
                duration: 0.3,
                ease: "power2.out"
              });
            },
            scale: () => {
              gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
              });
            },
            none: () => {}
          };

          const resetAnimations = {
            lift: () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            },
            glow: () => {
              gsap.to(card, {
                boxShadow: "0 0 0 rgba(90, 75, 255, 0)",
                duration: 0.3,
                ease: "power2.out"
              });
            },
            scale: () => {
              gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            },
            none: () => {}
          };

          card.addEventListener('mouseenter', hoverAnimations[hover]);
          card.addEventListener('mouseleave', resetAnimations[hover]);

          return () => {
            card.removeEventListener('mouseenter', hoverAnimations[hover]);
            card.removeEventListener('mouseleave', resetAnimations[hover]);
          };
        }
      }, card);

      return () => ctx.revert();
    }, [delay, hover, trigger]);

    return (
      <Card
        ref={cardRef}
        className={cn("glass-card border-white/10", className)}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

GSAPCard.displayName = "GSAPCard";

// Enhanced card components with GSAP animations
const GSAPCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
GSAPCardHeader.displayName = "GSAPCardHeader";

const GSAPCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
GSAPCardTitle.displayName = "GSAPCardTitle";

const GSAPCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
GSAPCardDescription.displayName = "GSAPCardDescription";

const GSAPCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
GSAPCardContent.displayName = "GSAPCardContent";

export { GSAPCard, GSAPCardHeader, GSAPCardTitle, GSAPCardDescription, GSAPCardContent };


