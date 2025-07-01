
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  onComplete,
  className,
  size = 'md'
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimate(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [show, onComplete]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (!show) return null;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "relative rounded-full border-4 border-green-500 flex items-center justify-center",
        sizeClasses[size],
        animate && "animate-bounce-gentle"
      )}>
        {/* Success circle animation */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-green-500/20",
          animate && "animate-ping"
        )} />
        
        {/* Checkmark */}
        <Check 
          className={cn(
            "text-green-500 animate-scale-in",
            iconSizes[size]
          )}
          style={{ animationDelay: '0.3s' }}
        />
      </div>
    </div>
  );
};

export { SuccessAnimation };
