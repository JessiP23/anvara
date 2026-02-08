import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantStyles = {
  default: 'bg-[--color-primary]',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export function Progress({ value, max = 100, size = 'md', variant = 'default', showLabel, className }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Auto-select variant based on percentage
  const autoVariant = percentage >= 90 ? 'error' : percentage >= 70 ? 'warning' : variant;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-[--color-muted]">Progress</span>
          <span className="font-medium text-[--color-foreground]">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-gray-200', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variantStyles[autoVariant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}