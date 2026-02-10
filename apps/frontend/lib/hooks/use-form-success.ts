'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/components/notification/toast';

interface UseFormSuccessOptions {
    success?: boolean;
    error?: string;
    successMessage: string;
    onSuccess?: () => void;
}

export function useFormSuccess({ success, error, successMessage, onSuccess }: UseFormSuccessOptions) {
    const { show } = useToast();
    const prevSuccess = useRef(false);

    useEffect(() => {
        if (success && !prevSuccess.current) {
            prevSuccess.current = true;
            show(successMessage, 'success');
            onSuccess?.();
        }
        if (error) {
            show(error, 'error');
        }
        if (!success) {
            prevSuccess.current = false;
        }
    }, [success, error, successMessage, onSuccess, show]);
}