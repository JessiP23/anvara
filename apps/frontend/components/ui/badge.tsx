import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  primary: 'bg-[--color-primary]/10 text-[--color-primary]',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  primary: 'bg-[--color-primary]',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
};

export function Badge({ children, variant = 'default', size = 'md', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

export const statusVariants: Record<string, BadgeVariant> = {
  DRAFT: 'default',
  ACTIVE: 'success',
  PAUSED: 'warning',
  COMPLETED: 'info',
  PENDING: 'warning',
};

export const typeVariants: Record<string, BadgeVariant> = {
  DISPLAY: 'info',
  VIDEO: 'error',
  NATIVE: 'success',
  NEWSLETTER: 'primary',
  PODCAST: 'warning',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariants[status] || 'default'} dot>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant={typeVariants[type] || 'default'}>
      {type.charAt(0) + type.slice(1).toLowerCase()}
    </Badge>
  );
}