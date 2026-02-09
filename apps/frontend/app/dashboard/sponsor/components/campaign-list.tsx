'use client';

import { useState, useCallback } from 'react';
import { CampaignForm } from './campaign-form';
import { CampaignCard } from './campaign-card';
import type { Campaign } from '@/lib/types';
import { useToast } from '@/components/notification/toast';
import { EmptyState } from '@/components/state/empty';
import { Modal } from '@/components/ui/modal/genericModal';
import { useRouter } from 'next/navigation';
import { SectionHeader } from '@/components/ui/typography';
import { SwipeableCard } from '@/components/ui/swipeable-card';
import { TrashIcon } from '@/components/ui/icons';
import { deleteCampaign } from '../actions';

interface CampaignListProps{
  initialCampaigns: Campaign[];
}

export function CampaignList({ initialCampaigns }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { show } = useToast();
  const router = useRouter()

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

  const handleCampaignDeleted = useCallback((campaignId: string) => {
    setExistingIds((prev) => new Set(prev).add(campaignId));
  }, []);

  const handleAnimationEnd = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    setExistingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(campaignId);
      return newSet;
    });
    show('Campaign Deleted!', 'success')
  }, [show]);

  const handleSwipeDelete = useCallback(async (campaign: Campaign) => {
    setDeletingId(campaign.id);
    const formData = new FormData();
    formData.append('id', campaign.id);
    const result = await deleteCampaign({ success: false }, formData);
    if (result.success) {
      handleCampaignDeleted(campaign.id);
    } else {
      show(result.error || 'Failed to delete campaign', 'error');
    }
    setDeletingId(null);
  }, [handleCampaignDeleted, show]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title='Campaigns'
        description={`${campaigns.length} total`}
        action={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-accent"
          >
            New Campaign
          </button>
        }
      />

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

      {campaigns.length === 0 ? (
        <EmptyState 
          title="No Campaigns yet"
          message="Create your first campaign"
          action={{ label: "Create Campaign", onClick: () => setShowCreateModal(true) }}
        />
      ): (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {campaigns.map((campaign) => {
            const isDeleting = deletingId === campaign.id;
            const isExiting = existingIds.has(campaign.id);

            return (
              <div
                key={campaign.id}
                className={isExiting ? 'animate-fade-out-down' : ''}
                onAnimationEnd={() => {
                  if (isExiting) handleAnimationEnd(campaign.id);
                }}
              >
                {/* Mobile: Swipeable with delete action */}
                <div className="md:hidden">
                  <SwipeableCard
                    rightAction={{
                      icon: <TrashIcon className="h-6 w-6 text-white" />,
                      label: 'Delete',
                      color: 'bg-red-500',
                      onClick: () => handleSwipeDelete(campaign),
                    }}
                    disabled={isDeleting}
                  >
                    <CampaignCard
                      campaign={campaign}
                      onEdit={() => setEditingCampaign(campaign)}
                      onDeleted={() => handleCampaignDeleted(campaign.id)}
                    />
                  </SwipeableCard>
                </div>
                <div className="hidden md:block">
                  <CampaignCard
                    campaign={campaign}
                    onEdit={() => setEditingCampaign(campaign)}
                    onDeleted={() => handleCampaignDeleted(campaign.id)}
                  />
                </div>
              </div>
          )})}
        </div>
      )}
    </div>
  )
}
