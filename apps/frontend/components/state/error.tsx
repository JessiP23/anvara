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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                ⚠️
            </div>
            <h3 className="text-lg font-semibold text-red-800">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-red-600">{message}</p>
            {digest && <p className="mb-4 text-xs text-[--color-muted]">Error ID: {digest}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="min-h-[44px] rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Try Again
                    </button>
                )}
                {onHome && (
                    <a
                        href="/"
                        className="min-h-[44px] rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Go Home
                    </a>
                )}
            </div>
        </div>
    );
}
