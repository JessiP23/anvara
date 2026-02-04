'use client';

import { useBreakpoint } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface MarketplaceLayoutProps {
  grid: ReactNode;
  sidebar: ReactNode;
}

export function MarketplaceLayout({ grid, sidebar }: MarketplaceLayoutProps) {
  const { isMobile, isTablet } = useBreakpoint();
  const showSidebarInline = !isMobile && !isTablet;

  return (
    <div className={cn('flex gap-8', showSidebarInline ? 'flex-row' : 'flex-col')}>
      <div className="flex-1">{grid}</div>
      <div className={cn(showSidebarInline && 'w-64 shrink-0')}>{sidebar}</div>
    </div>
  );
}