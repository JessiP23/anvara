import type { Metadata } from 'next';
import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSidebar } from '@/components/newsletter/newsletter-sidebar';
import { getServerAdSlotsPaginated } from '@/lib/server-api/helper';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browser available ad slots from premium publishers',
  openGraph: {
    title: "Marketplace - Anvara",
    description: "Browser available ad slots from premium publishers",
  }
}

// FIXME: This page fetches all ad slots client-side. Consider:
// 1. Server-side pagination with searchParams
// 2. Filtering by category, price range, slot type
// 3. Search functionality

export default async function MarketplacePage() {
  const { items, nextCursor, hasMore } = await getServerAdSlotsPaginated();

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
        </div>

        <div className="flex gap-8">
          <div className="max-h-[calc(100vh-200px)] flex-1 overflow-y-auto pr-2">
            <AdSlotGrid initialItems={items} initialCursor={nextCursor} initialHasMore={hasMore} />
          </div>
          <div className="hidden w-64 shrink-0 lg:block">
            <NewsletterSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
