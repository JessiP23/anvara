'use client'

import { ErrorState } from "@/components/state/error"

export default function AdSlotDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return(
        <ErrorState 
            title="Failed to load ad slot"
            message="This ad slot could not be loaded. It may not exist or there was a connection issue."
            onRetry={reset}
            digest={error.digest}
        />
    )
}