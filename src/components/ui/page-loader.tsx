
import React from 'react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  className?: string;
  text?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  className, 
  text = "Loading..." 
}) => {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-reno-blue rounded-full animate-spin animate-reverse" style={{animationDuration: '1.5s'}}></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-medium gradient-text animate-pulse">{text}</p>
          <div className="flex space-x-1 mt-2 justify-center">
            <div className="w-2 h-2 bg-reno-purple rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-reno-blue rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-reno-mint rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PageLoader };
