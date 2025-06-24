import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      {/* Top cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="flex items-center p-6 space-x-4"
          >
            <Skeleton className="rounded-full w-16 h-16" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departments table */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-1/5 h-4" />
              <Skeleton className="w-1/5 h-4" />
            </div>
          ))}
        </Card>

        {/* Activity Feed */}
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded border space-y-2"
            >
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-40 w-full" />
      </Card>
    </div>
  );
}
