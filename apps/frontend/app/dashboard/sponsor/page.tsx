import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { getServerCampaigns } from '@/lib/server-api/helper';
import { CampaignList } from './components/campaign-list';
import { PageHeader } from '@/components/ui/typography';
import { SponsorStats } from '@/components/dashboard/dashboard-stats';

export const metadata: Metadata = {
  title: "My Campaigns",
  description: "Manager your advertising campaigns and track performance.",
  openGraph: {
    title: 'My Campaigns | Anvara',
    description: "Manage your advertising campaigns and track performance.",
  }
}

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
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent || 0), 0);

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 pb-12">
      <PageHeader
        title="My Campaigns"
        description="Manage and track all your advertising campaigns"
      />

      <SponsorStats
        totalCampaigns={totalCampaigns}
        activeCampaigns={activeCampaigns}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
      />

      <CampaignList initialCampaigns={campaigns} />
    </main>
  );
}