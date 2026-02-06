import Link from "next/link";

export default function AdSlotNotFound() {
    return(
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 text-6xl">📭</div>
            <h1 className="mb-2 text-2xl font-bold text-[--color-foreground]">Ad Slot Not Found</h1>
            <p className="mb-6 max-w-md text-[--color-muted]">
                This ad slot does not exist or is no longer available.
            </p>
            <Link
                href="/marketplace"
                className="min-h-[44px] rounded-lg bg-[--color-primary] px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
            >
                Back to Marketplace
            </Link>
        </div>
    )
}