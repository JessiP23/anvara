'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdSlotCard } from './ad-slot-card';
import type { AdSlot } from '@/lib/types';
import { AdSlotForm } from './ad-slot-form';
import { useToast } from '@/components/notification/toast';
import { EmptyState } from '@/components/state/empty';
import { Modal } from '@/components/ui/modal/genericModal';

interface AdSlotListProps {
  initialAdSlots: AdSlot[];
}

export function AdSlotList({ initialAdSlots }: AdSlotListProps) {
  const [adSlots, setAdSlots] = useState<AdSlot[]>(initialAdSlots);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const {show} = useToast();
  const router = useRouter();

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    router.refresh();
    show('Ad Slot Created!', 'success');
  }

  const handleEditSuccess = () => {
    setEditingSlot(null);
    router.refresh();
    show('Ad Slot Updated!', 'success');
  }

  const handleSlotDeleted = (adSlotId: string) => {
    setAdSlots(prev => prev.filter(s => s.id !== adSlotId));
    show('Ad Slot Deleted!', 'success');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Ad Slot
        </button>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title='Create New Ad Slot'
      >
        <AdSlotForm 
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title='Edit Ad Slot'
      >
        {editingSlot && (
          <AdSlotForm
            adSlot={editingSlot}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingSlot(null)}
          />
        )}
      </Modal>
      {adSlots.length === 0 && (
        <EmptyState 
          title='No ad slots found'
          message='Create your first ad slot'
          action={{ label: 'Create Ad Slot', onClick: () => setShowCreateModal(true) }}
        />
      )}
      {adSlots.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {adSlots.map((slot) => (
            <AdSlotCard
              key={slot.id}
              adSlot={slot}
              onEdit={() => setEditingSlot(slot)}
              onDeleted={() => handleSlotDeleted(slot.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
