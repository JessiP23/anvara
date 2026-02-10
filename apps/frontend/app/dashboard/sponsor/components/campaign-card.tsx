'use client';

import type { Campaign } from "@/lib/types";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  const remaining = budget - spent;

  // calculate days remaining
  const endDate = new Date(campaign.endDate);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <Card hover className="group">
      <CardHeader 
        title={campaign.name}
        badge={<StatusBadge status={campaign.status} />}
      />
      <CardContent>
        {campaign.description && (
          <p className="mb-4 line-clamp-2 text-[--color-foreground]">{campaign.description}</p>
        )}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="text-[--color-muted]">
            {formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}
          </span>
          <span className="font-medium text-[--color-foreground]">
            {daysRemaining} days left
          </span>
        </div>

        <div className="space-y-2 rounded-lg bg-[--color-background] p-3">
          <div className="flex justify-between text-sm">
            <span className="text-[--color-muted]">Budget</span>
            <span className="font-semibold text-[--color-foreground]">
              ${budget.toLocaleString()}
            </span>
          </div>

          <Progress value={progress} size="sm" showLabel />

          <div className="flex justify-between text-xs">
            <span className="text-[--color-muted]">
              Spent: <span className="text-[--color-foreground]">${spent.toLocaleString()}</span>
            </span>
            <span className="text-[--color-muted]">
              Left: <span className="font-medium text-green-600">${remaining.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-[--color-primary] transition-colors hover:text-[--color-primary-hover]"
          >
            Edit
          </button>
        )}
        {onDeleted && (
          <button
            type="button"
            onClick={onDeleted}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
