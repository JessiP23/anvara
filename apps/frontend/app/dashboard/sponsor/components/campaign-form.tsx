'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createCampaign, updateCampaign } from '../actions';
import { initialActionState, type ActionState } from '@/lib/types';
import { FormField, TextAreaField, SelectField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import { FormAlert } from '@/components/ui/form/form-alerts';
import type { Campaign } from '@/lib/types';

const CAMPAIGN_STATUSES = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PAUSED', label: 'Paused' },
    { value: 'COMPLETED', label: 'Completed' },
];

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
        <form action={formAction} className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={campaign.id} />}

            <FormAlert error={state.error} success={state.success} successMessage={isEditing ? 'Campaign Updated!' : 'Campaign Created!'} />

            <FormField name='name' label='Name' required error={state.fieldErrors?.name} defaultValue={getValue('name')} />
            <TextAreaField name='description' label='Description' required rows={3} error={state.fieldErrors?.description} defaultValue={getValue('description')} />
            <FormField name='budget' label='Budget ($)' type="number" required min={1} error={state.fieldErrors?.budget} defaultValue={getValue('budget')} />

            <div className='grid grid-cols-2 gap-4'>
                <FormField name='startDate' label='Start Date' type="date" required error={state.fieldErrors?.startDate} defaultValue={getValue('startDate')} />
                <FormField name='endDate' label='End Date' type="date" required error={state.fieldErrors?.endDate} defaultValue={getValue('endDate')} />
            </div>

            {isEditing && (
                <SelectField 
                    name="status"
                    label="Status"
                    options={CAMPAIGN_STATUSES}
                    defaultValue={campaign.status}
                />
            )}

            <div className='flex gap-3 pt-2'>
                <SubmitButton>{isEditing ? 'Update Campaign' : "Create Campaign"}</SubmitButton>
                {onCancel && <button type='button' onClick={onCancel} className='btn-secondary'>Cancel</button>}
            </div>

        </form>
    );
}