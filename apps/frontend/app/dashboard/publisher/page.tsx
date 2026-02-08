import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { getServerAdSlots } from '@/lib/server-api/helper';
import { AdSlotList } from './components/ad-slot-list';
import { PageHeader } from '@/components/ui/typography';
import { PublisherStats } from '@/components/dashboard/dashboard-stats';

export const metadata: Metadata = {
  title: "My Ad Slots",
  description: "Manage your ad invenotry and connect with sponsors.",
  openGraph: {
    title: "My Ad Slots | Anvara",
    description: "Manage your ad inventory and connect with sponsors.",
  }
}

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher' || !roleData.publisherId) {
    redirect('/');
  }

  const adSlots = await getServerAdSlots(roleData.publisherId)
  const totalSlots = adSlots.length;
  const availableSlots = adSlots.filter((s) => s.isAvailable).length;
  const bookedSlots = totalSlots - availableSlots;
  const totalRevenue = adSlots.filter((s) => !s.isAvailable).reduce((sum, s) => sum + Number(s.basePrice), 0);

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 pb-12">
      <PageHeader
        title="My Ad Slots"
        description="Manage your ad inventory and connect with sponsors"
      />
      <div className='animate-fade-in-up' style={{ animationDelay: '80ms' }}>
      <PublisherStats
        totalSlots={totalSlots}
        availableSlots={availableSlots}
        bookedSlots={bookedSlots}
        totalRevenue={totalRevenue}
      />
      </div>

        <AdSlotList initialAdSlots={adSlots} />
    </main>
  );
}
