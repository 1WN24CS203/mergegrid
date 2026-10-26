import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-green-700',
  warning: 'bg-warning-50 text-amber-700',
  error: 'bg-error-50 text-red-700',
  outline: 'bg-white text-neutral-600 border border-neutral-300',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
