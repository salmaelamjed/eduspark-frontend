import { cn } from "@/lib/utils";

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-lg", className)} />;
}

function CourseCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationDuration: "400ms" }}
    >
      {/* Image */}
      <ShimmerBlock className="aspect-video w-full rounded-none" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-2">
          <ShimmerBlock className="h-3.5 w-[85%]" />
          <ShimmerBlock className="h-3.5 w-[55%]" />
        </div>
        <ShimmerBlock className="h-3 w-24" />

        <div className="flex gap-1.5 border-t border-gray-50 pt-3">
          <ShimmerBlock className="h-5 w-16 rounded-lg" />
          <ShimmerBlock className="h-5 w-10 rounded-lg" />
          <ShimmerBlock className="h-5 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BestCoursesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} delay={i * 70} />
      ))}
    </div>
  );
}