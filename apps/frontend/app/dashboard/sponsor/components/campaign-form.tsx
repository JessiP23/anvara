'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createCampaign, updateCampaign } from '../actions';
import { initialActionState, type ActionState } from '@/lib/actions/types';
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
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(action, initialActionState);
    const prevSuccess = useRef(false);

    useEffect(() => {
        if (state.success) {
            prevSuccess.current = true;
            const timer = setTimeout(() => {
                onSuccess?.();
            }, 1500);
            return () => clearTimeout(timer);
        }
        if (!state.success) {
            prevSuccess.current = false;
        }
    }, [state.success, onSuccess]);

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <form action={formAction} className="space-y-4 text-black">
            {isEditing && <input type="hidden" name="id" value={campaign.id} />}

            {state.error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-700">{state.error}</div>
            )}

            {state.error && (
                <div className="rounded bg-green-100 p-3 text-sm text-green-700">
                    {isEditing ? 'Campaign updated!' : 'Campaign created!'}
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
                    defaultValue={campaign?.name}
                    className="mt-1 w-full rounded border p-2"
                    required
                />
                {state.fieldErrors?.name && (
                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={campaign?.description || ''}
                    rows={3}
                    className="mt-1 w-full rounded border p-2"
                />
            </div>

            <div>
                <label htmlFor="budget" className="block text-sm font-medium">
                    Budget ($) *
                </label>
                <input
                    type="number"
                    id="budget"
                    name="budget"
                    defaultValue={campaign?.budget}
                    min="1"
                    step="1"
                    className="mt-1 w-full rounded border p-2"
                    required
                />
                {state.fieldErrors?.budget && (
                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.budget}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium">
                        Start Date *
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        defaultValue={formatDate(campaign?.startDate)}
                        className="mt-1 w-full rounded border p-2"
                        required
                    />
                    {state.fieldErrors?.startDate && (
                        <p className="mt-1 text-sm text-red-600">{state.fieldErrors.startDate}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium">
                        End Date *
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        defaultValue={formatDate(campaign?.endDate)}
                        className="mt-1 w-full rounded border p-2"
                        required
                    />
                    {state.fieldErrors?.endDate && (
                        <p className="mt-1 text-sm text-red-600">{state.fieldErrors.endDate}</p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div>
                    <label htmlFor="status" className="block text-sm font-medium">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={campaign.status}
                        className="mt-1 w-full rounded border p-2"
                    >
                        {CAMPAIGN_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
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