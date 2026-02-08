import type { Metadata } from 'next';
import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSidebar } from '@/components/newsletter/newsletter-sidebar';
import { getServerAdSlotsPaginated } from '@/lib/server-api/helper';
import { PageHeader } from '@/components/ui/typography';
import { StatCard } from '@/components/ui/stat-card';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browser available ad slots from premium publishers',
  openGraph: {
    title: "Marketplace - Anvara",
    description: "Browser available ad slots from premium publishers",
  }
}

export default async function MarketplacePage() {
  const { items, nextCursor, hasMore } = await getServerAdSlotsPaginated();
  const totalSlots = items.length;
  const availableSlots = items.filter((s) => s.isAvailable).length;
  const averagePrice = items.length > 0 ? Math.round(items.reduce((sum, s) => sum + Number(s.basePrice), 0) / items.length) : 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 pb-12">
      <div className='animate-fade-in-up'>
        <PageHeader 
          title="Marketplace"
          description="Browse available ad slots from our publishers"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3 stagger-children">
        <StatCard label="Total Listings" value={totalSlots} description="Active ad slots" />
        <StatCard label="Available Now" value={availableSlots} accent description={`${Math.round((availableSlots / totalSlots) * 100) || 0}% availability`} />
        <StatCard label="Avg. Price" value={`$${averagePrice.toLocaleString()}`} description="Per month" />
      </div>
      <div className="flex gap-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
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
