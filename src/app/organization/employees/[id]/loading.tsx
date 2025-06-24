import { Skeleton } from "@/components/ui/skeleton";

function EmployeeDetailsPageLoading() {
  return (
      <div className="mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
          <Skeleton className="h-[300px] w-full" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      </div>
  );
}
export default EmployeeDetailsPageLoading;
