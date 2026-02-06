'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import type { AdSlot } from '@/lib/types';
import { EmptyState } from '@/components/state/empty';
import { getAdSlotsPaginated } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

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
      icon='⚠️'
      title='Failed to load ad slots'
      message='Something went wrong. Please try again.'
      action={{ label: 'Retry', onClick: () => refetch() }}
    />
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

  return (
    <div className='space-y-6'>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((slot) => (
          <Link
            key={slot.id}
            href={`/marketplace/${slot.id}`}
            className="block rounded-lg border border-[--color-border] p-4 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold">{slot.name}</h3>
              <span
                className={`rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
              >
                {slot.type}
              </span>
            </div>

            {slot.publisher && (
              <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
            )}

            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
              >
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <span className="font-semibold text-[--color-primary]">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </div>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className='flex justify-center'>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='rounded-lg border border-[--color-border] px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50'
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
