'use client';

import { Skeleton } from "@/components/ui/skeleton";

const LoadingCourses = () => {
  const skeletons = Array.from({ length: 15 }, (_, index) => index);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {skeletons.map((_, i) => (
        <Skeleton
          key={i}
          className="w-full max-w-70  h-[432px] rounded-[2rem] bg-gray-300/80"
        />
      ))}
    </div>
  );
};

export default LoadingCourses;