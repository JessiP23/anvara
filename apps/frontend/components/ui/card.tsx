import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated';
  isExiting?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantStyles = {
  default: 'border border-[--color-border] bg-[--color-card]',
  outlined: 'border-2 border-[--color-border] bg-transparent',
  elevated: 'border border-[--color-border] bg-[--color-card] shadow-md',
};

export function Card({ children, className = '', hover = false, padding = 'md', variant = 'default', isExiting = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        paddingStyles[padding],
        variantStyles[variant],
        hover && 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
        isExiting && 'animate-fade-out-down pointer-events-none',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, badge, action }: CardHeaderProps) {
  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 truncate text-sm text-[--color-muted]">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={cn('text-sm text-[--color-muted]', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={cn('mt-4 flex items-center gap-2 border-t border-[--color-border] pt-3', className)}>
      {children}
    </div>
  );
}