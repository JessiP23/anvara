'use client'

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({ message = "LOading...", className = '' }: LoadingStateProps) {
    return (
        <div className={`py-8 text-center text-[--color-muted] ${className}`}>
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <p className="mt-2">{message}</p>
        </div>
    )
}