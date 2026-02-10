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
    const errorKey = JSON.stringify(state.fieldErrors || {});

    return (
        <form action={formAction} noValidate className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={campaign.id} />}

            <FormAlert error={state.error} success={state.success} successMessage={isEditing ? 'Campaign Updated!' : 'Campaign Created!'} />

            <FormField key={`name-${errorKey}`} name='name' label='Name' required error={state.fieldErrors?.name} defaultValue={state.values?.name ?? campaign?.name ?? ''} />
            <TextAreaField key={`description-${errorKey}`} name='description' label='Description' required rows={3} error={state.fieldErrors?.description} defaultValue={state.values?.description ?? campaign?.description ?? ''} />
            <FormField key={`budget-${errorKey}`} name='budget' label='Budget ($)' type="number" required min={1} error={state.fieldErrors?.budget} defaultValue={state.values?.budget ?? (campaign?.budget ? String(campaign.budget) : '')} />

            <div className='grid grid-cols-2 gap-4'>
                <FormField key={`startDate-${errorKey}`} name='startDate' label='Start Date' type="date" required error={state.fieldErrors?.startDate} defaultValue={state.values?.startDate ?? (campaign?.startDate ? formatDate(campaign.startDate) : '')} />
                <FormField key={`endDate-${errorKey}`} name='endDate' label='End Date' type="date" required error={state.fieldErrors?.endDate} defaultValue={state.values?.endDate ?? (campaign?.endDate ? formatDate(campaign.endDate) : '')} />
            </div>

            {isEditing && (
                <SelectField 
                    key={`status-${errorKey}`}
                    name="status"
                    label="Status"
                    options={CAMPAIGN_STATUSES}
                    defaultValue={campaign.status}
                    error={state.fieldErrors?.status}
                />
            )}

            <div className='flex gap-3 pt-2'>
                <SubmitButton>{isEditing ? 'Update Campaign' : "Create Campaign"}</SubmitButton>
                {onCancel && <button type='button' onClick={onCancel} className='btn-secondary'>Cancel</button>}
            </div>

        </form>
    );
}