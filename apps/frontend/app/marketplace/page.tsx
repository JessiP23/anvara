import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSidebar } from '@/components/newsletter/newsletter-sidebar';
import { getServerAdSlotsPaginated } from '@/lib/server-api/helper';

// FIXME: This page fetches all ad slots client-side. Consider:
// 1. Server-side pagination with searchParams
// 2. Filtering by category, price range, slot type
// 3. Search functionality

export default async function MarketplacePage() {
  const { items, nextCursor, hasMore } = await getServerAdSlotsPaginated();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
        {/* TODO: Add search input and filter controls */}
      </div>

      <div className='flex gap-8'>
        <div className='flex-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2'>
          <AdSlotGrid initialItems={items} initialCursor={nextCursor} initialHasMore={hasMore} />
        </div>
        <div className='hidden w-64 shrink-0 lg:block'>
          <NewsletterSidebar />
        </div>
      </div>
    </div>
  );
}
