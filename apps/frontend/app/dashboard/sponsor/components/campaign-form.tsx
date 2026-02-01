'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createCampaign, updateCampaign } from '../actions';
import { initialActionState, type ActionState } from '@/lib/actions/types';
import { FormField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import { FormAlert } from '@/components/ui/form/form-alerts';
import type { Campaign } from '@/lib/types';

const CAMPAIGN_STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'] as const;

type CampaignFormProps = {
    campaign?: Campaign;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function CampaignForm({ campaign, onSuccess, onCancel }: CampaignFormProps) {
    const isEditing = !!campaign;
    const action = isEditing ? updateCampaign : createCampaign;
    const [state, formAction] = useActionState<ActionState, FormData>(action, initialActionState);
    const prevSuccess = useRef(false);

    useEffect(() => {
        if (state.success && !prevSuccess.current) {
            prevSuccess.current = true;
            onSuccess?.();
        }
        if (!state.success) {
            prevSuccess.current = false;
        }
    }, [state.success, onSuccess]);

    const formatDate = (d?: string | Date) => (d ? new Date(d).toISOString().split('T')[0] : '');

    const getValue = (field: string) => {
        if (state.values?.[field] !== undefined) return state.values[field];
        if (campaign) {
            if (field === 'startDate' || field === 'endDate') return formatDate(campaign[field as keyof Campaign] as string);
            return String(campaign[field as keyof Campaign] || '');
        }
        return '';
    }

    return (
        <form action={formAction} className="space-y-4 text-black">
            {isEditing && <input type="hidden" name="id" value={campaign.id} />}

            <FormAlert error={state.error} success={state.success} successMessage={isEditing ? 'Campaign Updated!' : 'Campaign Created!'} />

            <FormField id='name' label='Name' required error={state.fieldErrors?.name}>
                <input type='text' id='name' name='name' defaultValue={getValue('name')} className='mt-1 w-full rounded border p-2' />
            </FormField>
            
            <FormField id='description' label='Description' required error={state.fieldErrors?.description}>
                <textarea id='description' name='description' defaultValue={getValue('description')} rows={3} className='mt-1 w-full rounded border p-2' />
            </FormField>

            <FormField id='budget' label='Budget ($)' required error={state.fieldErrors?.budget}>
                <input type='number' id='budget' name='budget' defaultValue={getValue('budget')} min='1' className='mt-1 w-full rounded border p-2' />
            </FormField>

            <div className='grid grid-cols-2 gap-4'>
                <FormField id='startDate' label='Start Date' required error={state.fieldErrors?.startDate}>
                    <input type='date' id='startDate' name='startDate' defaultValue={getValue('startDate')} className='mt-1 w-full rounded border p-2' />
                </FormField>
                <FormField id='endDate' label='End Date' required error={state.fieldErrors?.endDate}>
                    <input type='date' id='endDate' name='endDate' defaultValue={getValue('endDate')} className='mt-1 w-full rounded border p-2' />
                </FormField>
            </div>

            {isEditing && (
                <FormField id='status' label='Status'>
                    <select id='status' name='status' defaultValue={campaign.status} className='mt-1 w-full rounded border p-2'>
                        {CAMPAIGN_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                </FormField>
            )}

            <div className='flex gap-3 pt-2'>
                <SubmitButton>{isEditing ? 'Update Campaign' : "Create Campaign"}</SubmitButton>
                {onCancel && <button type='button' onClick={onCancel} className='rounded border px-4 py-2 hover:bg-gray-50'>Cancel</button>}
            </div>

        </form>
    );
}