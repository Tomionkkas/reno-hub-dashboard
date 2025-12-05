import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserFeedbackProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
  animate?: boolean;
}

const UserFeedback: React.FC<UserFeedbackProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  dismissible = true,
  onDismiss,
  className,
  showIcon = true,
  animate = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  useEffect(() => {
    if (animate && feedbackRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          feedbackRef.current,
          {
            opacity: 0,
            y: -20,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          }
        );
      }, feedbackRef);

      return () => ctx.revert();
    }
  }, [animate]);

  const handleDismiss = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (animate && feedbackRef.current) {
      gsap.to(feedbackRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false);
          onDismiss?.();
        }
      });
    } else {
      setIsVisible(false);
      onDismiss?.();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-500/10 border-green-500/30 text-green-400',
          icon: 'text-green-400',
          iconComponent: CheckCircle
        };
      case 'error':
        return {
          container: 'bg-red-500/10 border-red-500/30 text-red-400',
          icon: 'text-red-400',
          iconComponent: XCircle
        };
      case 'warning':
        return {
          container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          icon: 'text-yellow-400',
          iconComponent: AlertCircle
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: 'text-blue-400',
          iconComponent: Info
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.iconComponent;

  if (!isVisible) return null;

  return (
    <div
      ref={feedbackRef}
      className={cn(
        "relative p-4 rounded-lg border backdrop-blur-sm",
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <IconComponent 
            className={cn("w-5 h-5 flex-shrink-0 mt-0.5", styles.icon)} 
            aria-hidden="true"
          />
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
              "hover:bg-white/10 transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/20"
            )}
            aria-label="Zamknij powiadomienie"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Feedback manager for multiple notifications
interface FeedbackManagerProps {
  children: React.ReactNode;
  className?: string;
}

const FeedbackManager: React.FC<FeedbackManagerProps> = ({ children, className }) => {
  return (
    <div className={cn("fixed top-4 right-4 z-50 space-y-2 max-w-sm", className)}>
      {children}
    </div>
  );
};

// Hook for managing feedback
export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
  }>>([]);

  const addFeedback = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFeedbacks(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  };

  const clearAll = () => {
    setFeedbacks([]);
  };

  return {
    feedbacks,
    addFeedback,
    removeFeedback,
    clearAll,
    success: (message: string, title?: string, duration?: number) => 
      addFeedback('success', message, title, duration),
    error: (message: string, title?: string, duration?: number) => 
      addFeedback('error', message, title, duration),
    warning: (message: string, title?: string, duration?: number) => 
      addFeedback('warning', message, title, duration),
    info: (message: string, title?: string, duration?: number) => 
      addFeedback('info', message, title, duration)
  };
};

// Progress indicator
interface ProgressIndicatorProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  label,
  showPercentage = true,
  className,
  animated = true
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animated && progressRef.current) {
      // Animate progress bar fill
      gsap.to(progressRef.current, {
        width: `${Math.min(100, Math.max(0, progress))}%`,
        duration: 1.2,
        ease: "power2.out"
      });

      // Animate percentage count-up
      gsap.to(
        {},
        {
          duration: 1.2,
          ease: "power2.out",
          onUpdate: function() {
            const currentProgress = this.progress() * progress;
            setDisplayProgress(Math.round(currentProgress));
          }
        }
      );

      // Continuous shimmer animation
      if (shimmerRef.current) {
        gsap.set(shimmerRef.current, { x: '-100%' });
        gsap.to(shimmerRef.current, {
          x: '200%',
          duration: 2.5,
          repeat: -1,
          ease: "none",
          delay: 0.5
        });
      }

      // Pulsing glow animation
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.6,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }
    } else {
      setDisplayProgress(Math.round(progress));
    }
  }, [progress, animated]);

  useEffect(() => {
    // Entrance animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 10
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90 bg-cyan-500/10 px-3 py-1.5 rounded-md border border-cyan-500/20 backdrop-blur-sm">
                {label}
              </span>
            </div>
          )}
          {showPercentage && (
            <span 
              ref={percentageRef}
              className="text-sm font-bold text-white tabular-nums bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
            >
              {displayProgress}%
            </span>
          )}
        </div>
      )}
      
      <div className="relative w-full bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-700/30">
        <div
          ref={progressRef}
          className="relative h-full rounded-full overflow-hidden"
          style={!animated ? { width: `${Math.min(100, Math.max(0, progress))}%` } : { width: '0%' }}
        >
          {/* Animated gradient fill with moving colors - using CSS animation for smoothness */}
          <div 
            ref={gradientRef}
            className="absolute inset-0 rounded-full progress-gradient-animated"
          />
          
          {/* Enhanced shimmer overlay */}
          {animated && (
            <div
              ref={shimmerRef}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                width: '40%',
                transform: 'translateX(-100%) skewX(-20deg)'
              }}
            />
          )}
          
          {/* Pulsing glow effect */}
          <div 
            ref={glowRef}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(236,72,153,0.3) 50%, transparent 70%)',
              filter: 'blur(4px)',
              opacity: 0.4
            }}
          />
          
          {/* Additional shine layer */}
          {animated && (
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                mixBlendMode: 'overlay'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { FeedbackManager, ProgressIndicator };
export default UserFeedback;


