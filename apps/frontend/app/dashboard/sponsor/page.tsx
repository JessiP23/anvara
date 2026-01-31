import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { Suspense } from 'react';
import type { Campaign } from '@/lib/types';

const API_URL = globalThis.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

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
        <CampaignListWrapper />
      </Suspense>
    </div>
  );
}

async function CampaignListWrapper() {
  let campaigns: Campaign[] = [];
  let error: string | undefined;
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/api/campaigns`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch campaigns');
    campaigns = await response.json();
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