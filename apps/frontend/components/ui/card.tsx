import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated';
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

export function Card({ children, className, hover = false, padding = 'md', variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover:border-[--color-primary]/30 hover:shadow-sm',
        className
      )}
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
    <div className="mb-3 flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-[--color-foreground]">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-[--color-muted]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Card Content
export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('text-sm text-[--color-muted]', className)}>{children}</div>;
}

// Card Footer
export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mt-4 flex items-center justify-between border-t border-[--color-border] pt-3', className)}>
      {children}
    </div>
  );
}