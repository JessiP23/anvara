'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdSlotCard } from './ad-slot-card';
import type { AdSlot } from '@/lib/types';
import { AdSlotForm } from './ad-slot-form';
import { useToast } from '@/components/notification/toast';
import { EmptyState } from '@/components/state/empty';
import { Modal } from '@/components/ui/modal/genericModal';
import { ConfirmModal } from '@/components/ui/modal/confirm-modal';
import { SectionHeader } from '@/components/ui/typography';
import { SwipeableCard } from '@/components/ui/swipeable-card';
import { TrashIcon } from '@/components/ui/icons';
import { deleteAdSlot } from '../actions';

interface AdSlotListProps {
  initialAdSlots: AdSlot[];
}

export function AdSlotList({ initialAdSlots }: AdSlotListProps) {
  const [adSlots, setAdSlots] = useState<AdSlot[]>(initialAdSlots);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<AdSlot | null>(null);
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

  const handleSlotDeleted = useCallback((adSlotId: string) => {
    setExistingIds(prev => new Set(prev).add(adSlotId));
  }, []);

  const handleAnimationEnd = useCallback((adSlogId: string) => {
    setAdSlots(prev => prev.filter(s => s.id !== adSlogId));
    setExistingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(adSlogId);
      return newSet;
    });
    show('Ad Slot Deleted!', 'success');
  }, [show]);

  const handleDeleteRequest = useCallback((slot: AdSlot) => {
    setSlotToDelete(slot);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!slotToDelete) return;
    setDeletingId(slotToDelete.id);
    const formData = new FormData();
    formData.append('id', slotToDelete.id);
    const result = await deleteAdSlot({ success: false }, formData);
    if (result.success) {
      handleSlotDeleted(slotToDelete.id);
      setSlotToDelete(null);
    } else {
      show(result.error || 'Failed to delete', 'error');
    }
    setDeletingId(null);
  }, [slotToDelete, handleSlotDeleted, show]);

  const availableCount = adSlots.filter(s => s.isAvailable).length;

  return (
    <section className="space-y-6">
      <SectionHeader 
        title="Ad Slots"
        description={`${availableCount} of ${adSlots.length}`}
        action={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-accent"
          >
            New Ad Slot
          </button>
        }
      />

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
      <ConfirmModal
        isOpen={!!slotToDelete}
        onClose={() => setSlotToDelete(null)}
        onConfirm={handleConfirmDelete}
        title='Delete Ad Slot'
        message={`Are you sure you want to delete "${slotToDelete?.name}"? This action cannot be undone.`}
        confirmLabel='Delete'
        cancelLabel='Keep'
        variant='danger'
        isLoading={deletingId === slotToDelete?.id}
      />
      {adSlots.length === 0 ? (
        <EmptyState 
          title='No ad slots found'
          message='Create your first ad slot'
          action={{ label: 'Create Ad Slot', onClick: () => setShowCreateModal(true) }}
        />
      ): (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {adSlots.map((slot) => {
            const isDeleting = deletingId === slot.id;
            const isExisting = existingIds.has(slot.id);
            
            return (
              <div
                key={slot.id}
                className={existingIds.has(slot.id) ? 'animate-fade-out-down': ''}
                onAnimationEnd={() => {
                  if (isExisting) handleAnimationEnd(slot.id);
                }}
              >
                <div className='md:hidden'>
                  <SwipeableCard
                    rightAction={{
                      icon: <TrashIcon className='h-6 w-6 text-white' />,
                      label: 'Delete',
                      color: 'bg-red-500',
                      onClick: () => handleDeleteRequest(slot),
                    }}
                    disabled={isDeleting}
                  >
                    <AdSlotCard
                      adSlot={slot}
                      onEdit={() => setEditingSlot(slot)}
                      onDeleted={() => handleDeleteRequest(slot)}
                    />
                  </SwipeableCard>
                </div>
                <div className='hidden md:block'>
                  <AdSlotCard
                    adSlot={slot}
                    onEdit={() => setEditingSlot(slot)}
                    onDeleted={() => handleDeleteRequest(slot)}
                  />
                </div>
              </div>
        )})}
        </div>
      )}
    </section>
  );
}
