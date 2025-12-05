import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'scroll' | 'typing' | 'loading';
  className?: string;
  disabled?: boolean;
  onInteraction?: () => void;
}

const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'hover',
  className,
  disabled = false,
  onInteraction
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const ctx = gsap.context(() => {
      switch (type) {
        case 'hover':
          const handleHover = () => {
            gsap.to(element, {
              scale: 1.02,
              duration: 0.2,
              ease: "power2.out"
            });
            setIsActive(true);
            onInteraction?.();
          };

          const handleLeave = () => {
            gsap.to(element, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            });
            setIsActive(false);
          };

          element.addEventListener('mouseenter', handleHover);
          element.addEventListener('mouseleave', handleLeave);

          return () => {
            element.removeEventListener('mouseenter', handleHover);
            element.removeEventListener('mouseleave', handleLeave);
          };

        case 'click':
          const handleClick = () => {
            gsap.to(element, {
              scale: 0.95,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.out"
            });
            onInteraction?.();
          };

          element.addEventListener('click', handleClick);
          return () => element.removeEventListener('click', handleClick);

        case 'focus':
          const handleFocus = () => {
            gsap.to(element, {
              boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)",
              duration: 0.2,
              ease: "power2.out"
            });
            setIsActive(true);
            onInteraction?.();
          };

          const handleBlur = () => {
            gsap.to(element, {
              boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)",
              duration: 0.2,
              ease: "power2.out"
            });
            setIsActive(false);
          };

          element.addEventListener('focus', handleFocus);
          element.addEventListener('blur', handleBlur);

          return () => {
            element.removeEventListener('focus', handleFocus);
            element.removeEventListener('blur', handleBlur);
          };

        case 'typing':
          const handleInput = () => {
            gsap.to(element, {
              scale: 1.01,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.out"
            });
            onInteraction?.();
          };

          element.addEventListener('input', handleInput);
          return () => element.removeEventListener('input', handleInput);

        case 'loading':
          // Continuous loading animation
          const tl = gsap.timeline({ repeat: -1 });
          tl.to(element, {
            opacity: 0.7,
            duration: 0.8,
            ease: "power2.inOut"
          }).to(element, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut"
          });

          return () => tl.kill();
      }
    }, element);

    return () => ctx.revert();
  }, [type, disabled, onInteraction]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "micro-interaction",
        isActive && "interaction-active",
        className
      )}
    >
      {children}
    </div>
  );
};

// Ripple effect component
interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  className,
  color = "rgba(255, 255, 255, 0.3)",
  duration = 0.6
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.background = color;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1';

    container.appendChild(ripple);

    gsap.to(ripple, {
      width: '300px',
      height: '300px',
      opacity: 0,
      duration,
      ease: "power2.out",
      onComplete: () => {
        container.removeChild(ripple);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onClick={createRipple}
    >
      {children}
    </div>
  );
};

// Magnetic effect component
interface MagneticEffectProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const MagneticEffect: React.FC<MagneticEffectProps> = ({
  children,
  className,
  strength = 0.1
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={elementRef} className={cn("magnetic-effect", className)}>
      {children}
    </div>
  );
};

// Floating animation component
interface FloatingAnimationProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

const FloatingAnimation: React.FC<FloatingAnimationProps> = ({
  children,
  className,
  duration = 3,
  distance = 10
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      y: -distance,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  }, [duration, distance]);

  return (
    <div ref={elementRef} className={cn("floating-animation", className)}>
      {children}
    </div>
  );
};

// Pulse animation component
interface PulseAnimationProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  scale?: number;
}

const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  className,
  duration = 2,
  scale = 1.1
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      scale,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  }, [duration, scale]);

  return (
    <div ref={elementRef} className={cn("pulse-animation", className)}>
      {children}
    </div>
  );
};

// Shake animation component
interface ShakeAnimationProps {
  children: React.ReactNode;
  className?: string;
  trigger?: 'hover' | 'click' | 'always';
}

const ShakeAnimation: React.FC<ShakeAnimationProps> = ({
  children,
  className,
  trigger = 'click'
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const shake = () => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      x: -5,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 5
    });
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element || trigger === 'always') return;

    if (trigger === 'hover') {
      element.addEventListener('mouseenter', shake);
      return () => element.removeEventListener('mouseenter', shake);
    } else if (trigger === 'click') {
      element.addEventListener('click', shake);
      return () => element.removeEventListener('click', shake);
    }
  }, [trigger]);

  useEffect(() => {
    if (trigger === 'always') {
      const interval = setInterval(shake, 3000);
      return () => clearInterval(interval);
    }
  }, [trigger]);

  return (
    <div ref={elementRef} className={cn("shake-animation", className)}>
      {children}
    </div>
  );
};

export {
  RippleEffect,
  MagneticEffect,
  FloatingAnimation,
  PulseAnimation,
  ShakeAnimation
};

export default MicroInteraction;


