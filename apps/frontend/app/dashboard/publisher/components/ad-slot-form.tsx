'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { initialActionState, type ActionState, type AdSlot } from '@/lib/types';
import { FormField, TextAreaField, SelectField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import { useToast } from '@/components/notification/toast';

const AD_SLOT_TYPES = [
    { value: '', label: 'Select type' },
    { value: 'DISPLAY', label: 'Display' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'NATIVE', label: 'Native' },
    { value: 'NEWSLETTER', label: 'Newsletter' },
    { value: 'PODCAST', label: 'Podcast' },
];

type AdSlotFormProps = {
    adSlot?: AdSlot;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function AdSlotForm({ adSlot, onSuccess, onCancel }: AdSlotFormProps) {
    const isEditing = !!adSlot;
    const action = isEditing ? updateAdSlot : createAdSlot;
    const [state, formAction] = useActionState<ActionState, FormData>(action, initialActionState);
    const { show } = useToast();
    const prevSuccess = useRef(false);

    useEffect(() => {
        if (state.success && !prevSuccess.current) {
            prevSuccess.current = true;
            show(isEditing ? 'Ad slot updated!' : 'Ad slot created!', 'success');
            onSuccess?.();
        }
        if (state.error) {
            show(state.error, 'error');
        }
        if (!state.success) {
            prevSuccess.current = false;
        }
    }, [state, show, isEditing, onSuccess]);

    return (
        <form action={formAction} noValidate className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={adSlot.id} />}

            <FormField
                name="name"
                label="Name"
                required
                placeholder="e.g., Homepage Banner"
                error={state.fieldErrors?.name}
                defaultValue={state.values?.name ?? adSlot?.name ?? ''}
            />
<SelectField
                name="type"
                label="Type"
                required
                options={AD_SLOT_TYPES}
                error={state.fieldErrors?.type}
                defaultValue={state.values?.type ?? adSlot?.type ?? ''}
            />

            <FormField
                name="basePrice"
                label="Base Price ($)"
                type="number"
                required
                min={0.01}
                step={0.01}
                placeholder="500"
                error={state.fieldErrors?.basePrice}
                defaultValue={state.values?.basePrice ?? (adSlot?.basePrice ? String(adSlot.basePrice) : '')}
            />

            <TextAreaField
                name="description"
                label="Description"
                required
                rows={3}
                placeholder="Describe the ad placement..."
                error={state.fieldErrors?.description}
                defaultValue={state.values?.description ?? adSlot?.description ?? ''}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    name="width"
                    label="Width (px)"
                    type="number"
                    min={1}
                    placeholder="728"
                    defaultValue={state.values?.width ?? (adSlot?.width ? String(adSlot.width) : '')}
                />
                <FormField
                    name="height"
                    label="Height (px)"
                    type="number"
                    min={1}
                    placeholder="90"
                    defaultValue={state.values?.height ?? (adSlot?.height ? String(adSlot.height) : '')}
                />
            </div>

            <FormField
                name="position"
                label="Position"
                required
                placeholder="e.g., header, sidebar, footer"
                error={state.fieldErrors?.position}
                defaultValue={state.values?.position ?? adSlot?.position ?? ''}
            />

            {isEditing && (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        value="true"
                        defaultChecked={adSlot.isAvailable}
                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600"
                    />
                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available for booking
                    </label>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <SubmitButton>{isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}</SubmitButton>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}