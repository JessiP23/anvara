import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { Suspense } from 'react';
import { getCampaigns } from '@/lib/api';
import type { Campaign } from '@/lib/types';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        {/* TODO: Add CreateCampaignButton here */}
      </div>

      <Suspense fallback={<CampaignListSkeleton />}>
        <CampaignListWrapper sponsorId={roleData.sponsorId} />
      </Suspense>
    </div>
  );
}

async function CampaignListWrapper({sponsorId}: {sponsorId: string}) {
  let campaigns: Campaign[] = [];
  let error: string | undefined;
  try {
    campaigns = (await getCampaigns(sponsorId)) as Campaign[]
  } catch {
    error = 'Failed to load campaigns. Please try again later.';
  }
  return <CampaignList campaigns={campaigns} error={error} />
}


function CampaignListSkeleton() {
  return (
    <div className="py-8 text-center text-[--color-muted]">      
      Loading campaigns...
    </div>
  )
}