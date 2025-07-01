
import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingShapesProps {
  className?: string;
  count?: number;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ 
  className, 
  count = 6 
}) => {
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    type: ['circle', 'square', 'triangle'][i % 3],
    size: Math.random() * 60 + 20,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15
  }));

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={cn(
            "absolute opacity-10 animate-float-random",
            shape.type === 'circle' && "rounded-full bg-gradient-to-br from-reno-purple to-reno-blue",
            shape.type === 'square' && "bg-gradient-to-br from-reno-blue to-reno-mint rotate-45",
            shape.type === 'triangle' && "bg-gradient-to-br from-reno-mint to-reno-purple"
          )}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
            clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
          }}
        />
      ))}
    </div>
  );
};

export { FloatingShapes };
