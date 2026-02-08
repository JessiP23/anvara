'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { AdSlot } from '@/lib/types';
import { EmptyState } from '@/components/state/empty';
import { getAdSlotsPaginated } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { SectionHeader } from '@/components/ui/typography';
import { MarketplaceCard } from './marketplace-card';
import { useState } from 'react';

interface AdSlotGridProps {
  initialItems: AdSlot[];
  initialCursor: string | null;
  initialHasMore: boolean;
}

export function AdSlotGrid({ initialItems, initialCursor, initialHasMore }: AdSlotGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, refetch } = useInfiniteQuery({
    queryKey: queryKeys.adSlots.paginated(),
    queryFn: ({ pageParam }) => getAdSlotsPaginated(undefined, pageParam ?? undefined),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    initialData: {
      pages: [{ items: initialItems, nextCursor: initialCursor, hasMore: initialHasMore }],
      pageParams: [null],
    }
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const availableCount = items.filter((s) => s.isAvailable).length;

  if (isError) {
    return <EmptyState 
      title='Failed to load ad slots'
      message='Something went wrong. Please try again.'
      action={{ label: 'Retry', onClick: () => refetch() }}
    />
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        title='No ad slots available'
        message='Check back later for new opportunities.'
        variant='minimal'
      />
    );
  }

  return (
    <section className='space-y-6'>
      <SectionHeader 
        title="Available Slots"
        description={`${availableCount} of ${items.length} available`}
      />

      <div className="grid gap-5 sm:grid-cols-2 stagger-children">
        {items.map((slot) => (
          <MarketplaceCard key={slot.id} slot={slot} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn-secondary"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </section>
  );
}
