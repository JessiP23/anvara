import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { getServerCampaigns } from '@/lib/server-api/helper';
import { CampaignList } from './components/campaign-list';
import { responsive } from '@/lib/responsive';
import { cn } from '@/lib/utils';

export default async function SponsorDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'sponsor' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  const campaigns = await getServerCampaigns();

  return (
    <div className={responsive.spacing.section}>
      <h1 className={cn('font-bold', responsive.text.heading)}>My Campaigns</h1>
      <CampaignList initialCampaigns={campaigns} />
    </div>
  );
}