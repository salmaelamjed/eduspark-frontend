import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardsSkeletonWithAnimation() {
  return (
    <div className="container mx-auto p-6 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((row) => (
          <div 
            key={row} 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {Array.from({ length: 5 }).map((_, index) => (
               
              <div key={index}>
                <Skeleton className="h-40 w-full rounded-t-lg" />
              </div>

  
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}