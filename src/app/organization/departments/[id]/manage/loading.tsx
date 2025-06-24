import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-6 w-48 bg-muted rounded" />
      <Skeleton className="h-4 w-32 bg-muted rounded" />
      <Skeleton className="h-[400px] bg-muted rounded-md" />
    </div>
  );
}
