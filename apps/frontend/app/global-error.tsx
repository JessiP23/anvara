'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="mb-4 text-6xl">💥</div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
                    <p className="mb-6 text-gray-600">A critical error ocurred.</p>
                    {error.digest && <p className="mb-4 text-xs text-gray-400">ID: {error.digest}</p>}
                    <button
                        onClick={reset}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    )
}