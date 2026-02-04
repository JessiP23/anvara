'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { AdSlot } from '@/lib/types';
import { EmptyState } from '@/components/state/empty';
import { getAdSlotsPaginated } from '@/lib/api';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface AdSlotGridProps {
  initialItems: AdSlot[];
  initialCursor: string | null;
  initialHasMore: boolean;
}

export function AdSlotGrid({ initialItems, initialCursor, initialHasMore }: AdSlotGridProps) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const { isMobile, isTablet } = useBreakpoint();

  const loadMore = () => {
    if (!cursor || isPending) return;

    startTransition(async () => {
      const response = await getAdSlotsPaginated(undefined, cursor);

      setItems((prev) => {
        const ids = new Set(prev.map((i) => i.id));
        return [...prev, ...response.items.filter((i) => !ids.has(i.id))];
      });
      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    })
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        icon='🏪'
        title='No ad slots available'
        message='Check back later for new opportunities.'
      />
    );
  }

  const gridCols = isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className='space-y-6'>
      <div className={cn('grid gap-4', gridCols)}>
        {items.map((slot) => (
          <Link
            key={slot.id}
            href={`/marketplace/${slot.id}`}
            className="block rounded-lg border border-[--color-border] p-4 transition-shadow hover:shadow-md active:bg-gray-50"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className={cn('font-semibold line-clamp-1', isMobile ? 'text-sm' : 'text-base')}>{slot.name}</h3>
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
              >
                {slot.type}
              </span>
            </div>

            {slot.publisher && (
              <p className={cn('mb-2 text-[--color-muted]', isMobile ? 'text-xs' : 'text-sm')}>by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className={cn('mb-3 text-[--color-muted] line-clamp-2', isMobile ? 'text-xs' : 'text-sm')}>{slot.description}</p>
            )}

            <div className="flex items-center justify-between">
              <span className={cn(slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]', isMobile ? 'text-xs' : 'text-sm')}>
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <span className={cn('font-semibold text-[--color-primary]', isMobile ? 'text-sm' : 'text-base')}>
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className='flex justify-center'>
          <button
            onClick={loadMore}
            disabled={isPending}
            className={cn('rounded-lg border border-[--color-border] px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50', isMobile && 'w-full')}          
          >
            {isPending ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
