'use client';

import { ErrorState } from "@/components/state/error";

export default function PublisherDashboardError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState 
            title="Failed to load ad slots"
            message="We could not load your ad slots. Please try again."
            onRetry={reset}
            digest={error.digest}
        />
    )
}