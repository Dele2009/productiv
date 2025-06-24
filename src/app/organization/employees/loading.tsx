import { Skeleton } from "@/components/ui/skeleton";

function EmployeePageLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
export default EmployeePageLoading;
