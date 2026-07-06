'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingCourses = () => {
  const skeletons = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletons.map((_, i) => (
        <Card 
          key={i} 
          className="overflow-hidden  rounded-xl border-gray-100 shadow-none  m-0 p-0 "
        >
            <Skeleton className="aspect-video w-full h-72" />
          
        </Card>
      ))}
    </div>
  );
};

export default LoadingCourses;