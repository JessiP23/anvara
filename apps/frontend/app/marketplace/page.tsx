import type { Metadata } from 'next';
import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSidebar } from '@/components/newsletter/newsletter-sidebar';
import { getServerAdSlotsPaginated } from '@/lib/server-api/helper';
import { PageHeader } from '@/components/ui/typography';

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
    <main className="mx-auto max-w-6xl space-y-8 p-4 pb-12">
      <PageHeader 
        title="Marketplace"
        description="Browse available ad slots from our publishers"
      />
      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          <AdSlotGrid initialItems={items} initialCursor={nextCursor} initialHasMore={hasMore} />
        </div>
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-4">
            <NewsletterSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
