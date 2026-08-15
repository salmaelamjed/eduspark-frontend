export function NotificationSkeleton() {
  return (
    <div className="flex h-10 w-full items-center gap-3 border-b border-border/40 px-3 select-none">
      {/* Checkbox Skeleton */}
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <div className="h-4 w-4 rounded bg-muted animate-pulse" />
      </div>

      {/* Point de statut */}
      <div className="w-2 shrink-0 flex justify-center">
        <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
      </div>

      {/* Grille du contenu */}
      <div className="grid flex-1 min-w-0 grid-cols-[180px_1fr] items-center gap-4">
        {/* Label/Expéditeur */}
        <div className="h-4 w-28 rounded bg-muted animate-pulse" />

        {/* Message */}
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
      </div>

      {/* Date */}
      <div className="w-24 shrink-0 flex justify-end">
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export function NotificationsSkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full rounded-md border border-border/60 bg-background overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <NotificationSkeleton key={index} />
      ))}
    </div>
  );
}