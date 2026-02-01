'use client'
interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({ 
    message = 'Something went wrong. Please try again.', 
    onRetry,
    className = '' 
}: ErrorStateProps) {
    return (
        <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
            <p className="text-red-600">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 text-sm text-red-700 underline hover:text-red-800"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}