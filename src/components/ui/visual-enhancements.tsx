import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  animated?: boolean;
  speed?: number;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  className,
  colors = ['from-cyan-500', 'via-purple-500', 'to-pink-500'],
  direction = 'to-br',
  animated = true,
  speed = 20
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const container = containerRef.current;
    const gradientElement = container.querySelector('.animated-gradient') as HTMLElement;
    
    if (!gradientElement) return;

    const ctx = gsap.context(() => {
      gsap.to(gradientElement, {
        backgroundPosition: '200% 200%',
        duration: speed,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }, container);

    return () => ctx.revert();
  }, [animated, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 animated-gradient',
          `bg-gradient-${direction}`,
          ...colors,
          'bg-[length:200%_200%]'
        )}
        style={{
          backgroundPosition: '0% 0%'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  className,
  color = 'cyan-500',
  intensity = 'medium',
  animated = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return `shadow-${color}/20`;
      case 'high':
        return `shadow-${color}/40 shadow-2xl`;
      default:
        return `shadow-${color}/30 shadow-xl`;
    }
  };

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const container = containerRef.current;
    
    const ctx = gsap.context(() => {
      gsap.to(container, {
        boxShadow: `0 0 30px rgba(139, 92, 246, 0.3)`,
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
        'relative',
        getIntensityClasses(),
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};

interface GlassMorphismProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
}

const GlassMorphism: React.FC<GlassMorphismProps> = ({
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
        border && 'border border-white/20',
        'rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

interface ParticleSystemProps {
  className?: string;
  count?: number;
  colors?: string[];
  speed?: number;
  size?: 'sm' | 'md' | 'lg';
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  className,
  count = 50,
  colors = ['#00D4FF', '#FF0080', '#7F67FF'],
  speed = 20,
  size = 'md'
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

      // Clear existing particles
      container.innerHTML = '';

      // Create particles
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const sizeClass = size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';
        
        particle.className = `absolute ${sizeClass} rounded-full opacity-30 pointer-events-none`;
        particle.style.background = color;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(particle);

        // Animate particle and store reference
        const anim = gsap.to(particle, {
          y: -100 - Math.random() * 200,
          x: Math.random() * 100 - 50,
          opacity: 0,
          duration: Math.random() * speed + speed,
          repeat: -1,
          ease: 'none',
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
  }, [count, colors, speed, size]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    />
  );
};

interface FloatingOrbsProps {
  className?: string;
  count?: number;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
}

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  className,
  count = 5,
  colors = ['#00D4FF', '#FF0080', '#7F67FF'],
  size = 'md'
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

      // Clear existing orbs
      container.innerHTML = '';

      // Create floating orbs
      for (let i = 0; i < count; i++) {
        const orb = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
        
        orb.className = `absolute ${sizeClass} rounded-full opacity-20 blur-sm pointer-events-none`;
        orb.style.background = color;
        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(orb);

        // Animate orb and store reference
        const anim = gsap.to(orb, {
          y: 'random(-50, 50)',
          x: 'random(-50, 50)',
          rotation: 'random(-180, 180)',
          duration: 'random(8, 15)',
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
  }, [count, colors, size]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    />
  );
};

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'ltr' | 'rtl';
  duration?: number;
}

const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  className,
  direction = 'ltr',
  duration = 2
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <div
        className={cn(
          'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent',
          direction === 'rtl' && 'translate-x-full'
        )}
        style={{
          animation: `shimmer ${duration}s infinite`
        }}
      />
    </div>
  );
};

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  animated?: boolean;
  width?: 'thin' | 'normal' | 'thick';
}

const NeonBorder: React.FC<NeonBorderProps> = ({
  children,
  className,
  color = 'cyan-500',
  animated = true,
  width = 'normal'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getWidthClasses = () => {
    switch (width) {
      case 'thin':
        return 'border';
      case 'thick':
        return 'border-2';
      default:
        return 'border';
    }
  };

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const container = containerRef.current;
    
    const ctx = gsap.context(() => {
      gsap.to(container, {
        boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    }, container);

    return () => ctx.revert();
  }, [animated, color]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        getWidthClasses(),
        `border-${color}`,
        'rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

interface HolographicEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const HolographicEffect: React.FC<HolographicEffectProps> = ({
  children,
  className,
  intensity = 'medium'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.to(container, {
        background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
        backgroundSize: '400% 400%',
        duration: 3,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg',
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export {
  GradientBackground,
  GlowEffect,
  GlassMorphism,
  ParticleSystem,
  FloatingOrbs,
  ShimmerEffect,
  NeonBorder,
  HolographicEffect
};
