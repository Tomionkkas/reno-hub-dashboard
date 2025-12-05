import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  interactive?: boolean;
  clickable?: boolean;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt' | 'none';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  variant = 'default',
  interactive = true,
  clickable = false,
  hoverEffect = 'lift',
  onClick,
  disabled = false,
  loading = false,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !interactive) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(card, {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformOrigin: 'center center'
      });

      // Mouse move effect for tilt
      const handleMouseMove = (e: MouseEvent) => {
        if (hoverEffect !== 'tilt' || disabled) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        if (hoverEffect === 'tilt') {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
        setIsHovered(false);
      };

      const handleMouseEnter = () => {
        setIsHovered(true);
      };

      const handleMouseDown = () => {
        if (clickable && !disabled) {
          setIsPressed(true);
          gsap.to(card, {
            scale: 0.98,
            duration: 0.1,
            ease: "power2.out"
          });
        }
      };

      const handleMouseUp = () => {
        if (clickable && !disabled) {
          setIsPressed(false);
          gsap.to(card, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out"
          });
        }
      };

      // Add event listeners
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mousedown', handleMouseDown);
      card.addEventListener('mouseup', handleMouseUp);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mousedown', handleMouseDown);
        card.removeEventListener('mouseup', handleMouseUp);
      };
    }, card);

    return () => ctx.revert();
  }, [interactive, hoverEffect, clickable, disabled]);

  const handleClick = () => {
    if (disabled || loading) return;
    
    // Click animation
    if (clickable) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
    
    onClick?.();
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl';
      case 'glass':
        return 'bg-white/5 backdrop-blur-md border border-white/10 shadow-lg';
      case 'gradient':
        return 'bg-gradient-to-br from-reno-purple/20 to-reno-blue/20 border border-reno-purple/30';
      default:
        return 'bg-white/5 border border-white/10';
    }
  };

  const getHoverClasses = () => {
    if (!interactive || disabled) return '';
    
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-2 hover:shadow-2xl';
      case 'glow':
        return 'hover:shadow-2xl hover:shadow-reno-purple/20';
      case 'scale':
        return 'hover:scale-105';
      case 'tilt':
        return 'transition-transform duration-300';
      default:
        return '';
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-xl p-6 transition-all duration-300",
        getVariantClasses(),
        getHoverClasses(),
        clickable && !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        loading && "animate-pulse",
        className
      )}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Hover glow effect */}
      {isHovered && hoverEffect === 'glow' && (
        <div className="absolute inset-0 bg-gradient-to-r from-reno-purple/10 to-reno-blue/10 rounded-xl blur-xl -z-10"></div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Ripple effect for clickable cards */}
      {clickable && !disabled && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCard;


