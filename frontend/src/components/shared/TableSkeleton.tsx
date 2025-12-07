import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showImage?: boolean;
}

export default function TableSkeleton({ 
  rows = 10, 
  columns = 6,
  showImage = false 
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[300px]" /> {/* Search input */}
          <Skeleton className="h-10 w-[120px]" /> {/* Search field dropdown */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[100px]" /> {/* Add button */}
          <Skeleton className="h-10 w-[120px]" /> {/* Columns dropdown */}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        {/* Table Header */}
        <div className="flex items-center gap-4 border-b bg-gray-50 p-4">
          <Skeleton className="h-5 w-5" /> {/* Checkbox */}
          {showImage && <Skeleton className="h-5 w-[80px]" />} {/* Image column */}
          {Array.from({ length: columns - (showImage ? 1 : 0) }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
          <Skeleton className="h-5 w-[80px]" /> {/* Actions */}
        </div>

        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex items-center gap-4 border-b p-4 last:border-b-0"
          >
            <Skeleton className="h-5 w-5" /> {/* Checkbox */}
            {showImage && <Skeleton className="h-12 w-12 rounded" />} {/* Image */}
            {Array.from({ length: columns - (showImage ? 1 : 0) }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 w-full" />
            ))}
            <Skeleton className="h-8 w-8 rounded" /> {/* Action button */}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-[200px]" /> {/* Selected text */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-[150px]" /> {/* Rows per page */}
          <Skeleton className="h-10 w-[200px]" /> {/* Pagination buttons */}
        </div>
      </div>
    </div>
  );
}
