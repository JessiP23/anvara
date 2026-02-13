'use client';
import { EntityList } from '@/components/ui/entity-list';
import { AdSlotCard } from './ad-slot-card';
import type { AdSlot } from '@/lib/types';
import { AdSlotForm } from './ad-slot-form';
import { deleteAdSlot } from '../actions';

interface AdSlotListProps {
  initialAdSlots: AdSlot[];
}

export function AdSlotList({ initialAdSlots }: AdSlotListProps) {
  return (
    <EntityList 
      items={initialAdSlots}
      entityName='Ad Slot'
      deleteAction={deleteAdSlot}
      description={(items) => `${items.filter(s => s.isAvailable).length} of ${items.length} available`}
      renderCard={(slot, { onEdit, onDelete }) => (
        <AdSlotCard adSlot={slot} onEdit={onEdit} onDeleted={onDelete} />
      )}
      renderForm={({ item, onSuccess, onCancel }) => (
        <AdSlotForm adSlot={item} onSuccess={onSuccess} onCancel={onCancel} />
      )}
    />
  )
}