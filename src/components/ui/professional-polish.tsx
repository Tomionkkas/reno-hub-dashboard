import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface PremiumShadowProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'soft' | 'medium' | 'strong' | 'colored';
  animated?: boolean;
}

const PremiumShadow: React.FC<PremiumShadowProps> = ({
  children,
  className,
  variant = 'medium',
  animated = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getShadowClasses = () => {
    switch (variant) {
      case 'soft':
        return 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]';
      case 'strong':
        return 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]';
      case 'colored':
        return 'shadow-[0_10px_25px_-3px_rgba(0,212,255,0.4),0_4px_6px_-2px_rgba(0,212,255,0.2)]';
      default:
        return 'shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]';
    }
  };

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const container = containerRef.current;
    
    const ctx = gsap.context(() => {
             gsap.to(container, {
         boxShadow: '0 20px 40px -12px rgba(0, 212, 255, 0.6)',
         duration: 2,
         ease: 'sine.inOut',
         yoyo: true,
         repeat: -1
       });
    }, container);

    return () => ctx.revert();
  }, [animated]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'transition-all duration-300',
        getShadowClasses(),
        className
      )}
    >
      {children}
    </div>
  );
};

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  width?: number;
  animated?: boolean;
}

const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  className,
  colors = ['#00D4FF', '#FF0080', '#7F67FF'],
  width = 2,
  animated = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const container = containerRef.current;
    
    const ctx = gsap.context(() => {
      gsap.to(container, {
        background: `linear-gradient(45deg, ${colors.join(', ')})`,
        backgroundSize: '200% 200%',
        duration: 3,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }, container);

    return () => ctx.revert();
  }, [animated, colors]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative p-[2px] rounded-lg',
        className
      )}
      style={{
        background: animated ? undefined : `linear-gradient(45deg, ${colors.join(', ')})`
      }}
    >
      <div className="bg-slate-900 rounded-lg">
        {children}
      </div>
    </div>
  );
};

interface FrostedGlassProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
}

const FrostedGlass: React.FC<FrostedGlassProps> = ({
  children,
  className,
  blur = 'md',
  opacity = 0.1,
  border = true
}) => {
  return (
    <div
      className={cn(
        `backdrop-blur-${blur}`,
        `bg-white/${opacity * 100}`,
        border && 'border border-white/30',
        'rounded-xl shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  pattern?: 'dots' | 'grid' | 'waves' | 'circles';
  animated?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  className,
  pattern = 'dots',
  animated = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const container = containerRef.current;
    
    const ctx = gsap.context(() => {
      const elements = container.querySelectorAll('.bg-pattern');
      
      gsap.to(elements, {
        y: -20,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.1
      });
    }, container);

    return () => ctx.revert();
  }, [animated]);

  const renderPattern = () => {
    switch (pattern) {
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full bg-pattern"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        );
      case 'grid':
        return (
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>
        );
      case 'waves':
        return (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,50 Q25,25 50,50 T100,50"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                className="bg-pattern"
              />
              <path
                d="M0,60 Q25,35 50,60 T100,60"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                className="bg-pattern"
              />
            </svg>
          </div>
        );
      case 'circles':
        return (
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute border border-white/30 rounded-full bg-pattern"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        className
      )}
    >
      {renderPattern()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

const GlowingText: React.FC<GlowingTextProps> = ({
  children,
  className,
  color = 'cyan-500',
  intensity = 'medium',
  animated = false
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  const getGlowClasses = () => {
    switch (intensity) {
             case 'low':
         return `text-${color} drop-shadow-[0_0_10px_rgba(0,212,255,0.4)]`;
       case 'high':
         return `text-${color} drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]`;
       default:
         return `text-${color} drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]`;
    }
  };

  useEffect(() => {
    if (!animated || !textRef.current) return;

    const text = textRef.current;
    
    const ctx = gsap.context(() => {
             gsap.to(text, {
         textShadow: '0 0 30px rgba(0, 212, 255, 1)',
         duration: 2,
         ease: 'sine.inOut',
         yoyo: true,
         repeat: -1
       });
    }, text);

    return () => ctx.revert();
  }, [animated]);

  return (
    <div
      ref={textRef}
      className={cn(
        'transition-all duration-300',
        getGlowClasses(),
        className
      )}
    >
      {children}
    </div>
  );
};

interface FloatingElementsProps {
  children: React.ReactNode;
  className?: string;
  count?: number;
  elements?: ('star' | 'circle' | 'square' | 'triangle')[];
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  children,
  className,
  count = 10,
  elements = ['star', 'circle', 'square']
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animationRefs: gsap.core.Tween[] = [];

    const ctx = gsap.context(() => {
      // Kill all existing animations before creating new ones
      animationRefs.forEach(anim => anim.kill());
      animationRefs.length = 0;

      // Clear existing elements
      container.innerHTML = '';

      // Create floating elements
      for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        const elementType = elements[Math.floor(Math.random() * elements.length)];
        
        let elementContent = '';
        switch (elementType) {
          case 'star':
            elementContent = '★';
            break;
          case 'circle':
            elementContent = '●';
            break;
          case 'square':
            elementContent = '■';
            break;
          case 'triangle':
            elementContent = '▲';
            break;
        }
        
        element.className = 'absolute text-white/20 text-sm pointer-events-none';
        element.textContent = elementContent;
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(element);

        // Animate element and store reference
        const anim = gsap.to(element, {
          y: 'random(-100, 100)',
          x: 'random(-100, 100)',
          rotation: 'random(-360, 360)',
          duration: 'random(10, 20)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 5
        });
        animationRefs.push(anim);
      }
    }, container);

    return () => {
      // Kill all animations before context revert
      animationRefs.forEach(anim => anim.kill());
      ctx.revert();
    };
  }, [count, elements]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
};

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'neon';
  hover?: boolean;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'backdrop-blur-md bg-white/10 border border-white/20 shadow-xl';
             case 'gradient':
         return 'bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 shadow-xl';
       case 'neon':
         return 'bg-slate-800/50 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,212,255,0.4)]';
      default:
        return 'bg-white/5 border border-white/10 shadow-lg';
    }
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    
    switch (variant) {
      case 'glass':
        return 'hover:bg-white/15 hover:border-white/30 hover:shadow-2xl';
             case 'gradient':
         return 'hover:from-cyan-500/30 hover:to-pink-500/30 hover:shadow-2xl';
       case 'neon':
         return 'hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:border-cyan-500';
      default:
        return 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl';
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-xl p-6 transition-all duration-300',
        getVariantClasses(),
        getHoverClasses(),
        className
      )}
    >
      {children}
    </div>
  );
};

export {
  PremiumShadow,
  GradientBorder,
  FrostedGlass,
  AnimatedBackground,
  GlowingText,
  FloatingElements,
  PremiumCard
};
