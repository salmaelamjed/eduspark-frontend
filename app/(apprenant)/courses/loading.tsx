'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingCourses = () => {
  const skeletons = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletons.map((_, i) => (
        <Card 
          key={i} 
          className="overflow-hidden  rounded-xl border-gray-100 shadow-none  m-0 pt-0 "
        >
          <CardHeader className="p-0">
            <Skeleton className="aspect-video w-full h-48" />
          </CardHeader>
          <CardContent className=" space-y-1">
            <Skeleton className="h-6 w-4/5 rounded" />
                <Skeleton className="h-4 w-3/5 rounded" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LoadingCourses;