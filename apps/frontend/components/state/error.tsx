'use client'

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    onHome?: boolean;
    digest?: string;
}

export function ErrorState({ 
    title="Something went wrong",
    message = 'Something went wrong. Please try again.', 
    onRetry,
    onHome = true,
    digest,
}: ErrorStateProps) {
    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <div className="h-8 w-1 rotate-45 rounded-full bg-red-500" />
                <div className="absolute h-8 w-1 -rotate-45 rounded-full bg-red-500" />
            </div>

            <h3 className="text-lg font-semibold text-[--color-foreground]">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-[--color-muted]">{message}</p>

            {digest && (
                <p className="mt-3 text-xs text-[--color-muted]">Error ID: {digest}</p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="btn-accent"
                    >
                        Try Again
                    </button>
                )}
                {onHome && (
                    <a
                        href="/"
                        className="btn-secondary"
                    >
                        Go Home
                    </a>
                )}
            </div>
        </div>
    );
}
