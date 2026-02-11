'use client';

function StatCardSkeleton({ accent = false }: { accent?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 ${
        accent
          ? 'border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent'
          : 'border-[var(--color-border)] bg-[var(--color-card)]'
      }`}
    >
      {accent && <div className="absolute left-0 top-0 h-full w-1 bg-[var(--color-primary)]/30" />}
      <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-muted)]/30" />
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-[var(--color-muted)]/30" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[var(--color-muted)]/30" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="h-1.5 w-full animate-pulse bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)]/10 to-[var(--color-primary)]/20" />

      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--color-muted)]/30" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[var(--color-muted)]/20" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--color-primary)]/20" />
        </div>

        {/* Description */}
        <div className="mb-2 h-3 w-full animate-pulse rounded bg-[var(--color-muted)]/20" />
        <div className="mb-4 h-3 w-4/5 animate-pulse rounded bg-[var(--color-muted)]/20" />

        {/* Meta grid */}
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-[var(--color-background)] p-3">
          <div>
            <div className="h-2 w-8 animate-pulse rounded bg-[var(--color-muted)]/20" />
            <div className="mt-1 h-4 w-16 animate-pulse rounded bg-[var(--color-muted)]/30" />
          </div>
          <div>
            <div className="h-2 w-12 animate-pulse rounded bg-[var(--color-muted)]/20" />
            <div className="mt-1 h-4 w-20 animate-pulse rounded bg-[var(--color-muted)]/30" />
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between rounded-xl bg-[var(--color-background)] p-4">
          <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--color-success)]/20" />
          <div className="text-right">
            <div className="ml-auto h-6 w-16 animate-pulse rounded bg-[var(--color-muted)]/30" />
            <div className="ml-auto mt-1 h-3 w-12 animate-pulse rounded bg-[var(--color-muted)]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 pb-12">
      {/* Header */}
      <div>
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[var(--color-muted)]/30" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-[var(--color-muted)]/20" />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton accent />
        <StatCardSkeleton />
      </div>

      {/* Content area */}
      <div className="flex gap-8">
        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <div className="h-6 w-32 animate-pulse rounded-lg bg-[var(--color-muted)]/30" />
            <div className="mt-1 h-4 w-24 animate-pulse rounded-lg bg-[var(--color-muted)]/20" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-muted)]/30" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-[var(--color-muted)]/20" />
            <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-[var(--color-muted)]/20" />
            <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-[var(--color-primary)]/20" />
            <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-[var(--color-muted)]/20" />
          </div>
        </div>
      </div>
    </main>
  );
}