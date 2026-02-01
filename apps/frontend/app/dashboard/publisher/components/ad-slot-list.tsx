'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAdSlots } from '@/lib/api';
import { getUserRole } from '@/lib/auth-helpers';
import { authClient } from '@/auth-client';
import { AdSlotCard } from './ad-slot-card';
import type { AdSlot } from '@/lib/types';
import { AdSlotForm } from './ad-slot-form';
import { useToast } from '@/components/notification/toast';
import { LoadingState } from '@/components/state/loading';
import { ErrorState } from '@/components/state/error';
import { EmptyState } from '@/components/state/empty';

export function AdSlotList() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const { data: session } = authClient.useSession();
  const {show} = useToast();

  const loadAdSlots = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const roleData = await getUserRole(session.user.id);

      if (roleData.publisherId) {
        const data = await getAdSlots<AdSlot[]>(roleData.publisherId);
        setAdSlots(data);
      } else {
        setAdSlots([]);
      }
    } catch {
      setError("Failed to load ad slots")
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadAdSlots();
  }, [loadAdSlots]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadAdSlots();
    show('Ad Slot Created!', 'success');
  }

  const handleEditSuccess = () => {
    setEditingSlot(null);
    loadAdSlots();
    show('Ad Slot Updated!', 'success');
  }

  const handleSlotDeleted = (adSlotId: string) => {
    setAdSlots(prev => prev.filter(s => s.id !== adSlotId));
    show('Ad Slot Deleted!', 'success');
  }

  if (loading) {
    return <LoadingState message='Loading ad slots...'/>;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAdSlots} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Create Ad Slot'}
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-black">Create New Ad Slot</h2>
          <AdSlotForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {adSlots.length === 0 && !showCreateForm && (
        <EmptyState 
          title='No ad slots yet'
          message='Create your first ad slot to start earning.'
          action={{ label: 'Create Ad Slot', onClick: () => setShowCreateForm(true)}}
        />
      )}
      {adSlots.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adSlots.map((slot) =>
            editingSlot?.id === slot.id ? (
              <div key={slot.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-black">Edit Ad Slot</h3>
                <AdSlotForm
                  adSlot={slot}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingSlot(null)}
                />
              </div>
            ) : (
              <AdSlotCard key={slot.id} adSlot={slot} onEdit={() => setEditingSlot(slot)} onDeleted={() => handleSlotDeleted(slot.id)} />
            )
          )}
        </div>
      )}
    </div>
  );
}
