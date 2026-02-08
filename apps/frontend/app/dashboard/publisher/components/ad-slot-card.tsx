'use client';

import { DeleteButton } from "@/app/components/DeleteButton";
import { deleteAdSlot } from "../actions";
import type { AdSlot } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { TypeBadge, Badge } from "@/components/ui/badge";

interface AdSlotCardProps {
  adSlot: AdSlot;
  onEdit?: () => void;
  onDeleted?: () => void;
}

export function AdSlotCard({ adSlot, onEdit, onDeleted }: AdSlotCardProps) {
  return (
    <Card hover className="group">
      <CardHeader
        title={adSlot.name}
        badge={<TypeBadge type={adSlot.type} />}
      />

      <CardContent>
        {adSlot.description && (
          <p className="mb-4 line-clamp-2 text-[--color-foreground]">{adSlot.description}</p>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
          {(adSlot.width || adSlot.height) && (
            <div>
              <span className="block text-[--color-muted]">Dimensions</span>
              <span className="font-medium text-[--color-foreground]">
                {adSlot.width || '–'} × {adSlot.height || '–'} px
              </span>
            </div>
          )}
          {adSlot.position && (
            <div>
              <span className="block text-[--color-muted]">Position</span>
              <span className="font-medium text-[--color-foreground]">{adSlot.position}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[--color-background] p-4">
          <Badge variant={adSlot.isAvailable ? 'success' : 'default'} dot>
            {adSlot.isAvailable ? 'Available' : 'Booked'}
          </Badge>
          <div className="text-right">
            <p className="text-xl font-bold text-[--color-primary]">
              ${Number(adSlot.basePrice).toLocaleString()}
            </p>
            <p className="text-xs text-[--color-muted]">per month</p>
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
        <DeleteButton id={adSlot.id} name={adSlot.name} action={deleteAdSlot} onDeleted={onDeleted} />
      </CardFooter>
    </Card>
  );
}
