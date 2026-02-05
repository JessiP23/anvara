import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { getServerAdSlots } from '@/lib/server-api/helper';
import { AdSlotList } from './components/ad-slot-list';
import { responsive } from '@/lib/responsive';
import { cn } from '@/lib/utils';

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

  return (
    <div className={responsive.spacing.section}>
      <h1 className={cn('font-bold', responsive.text.heading)}>My Ad Slots</h1>
        {/* TODO: Add CreateAdSlotButton here */}

      <AdSlotList initialAdSlots={adSlots} />
    </div>
  );
}
