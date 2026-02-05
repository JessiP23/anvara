'use client'

import { ErrorState } from "@/components/state/error"

export default function MarketplaceError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState
            title="Failed to load marketplace"
            message="We could not load the ad slots. Please try again"
            onRetry={reset}
            digest={error.digest}
        />
    )
}