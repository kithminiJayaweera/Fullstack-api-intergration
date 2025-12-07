import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-[200px]" /> {/* Title */}
        <Skeleton className="mt-2 h-5 w-[300px]" /> {/* Description */}
      </div>

      {/* Stat Cards Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" /> {/* Title */}
                <Skeleton className="h-8 w-[80px]" /> {/* Value */}
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" /> {/* Icon */}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price Distribution Chart Skeleton */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-[180px]" /> {/* Chart Title */}
          <div className="flex items-center justify-center">
            <Skeleton className="h-[300px] w-[300px] rounded-full" /> {/* Pie Chart */}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-[150px]" /> {/* Title */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full" /> {/* Dot */}
                <Skeleton className="h-4 w-full" /> {/* Activity text */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
