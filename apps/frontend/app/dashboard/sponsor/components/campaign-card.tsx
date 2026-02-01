'use client';

import type { Campaign } from "@/lib/types";
import { DeleteButton } from "@/app/components/DeleteButton";
import { deleteCampaign } from "../actions";

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: () => void;
  onDeleted?: () => void;
}

export function CampaignCard({ campaign, onEdit, onDeleted }: CampaignCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  }
  const spent = Number(campaign.spent || 0);
  const budget = Number(campaign.budget);
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100): 0;

  return (
    <div className="rounded-lg border border-[--color-border] p-4">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-semibold">{campaign.name}</h3>
        <span
          className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
        >
          {campaign.status}
        </span>
      </div>

      {campaign.description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{campaign.description}</p>
      )}

      <div className="mb-3 space-y-1 text-sm text-[--color-muted]">
        <p>
          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
        </p>
        <div className="flex items-center justify-between">
          <span>Budget: ${budget.toLocaleString()}</span>
          <span>Spent: ${spent.toLocaleString()}</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
        <DeleteButton id={campaign.id} name={campaign.name} action={deleteCampaign} onDeleted={onDeleted} />
      </div>
    </div>
  );
}
