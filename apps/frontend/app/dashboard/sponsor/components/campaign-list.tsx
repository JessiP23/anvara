import { CampaignCard } from './campaign-card';
import type { Campaign } from '@/lib/types';

interface CampaignListProps {
  campaigns: Campaign[];
  error?: string;
}
export function CampaignList({ campaigns, error }: CampaignListProps) {
  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    )
  }

  if (campaigns.length === 0) {
    return(
      <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
        No campaigns found. Create your first campaign to get started!        
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}      
    </div>
  )
  // TODO: Add sorting options (by date, budget, status)
  // TODO: Add pagination if campaigns list gets large
  
}
