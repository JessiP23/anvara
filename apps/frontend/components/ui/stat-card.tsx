import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, change, description, accent, className }: StatCardProps) {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-[--color-muted]';
    }
  };
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border p-5 transition-all duration-300',
        accent
          ? 'border-[--color-primary]/20 bg-gradient-to-br from-[--color-primary]/5 to-transparent'
          : 'border-[--color-border] bg-[--color-card] hover:border-[--color-primary]/20',
        className
      )}
    >
      {/* Accent line */}
      {accent && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[--color-primary]" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[--color-primary]/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-wider text-[--color-muted]">
          {label}
        </p>
        
        <p className="mt-2 text-3xl font-bold tracking-tight text-[--color-foreground]">
          {value}
        </p>

        {change && (
          <p className={cn('mt-2 text-sm font-medium', getTrendColor(change.trend))}>
            <span className="inline-block w-4">
              {change.trend === 'up' && '↑'}
              {change.trend === 'down' && '↓'}
              {change.trend === 'neutral' && '–'}
            </span>
            {Math.abs(change.value)}% from last month
          </p>
        )}

        {description && (
          <p className="mt-1 text-xs text-[--color-muted]">{description}</p>
        )}
      </div>
    </div>
  );
}

interface StatsRowProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: { value: number; trend: 'up' | 'down' | 'neutral' };
    description?: string;
    accent?: boolean;
  }>;
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}