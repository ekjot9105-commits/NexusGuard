import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-surfaceHighlight text-textPrimary',
      success: 'bg-accent/20 text-accent border border-accent/20',
      warning: 'bg-warning/20 text-warning border border-warning/20',
      danger: 'bg-danger/20 text-danger border border-danger/20',
      info: 'bg-primary/20 text-primary border border-primary/20',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
export default Badge;
