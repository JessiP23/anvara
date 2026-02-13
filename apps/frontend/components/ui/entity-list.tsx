'use client';

import { useState, useCallback, useEffect, type ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/notification/toast';
import { EmptyState } from '@/components/state/empty';
import { Modal } from '@/components/ui/modal/genericModal';
import { ConfirmModal } from '@/components/ui/modal/confirm-modal';
import { SectionHeader } from '@/components/ui/typography';
import { SwipeableCard } from '@/components/ui/swipeable-card';
import { TrashIcon } from '@/components/ui/icons';
import type { ActionState } from '@/lib/types';

interface EntityListProps<T extends { id: string; name: string }> {
    items: T[];
    // 'Campaign' or 'Ad Slot'
    entityName: string;
    renderCard: (item: T, handlers: { onEdit: () => void; onDelete: () => void }) => ReactNode;
    renderForm: (props: { item?: T; onSuccess: () => void; onCancel: () => void }) => ReactNode;
    deleteAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
    description?: (items: T[]) => string;
}

export function EntityList<T extends { id: string; name: string }>({
    items: initialItems,
    entityName,
    renderCard,
    renderForm,
    deleteAction,
    description,
}: EntityListProps<T>) {
    const [items, setItems] = useState<T[]>(initialItems);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const { show } = useToast();
    const router = useRouter();
    const existingIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleCreateSuccess = useCallback(() => {
        setShowCreateModal(false);
        router.refresh();
    }, [router]);

    const handleEditSuccess = useCallback(() => {
        setEditingItem(null);
        router.refresh();
    }, [router]);

    const handleDelete = useCallback((item: T) => {
        setItemToDelete(item);
    }, []);

    const handleAnimationEnd = useCallback((id: string) => {
        if (!exitingIds.has(id)) return;

        existingIdsRef.current.delete(id);
        setItems(prev => prev.filter(item => item.id !== id));
        setExitingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
        show(`${entityName} Deleted!`, 'success');
    }, [entityName, exitingIds, show]);

    const handleConfirmDelete = useCallback(async () => {
        if (!itemToDelete) return;
        setDeletingId(itemToDelete.id);
        const formData = new FormData();
        formData.append('id', itemToDelete.id);
        const result = await deleteAction({ success: false }, formData);
        if (result.success) {
            show(`${entityName} Delete!`, 'success');
            existingIdsRef.current.add(itemToDelete.id);
            setExitingIds(prev => new Set(prev).add(itemToDelete.id));
            setItemToDelete(null);
        } else {
            show(result.error || `Failed to delete ${entityName.toLowerCase()}`, 'error');
        }
        setDeletingId(null);
    }, [itemToDelete, deleteAction, entityName, show]);

    const descriptionText = description?.(items) ?? `${items.length} total`;

    return (
        <div className="space-y-6">
            <SectionHeader
                title={`${entityName}s`}
                description={descriptionText}
                action={
                <button type="button" onClick={() => setShowCreateModal(true)} className="btn-accent">
                    New {entityName}
                </button>
                }
            />

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={`Create New ${entityName}`}>
                {renderForm({ onSuccess: handleCreateSuccess, onCancel: () => setShowCreateModal(false) })}
            </Modal>

            <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={`Edit ${entityName}`}>
                {editingItem && renderForm({ item: editingItem, onSuccess: handleEditSuccess, onCancel: () => setEditingItem(null) })}
            </Modal>

            <ConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title={`Delete ${entityName}`}
                message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                confirmLabel="Delete"
                cancelLabel="Keep"
                variant="danger"
                isLoading={deletingId === itemToDelete?.id}
            />

            {items.length === 0 ? (
                <EmptyState
                    title={`No ${entityName}s yet`}
                    message={`Create your first ${entityName.toLowerCase()}`}
                    action={{ label: `Create ${entityName}`, onClick: () => setShowCreateModal(true) }}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                    {items.map((item) => {
                        const isDeleting = deletingId === item.id;
                        const isExiting = exitingIds.has(item.id);

                        return (
                            <div
                                key={item.id}
                                className={isExiting ? 'animate-fade-out-down' : ''}
                                onAnimationEnd={() => handleAnimationEnd(item.id)}
                            >
                                <div className="md:hidden">
                                <SwipeableCard
                                    rightAction={{
                                        icon: <TrashIcon className="h-6 w-6 text-white" />,
                                        label: 'Delete',
                                        color: 'bg-red-500',
                                        onClick: () => handleDelete(item),
                                    }}
                                    disabled={isDeleting}
                                >
                                    {renderCard(item, { onEdit: () => setEditingItem(item), onDelete: () => handleDelete(item) })}
                                </SwipeableCard>
                            </div>
                            <div className="hidden md:block">
                                {renderCard(item, { onEdit: () => setEditingItem(item), onDelete: () => handleDelete(item) })}
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}