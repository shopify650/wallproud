export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

export function TestimonialCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-3 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <TestimonialCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
