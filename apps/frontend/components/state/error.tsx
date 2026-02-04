'use client'
interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({ 
    title="Something went wrong",
    message = 'Something went wrong. Please try again.', 
    onRetry,
    className = '' 
}: ErrorStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-8 text-center ${className}`}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                ⚠️
            </div>
            <h3 className="text-lg font-semibold text-red-800">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-red-600">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 flex items-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-50"
                >
                    <span>↻</span> Try Again
                </button>
            )}
        </div>
    );
}
