'use client';

import { useActionState, useEffect, useState } from 'react';
import { initialActionState, type ActionState } from '@/lib/actions/types';

type DeleteButtonProps = {
    id: string;
    name: string;
    action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
    onDeleted?: () => void;
};

export function DeleteButton({ id, name, action, onDeleted }: DeleteButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        action,
        initialActionState
    );

    useEffect(() => {
        if (state.success && onDeleted) {
            onDeleted?.();
        }
    }, [state.success, onDeleted]);

    if (!showConfirm) {
        return (
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="text-sm text-red-600 hover:text-red-800"
            >
                Delete
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Delete {name}?</span>
            <form action={formAction}>
                <input type="hidden" name="id" value={id} />
                <button
                    type="submit"
                    disabled={isPending}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                    {isPending ? 'Deleting...' : 'Confirm'}
                </button>
            </form>
            <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
            >
                Cancel
            </button>
            {state.error && <span className="text-sm text-red-600">{state.error}</span>}
        </div>
    );
}