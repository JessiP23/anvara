'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';
import { CampaignCard } from './campaign-card';
import type { Campaign } from '@/lib/types';
import { useToast } from '@/components/notification/toast';
import { EmptyState } from '@/components/state/empty';
import { Modal } from '@/components/ui/modal/genericModal';
import { useRouter } from 'next/navigation';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';

interface CampaignListProps{
  initialCampaigns: Campaign[];
}

export function CampaignList({ initialCampaigns }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { show } = useToast();
  const router = useRouter()
  const { isMobile, isTablet } = useBreakpoint();

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    router.refresh();
    show('Campaign Created!', 'success');
  }

  const handleEditSuccess = () => {
    setEditingCampaign(null);
    router.refresh();
    show('Campaign Updated!', 'success');
  }

  const handleCampaignDeleted = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    show('Campaign Deleted!', 'success');
  }

  const gridCols = isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="space-y-6">
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={() => setShowCreateModal(true)}
          className={cn('rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700', isMobile ? 'w-full' : 'py-2')}
        >
          Create New Campaign
        </button>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title='Create New Campaign'
      >
        <CampaignForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingCampaign}
        onClose={() => setEditingCampaign(null)}
        title='Edit Campaign'
      >
        {editingCampaign && (
          <CampaignForm
            campaign={editingCampaign}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingCampaign(null)}
          />
        )}
      </Modal>

      {campaigns.length === 0 && (
        <EmptyState 
          title="No Campaigns yet"
          message="Create your first campaign"
          action={{ label: "Create Campaign", onClick: () => setShowCreateModal(true) }}
        />
      )}

      {campaigns.length > 0 && (
        <div className={cn('grid gap-4', gridCols)}>
          {campaigns.map((campaign) =>
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => setEditingCampaign(campaign)}
              onDeleted={() => handleCampaignDeleted(campaign.id)}
            />
          )}
        </div>
      )}     
    </div>
  )
}
