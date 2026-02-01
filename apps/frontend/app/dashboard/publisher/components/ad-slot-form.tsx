'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { initialActionState, type ActionState } from '@/lib/actions/types';
import type { AdSlot } from '@/lib/types';

const AD_SLOT_TYPES = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'] as const;

type AdSlotFormProps = {
    adSlot?: AdSlot;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function AdSlotForm({ adSlot, onSuccess, onCancel }: AdSlotFormProps) {
    const isEditing = !!adSlot;
    const action = isEditing ? updateAdSlot : createAdSlot;
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(action, initialActionState);
    const prevSuccess = useRef(false);

    useEffect(() => {
        if (state.success) {
            // current val
            prevSuccess.current = true;
            const times = setTimeout(() => {
                onSuccess?.();
            }, 1500);
            return () => clearTimeout(times);
        }
        if (!state.success) {
            prevSuccess.current = false;
        }
    }, [state.success, onSuccess]);

    return (
        <form action={formAction} className="space-y-4 text-black">
            {isEditing && <input type="hidden" name="id" value={adSlot.id} />}

            {state.error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-700">{state.error}</div>
            )}

            {state.success && (
                <div className="rounded bg-green-100 p-3 text-sm text-green-700">
                    {isEditing ? 'Ad slot updated!' : 'Ad slot created!'}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={adSlot?.name}
                    className="mt-1 w-full rounded border p-2"
                    required
                />
                {state.fieldErrors?.name && (
                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium">
                    Type *
                </label>
                <select
                    id="type"
                    name="type"
                    defaultValue={adSlot?.type || ''}
                    className="mt-1 w-full rounded border p-2"
                    required
                >
                    <option value="">Select type</option>
                    {AD_SLOT_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {state.fieldErrors?.type && (
                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type}</p>
                )}
            </div>

            <div>
                <label htmlFor="basePrice" className="block text-sm font-medium">
                    Base Price ($) *
                </label>
                <input
                    type="number"
                    id="basePrice"
                    name="basePrice"
                    defaultValue={adSlot?.basePrice}
                    min="0.01"
                    step="0.01"
                    className="mt-1 w-full rounded border p-2"
                    required
                />
                {state.fieldErrors?.basePrice && (
                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.basePrice}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={adSlot?.description || ''}
                    rows={3}
                    className="mt-1 w-full rounded border p-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="width" className="block text-sm font-medium">
                        Width (px)
                    </label>
                    <input
                        type="number"
                        id="width"
                        name="width"
                        defaultValue={adSlot?.width || ''}
                        min="1"
                        className="mt-1 w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label htmlFor="height" className="block text-sm font-medium">
                        Height (px)
                    </label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        defaultValue={adSlot?.height || ''}
                        min="1"
                        className="mt-1 w-full rounded border p-2"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="position" className="block text-sm font-medium">
                    Position
                </label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    defaultValue={adSlot?.position || ''}
                    placeholder="e.g., header, sidebar, footer"
                    className="mt-1 w-full rounded border p-2"
                />
            </div>

            {isEditing && (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        value="true"
                        defaultChecked={adSlot.isAvailable}
                    />
                    <label htmlFor="isAvailable" className="text-sm font-medium">
                        Available for booking
                    </label>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded border px-4 py-2 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}