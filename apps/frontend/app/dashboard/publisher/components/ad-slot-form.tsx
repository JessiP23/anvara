'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { initialActionState, type ActionState } from '@/lib/actions/types';
import { FormField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import { FormAlert } from '@/components/ui/form/form-alerts';
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
        <form action={formAction} className="space-y-4 text-black">
            {isEditing && <input type="hidden" name="id" value={adSlot.id} />}

            <FormAlert error={state.error} success={state.success} successMessage={isEditing ? "Ad Slot updated!" : 'Ad slot created!'} />

            <FormField id='name' label='Name' required error={state.fieldErrors?.name}>
                <input type='text' id='name' name='name' defaultValue={getValue('name')} className='mt-1 w-full rounded border p-2' />
            </FormField>

            <FormField id='type' label='Type' required error={state.fieldErrors?.type}>
                <select id='type' name='type' defaultValue={getValue('type', 'DISPLAY')} className='mt-1 w-full rounded border p-2'>
                    {AD_SLOT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
            </FormField>

            <FormField id='basePrice' label='Base Price ($/month)' required error={state.fieldErrors?.basePrice}>
                <input type='number' id='basePrice' name='basePrice' defaultValue={getValue('basePrice')} min='1' className='mt-1 w-full rounded border p-2' />
            </FormField>

            <FormField id='description' label='Description' required error={state.fieldErrors?.description}>
                <textarea id='description' name='description' defaultValue={getValue('description')} rows={3} className='mt-1 w-full rounded border p-2' />
            </FormField>

            <FormField id='position' label='Position' required error={state.fieldErrors?.position}>
                <input type='text' id='position' name='position' defaultValue={getValue('position')} placeholder='e.g., Header, Sidebar, Footer' className='mt-1 w-full rounded border p-2' />
            </FormField>

            <div className='grid grid-cols-2 gap-4'>
                <FormField id='width' label='Width (px)'>
                    <input type='number' id='width' name='width' defaultValue={getValue('width')} min='1' className='mt-1 w-full rounded border p-2' />
                </FormField>
                <FormField id='height' label='Height (px)'>
                    <input type='number' id='height' name='height'defaultValue={getValue('height')} min='1' className='mt-1 w-full rounded border p-2' />
                </FormField>
            </div>

            {isEditing && (
                <FormField id='isAvailable' label='Availability'>
                    <select id='isAvailable' name='isAvailable' defaultValue={adSlot.isAvailable ? 'true' : 'false'} className='mt-1 w-full rounded border p-2'>
                        <option value='true'>Available</option>
                        <option value='false'>Currently Booked</option>
                    </select>
                </FormField>
            )}

            <div className='flex gap-3 pt-2'>
                <SubmitButton>{isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}</SubmitButton>
                {onCancel && <button type='button' onClick={onCancel} className='rounded border px-4 py-2 hover:bg-gray-50'>Cancel</button>}
            </div>
        </form>
    );
}