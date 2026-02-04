'use client'

interface LoadingStateProps {
    message?: string;
    variant?: 'spinner' | 'skeleton' | 'card-grid';
    count?: number;
    className?: string;
}

function Skeleton({ className = '' }: {className?: string}) {
    return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
}

function CardSkeleton() {
    return (
        <div className="rounded-lg border border-[--color-border] p-4">
            <div className="mb-3 flex items-start justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-3/4" />
            <div className="flex items-center justify-between border-t pt-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    )
}

export function LoadingState({ message = "Loading...", variant="spinner", count=6, className = '' }: LoadingStateProps) {
    if (variant === 'card-grid') {
        return(
            <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
                {Array.from({ length: count }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (variant === 'skeleton') {
        return (
            <div className={`space-y-4 ${className}`}>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        )
    }
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[--color-primary] border-t-transparent" />
            <p className="mt-4 text-[--color-muted]">{message}</p>
        </div>
    )
}

export { Skeleton }
