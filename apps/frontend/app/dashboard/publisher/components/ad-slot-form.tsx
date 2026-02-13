'use client';

import { useActionState } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { initialActionState, type ActionState, type AdSlot } from '@/lib/types';
import { FormField, TextAreaField, SelectField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import { useFormSuccess } from '@/lib/hooks/use-form-success';

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

    useFormSuccess({
        success: state.success,
        error: state.error,
        successMessage: isEditing ? 'Ad Slot updated!' : 'Ad Slot created!',
        onSuccess,
    })

    const getValue = (field: string) => state.values?.[field] ?? (adSlot?.[field as keyof AdSlot] ?? '');

    return (
        <form action={formAction} noValidate className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={adSlot.id} />}

            <FormField
                name="name"
                label="Name"
                required
                placeholder="e.g., Homepage Banner"
                error={state.fieldErrors?.name}
                defaultValue={getValue('name') as string}
            />
            <SelectField
                name="type"
                label="Type"
                required
                options={AD_SLOT_TYPES}
                error={state.fieldErrors?.type}
                defaultValue={getValue('type') as string}
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
                defaultValue={getValue('basePrice') as string}
            />

            <TextAreaField
                name="description"
                label="Description"
                required
                rows={3}
                placeholder="Describe the ad placement..."
                error={state.fieldErrors?.description}
                defaultValue={getValue('description') as string}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    name="width"
                    label="Width (px)"
                    type="number"
                    min={1}
                    placeholder="728"
                    defaultValue={getValue('width') as string}
                />
                <FormField
                    name="height"
                    label="Height (px)"
                    type="number"
                    min={1}
                    placeholder="90"
                    defaultValue={getValue('height') as string}
                />
            </div>

            <FormField
                name="position"
                label="Position"
                required
                placeholder="e.g., header, sidebar, footer"
                error={state.fieldErrors?.position}
                defaultValue={getValue('position') as string}
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