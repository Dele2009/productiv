import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-1/2 mx-auto" /> {/* Title */}
          <Skeleton className="h-4 w-2/3 mx-auto" /> {/* Subtitle */}
        </div>

        <div className="space-y-4">
          {/* Tabs Skeleton */}
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Card form skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-48" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div className="space-y-2" key={i}>
                  <Skeleton className="h-4 w-20" /> {/* Label */}
                  <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                </div>
              ))}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Button */}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
