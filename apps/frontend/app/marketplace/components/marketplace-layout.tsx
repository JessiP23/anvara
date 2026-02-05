import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { responsive } from '@/lib/responsive';

interface MarketplaceLayoutProps {
  grid: ReactNode;
  sidebar: ReactNode;
}

export function MarketplaceLayout({ grid, sidebar }: MarketplaceLayoutProps) {
  return (
    <div className={cn(responsive.layout.sidebar)}>
      <div className="flex-1">{grid}</div>
      <div className="lg:w-64 lg:shrink-0">{sidebar}</div>
    </div>
  );
}