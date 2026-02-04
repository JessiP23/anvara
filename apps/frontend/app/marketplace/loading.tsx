import { LoadingState } from "@/components/state/loading";

export default function Loading() {
    return (
        <div className="space-y-6">
            <div>
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
               <div className="mt-2 h-5 w-72 animate-pulse rounded  bg-gray-200" />
            </div>
            <LoadingState variant="card-grid" count={6} />
        </div>
    )
}