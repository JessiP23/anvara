'use client';

import { Modal } from './genericModal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    isLoading?: boolean;
}

const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    default: 'bg-[--color-primary] hover:opacity-90 text-white',
};

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    isLoading = false,
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <p className="text-[--color-muted]">{message}</p>
                
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 rounded-lg px-4 py-3 font-medium transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
                    >
                        {isLoading ? 'Deleting...' : confirmLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-lg border border-[--color-border] px-4 py-3 font-medium text-[--color-foreground] transition-colors hover:bg-[--color-background] disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}