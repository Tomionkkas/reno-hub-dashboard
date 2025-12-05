import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPScrollTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  trigger?: string;
  start?: string;
  end?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'custom';
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  className?: string;
}

const GSAPScrollTrigger: React.FC<GSAPScrollTriggerProps> = ({
  children,
  trigger,
  start = "top bottom-=100",
  end = "bottom top+=100",
  animation = 'fadeIn',
  duration = 0.8,
  delay = 0,
  ease = "power3.out",
  stagger = 0,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
  scrub = false,
  markers = false,
  toggleActions = "play none none reverse",
  className,
  ...props
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let scrollTrigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      // Set initial state based on animation type
      const setInitialState = () => {
        switch (animation) {
          case 'fadeIn':
            gsap.set(element, { opacity: 0 });
            break;
          case 'slideUp':
            gsap.set(element, { opacity: 0, y: 50 });
            break;
          case 'slideLeft':
            gsap.set(element, { opacity: 0, x: -50 });
            break;
          case 'slideRight':
            gsap.set(element, { opacity: 0, x: 50 });
            break;
          case 'scale':
            gsap.set(element, { opacity: 0, scale: 0.8 });
            break;
          case 'rotate':
            gsap.set(element, { opacity: 0, rotation: 15 });
            break;
          default:
            gsap.set(element, { opacity: 0, y: 30 });
        }
      };

      setInitialState();

      // Create scroll trigger
      scrollTrigger = ScrollTrigger.create({
        trigger: trigger || element,
        start,
        end,
        scrub,
        markers,
        toggleActions,
        onEnter: () => {
          const animateTo = () => {
            switch (animation) {
              case 'fadeIn':
                return { opacity: 1 };
              case 'slideUp':
                return { opacity: 1, y: 0 };
              case 'slideLeft':
                return { opacity: 1, x: 0 };
              case 'slideRight':
                return { opacity: 1, x: 0 };
              case 'scale':
                return { opacity: 1, scale: 1 };
              case 'rotate':
                return { opacity: 1, rotation: 0 };
              default:
                return { opacity: 1, y: 0 };
            }
          };

          gsap.to(element, {
            ...animateTo(),
            duration,
            delay,
            ease,
            stagger: stagger > 0 ? stagger : undefined
          });
          onEnter?.();
        },
        onLeave: () => {
          if (toggleActions.includes('reverse')) {
            setInitialState();
          }
          onLeave?.();
        },
        onEnterBack: () => {
          if (toggleActions.includes('reverse')) {
            const animateTo = () => {
              switch (animation) {
                case 'fadeIn':
                  return { opacity: 1 };
                case 'slideUp':
                  return { opacity: 1, y: 0 };
                case 'slideLeft':
                  return { opacity: 1, x: 0 };
                case 'slideRight':
                  return { opacity: 1, x: 0 };
                case 'scale':
                  return { opacity: 1, scale: 1 };
                case 'rotate':
                  return { opacity: 1, rotation: 0 };
                default:
                  return { opacity: 1, y: 0 };
              }
            };

            gsap.to(element, {
              ...animateTo(),
              duration,
              ease
            });
          }
          onEnterBack?.();
        },
        onLeaveBack: () => {
          if (toggleActions.includes('reverse')) {
            setInitialState();
          }
          onLeaveBack?.();
        }
      });
    }, element);

    return () => {
      // Kill ScrollTrigger before context revert
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ctx.revert();
    };
  }, [animation, duration, delay, ease, stagger, trigger, start, end, scrub, markers, toggleActions, onEnter, onLeave, onEnterBack, onLeaveBack]);

  return (
    <div
      ref={elementRef}
      className={cn("gsap-scroll-trigger", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default GSAPScrollTrigger;


