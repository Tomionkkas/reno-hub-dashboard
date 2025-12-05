import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface GSAPButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ripple?: boolean;
  magnetic?: boolean;
  hoverEffect?: 'scale' | 'glow' | 'slide' | 'bounce';
}

const GSAPButton: React.FC<GSAPButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ripple = true,
  magnetic = false,
  hoverEffect = 'scale',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const ctx = gsap.context(() => {
      // Magnetic effect
      if (magnetic) {
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(button, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }

      // Hover effects
      const handleMouseEnter = () => {
        setIsHovered(true);
        
        switch (hoverEffect) {
          case 'scale':
            gsap.to(button, {
              scale: 1.05,
              duration: 0.2,
              ease: "power2.out"
            });
            break;
          case 'glow':
            gsap.to(button, {
              boxShadow: "0 0 20px rgba(90, 75, 255, 0.4)",
              duration: 0.3,
              ease: "power2.out"
            });
            break;
          case 'slide':
            gsap.to(button, {
              x: 5,
              duration: 0.2,
              ease: "power2.out"
            });
            break;
          case 'bounce':
            gsap.to(button, {
              y: -3,
              duration: 0.2,
              ease: "bounce.out"
            });
            break;
        }
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
        
        switch (hoverEffect) {
          case 'scale':
            gsap.to(button, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            });
            break;
          case 'glow':
            gsap.to(button, {
              boxShadow: "0 0 0 rgba(90, 75, 255, 0)",
              duration: 0.3,
              ease: "power2.out"
            });
            break;
          case 'slide':
            gsap.to(button, {
              x: 0,
              duration: 0.2,
              ease: "power2.out"
            });
            break;
          case 'bounce':
            gsap.to(button, {
              y: 0,
              duration: 0.2,
              ease: "power2.out"
            });
            break;
        }
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, button);

    return () => ctx.revert();
  }, [magnetic, hoverEffect]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '1';

      button.appendChild(ripple);

      gsap.to(ripple, {
        width: '300px',
        height: '300px',
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          button.removeChild(ripple);
        }
      });
    }

    props.onClick?.(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-reno-purple to-reno-blue text-white hover:from-reno-blue hover:to-reno-purple';
      case 'outline':
        return 'border-2 border-reno-purple text-reno-purple hover:bg-reno-purple hover:text-white';
      case 'ghost':
        return 'text-reno-purple hover:bg-reno-purple/10';
      default:
        return 'bg-reno-purple text-white hover:bg-reno-blue';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'xl':
        return 'px-8 py-4 text-xl';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-reno-purple focus:ring-offset-2",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default GSAPButton;


