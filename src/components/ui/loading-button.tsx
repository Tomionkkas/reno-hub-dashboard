
import React from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ComponentProps<typeof EnhancedButton> {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled,
  className,
  ...props
}) => {
  return (
    <EnhancedButton
      disabled={loading || disabled}
      className={cn(
        "relative transition-all duration-200",
        loading && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {loading ? loadingText : children}
    </EnhancedButton>
  );
};

export { LoadingButton };
