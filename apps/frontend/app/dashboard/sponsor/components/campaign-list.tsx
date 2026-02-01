'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCampaigns } from '@/lib/api';
import { authClient } from '@/auth-client';
import { CampaignForm } from './campaign-form';
import { CampaignCard } from './campaign-card';
import type { Campaign } from '@/lib/types';

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { data: session } = authClient.useSession();

  const loadCampaigns = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const data = await getCampaigns<Campaign[]>();
      setCampaigns(data);
    } catch {
      setError("Failed to load campaigns")
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadCampaigns();
  }

  const handleEditSuccess = () => {
    setEditingCampaign(null);
    loadCampaigns();
  }

  const handleCampaignDeleted = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  }

  if (loading) {
    return <div className="py-8 text-center text-[--color-muted]">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Create New Campaign'}
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create New Campaign</h2>
          <CampaignForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {campaigns.length === 0 && !showCreateForm && (
        <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
          No campaigns yet. Create your first campaign to start advertising.
        </div>
      )}

      {campaigns.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) =>
            editingCampaign?.id === campaign.id ? (
              <div key={campaign.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-black">Edit Campaign</h3>
                <CampaignForm
                  campaign={campaign}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingCampaign(null)}
                />
              </div>
            ) : (
              <CampaignCard key={campaign.id} campaign={campaign} onEdit={() => setEditingCampaign(campaign)} onDeleted={() => handleCampaignDeleted(campaign.id)} />
            )
          )}
        </div>
      )}     
    </div>
  )
}
