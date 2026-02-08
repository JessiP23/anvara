'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import type { AdSlot } from '@/lib/types';
import { EmptyState } from '@/components/state/empty';
import { getAdSlotsPaginated } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { TypeBadge } from '@/components/ui/badge';

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
    <div className='space-y-6'>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {items.map((slot) => (
          <Link
            key={slot.id}
            href={`/marketplace/${slot.id}`}
            className="group block rounded-xl border border-[--color-border] bg-[--color-card] p-5 transition-all duration-200 hover:border-[--color-primary]/30 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-semibold text-[--color-foreground] group-hover:text-[--color-primary] transition-colors">{slot.name}</h3>
              <TypeBadge type={slot.type} />
            </div>

            {slot.publisher && (
              <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
            )}

            <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
              <span
                className={`text-sm font-medium ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
              >
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <span className="text-lg font-bold text-[--color-primary]">
                ${Number(slot.basePrice).toLocaleString()}
                <span className="text-xs font-normal text-[--color-muted]">/mo</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn-secondary"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
