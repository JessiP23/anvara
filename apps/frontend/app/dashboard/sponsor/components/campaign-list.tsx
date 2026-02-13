'use client';
import { EntityList } from '@/components/ui/entity-list';
import { CampaignForm } from './campaign-form';
import { CampaignCard } from './campaign-card';
import type { Campaign } from '@/lib/types';
import { deleteCampaign } from '../actions';

interface CampaignListProps{
  initialCampaigns: Campaign[];
}

export function CampaignList({ initialCampaigns }: CampaignListProps) {
  return(
    <EntityList 
      items={initialCampaigns}
      entityName='Campaign'
      deleteAction={deleteCampaign}
      renderCard={(campaign, { onEdit, onDelete }) => (
        <CampaignCard campaign={campaign} onDeleted={onDelete} onEdit={onEdit} />
      )}
      renderForm={({ item, onSuccess, onCancel }) => (
        <CampaignForm campaign={item} onSuccess={onSuccess} onCancel={onCancel} />
      )}
    />
  )
}