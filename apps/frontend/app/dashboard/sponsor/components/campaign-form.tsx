'use client';

import { useActionState} from 'react';
import { createCampaign, updateCampaign } from '../actions';
import { initialActionState, type ActionState } from '@/lib/types';
import { FormField, TextAreaField, SelectField } from '@/components/ui/form/form-field';
import { SubmitButton } from '@/components/ui/form/submit-button';
import type { Campaign } from '@/lib/types';
import { useFormSuccess } from '@/lib/hooks/use-form-success';

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

    useFormSuccess({
        success: state.success,
        error: state.error,
        successMessage: isEditing ? 'Campaign Updated!' : 'Campaign Created!',
        onSuccess,
    })

    const formatDate = (d?: string | Date) => (d ? new Date(d).toISOString().split('T')[0] : '');
    const getValue = (field: string) => state.values?.[field] ?? (campaign?.[field as keyof Campaign] ?? '');

    return (
        <form action={formAction} noValidate className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={campaign.id} />}

            <FormField name='name' label='Name' required error={state.fieldErrors?.name} defaultValue={getValue('name') as string} />
            <TextAreaField name='description' label='Description' required rows={3} error={state.fieldErrors?.description} defaultValue={getValue('description') as string} />
            <FormField name='budget' label='Budget ($)' type="number" required min={1} error={state.fieldErrors?.budget} defaultValue={getValue('budget') as string} />

            <div className='grid grid-cols-2 gap-4'>
                <FormField name='startDate' label='Start Date' type="date" required error={state.fieldErrors?.startDate} defaultValue={state.values?.startDate ?? (campaign?.startDate ? formatDate(campaign.startDate) : '')} />
                <FormField name='endDate' label='End Date' type="date" required error={state.fieldErrors?.endDate} defaultValue={state.values?.endDate ?? (campaign?.endDate ?? formatDate(campaign?.endDate))} />
            </div>

            {isEditing && (
                <SelectField 
                    name="status"
                    label="Status"
                    options={CAMPAIGN_STATUSES}
                    defaultValue={getValue('status') as string}
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