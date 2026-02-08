'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { initialActionState, type ActionState } from '@/lib/types';
import { FormField, SelectField, TextAreaField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import { FormAlert } from '@/components/ui/form/form-alerts';
import type { AdSlot } from '@/lib/types';

const AD_SLOT_TYPES = [
    { value: 'DISPLAY', label: 'Display' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'NATIVE', label: 'Native' },
    { value: 'NEWSLETTER', label: 'Newsletter' },
    { value: 'PODCAST', label: 'Podcast' },
];

const AVAILABILITY_OPTIONS = [
    { value: 'true', label: 'Available' },
    { value: 'false', label: 'Currently Booked' },
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
    const prevSuccess = useRef(false);

    useEffect(() => {
        if (state.success && !prevSuccess.current) {
            // current val
            prevSuccess.current = true;
            onSuccess?.();
        }
        if (!state.success) {
            prevSuccess.current = false;
        }
    }, [state.success, onSuccess]);
    
    const getValue = (field: string, fallback: string | number | undefined = '') => {
        if (state.values?.[field] !== undefined) return state.values[field];
        if (adSlot && field in adSlot) return String(adSlot[field as keyof AdSlot] ?? '');
        return String(fallback);
    };

    return (
        <form action={formAction} className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={adSlot.id} />}

            <FormAlert error={state.error} success={state.success} successMessage={isEditing ? "Ad Slot updated!" : 'Ad slot created!'} />
            <FormField name='name' label='Name' required error={state.fieldErrors?.name} defaultValue={getValue('name')} />
            <SelectField name='type' label='Type' required options={AD_SLOT_TYPES} error={state.fieldErrors?.type} defaultValue={getValue('type', 'DISPLAY')} />
            <FormField name='basePrice' label='Base Price ($/month)' type="number" required error={state.fieldErrors?.basePrice} defaultValue={getValue('basePrice')} />
            <TextAreaField name='description' label='Description' required rows={3} error={state.fieldErrors?.description} defaultValue={getValue('description')} />
            <FormField name='position' label='Position' required placeholder="e.g., Header, Sidebar, Footer" error={state.fieldErrors?.position} defaultValue={getValue('position')} />

            <div className='grid grid-cols-2 gap-4'>
                <FormField name='width' label='Width (px)' type="number" min={1} defaultValue={getValue('width')} />
                <FormField name='height' label='Height (px)' type="number" min={1} defaultValue={getValue('height')} />
            </div>

            {isEditing && (
                <SelectField 
                    name="isAvailable"
                    label="Availability"
                    options={AVAILABILITY_OPTIONS}
                    defaultValue={adSlot.isAvailable ? 'true': 'false'}
                />
            )}

            <div className='flex gap-3 pt-2'>
                <SubmitButton>{isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}</SubmitButton>
                {onCancel && <button type='button' onClick={onCancel} className='btn-secondary'>Cancel</button>}
            </div>
        </form>
    );
}