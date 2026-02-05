'use client'

import { ErrorState } from "@/components/state/error"

export default function SponsorDashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState 
            title="Failed to load campaign"
            message="We could not load your campaigns. Please try again."
            onRetry={reset}
            digest={error.digest}
        />
    )
}