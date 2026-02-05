import Link from "next/link";

export default function NotFound() {
    return(
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 text-8xl">🔍</div>
            <h1 className="mb-2 text-3xl font-bold text-[--color-foreground]">Page Not Found</h1>
            <p className="mb-8 max-w-md text-[--color-muted]">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                    href="/"
                    className="min-h-[44px] rounded-lg bg-[--color-primary] px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}