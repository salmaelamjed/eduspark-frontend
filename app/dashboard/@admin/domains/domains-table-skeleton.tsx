'use client'
import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"

interface SkeletonBlockProps {
  className?: string
  style?: CSSProperties
}

function SkeletonBlock({ className, style }: SkeletonBlockProps) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} style={style} />
}

const NAME_WIDTHS = ["68%", "82%", "60%", "75%", "70%", "65%"]
const DESC_WIDTHS = ["85%", "78%", "90%", "72%", "88%", "80%"]

export function DomainsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full animate-in fade-in-0 duration-300">
      <div className="grid grid-cols-[80px_1fr_2fr_120px_40px] items-center gap-4 border-b px-2 pb-3">
        <span className="text-sm font-medium text-muted-foreground">Image</span>
        <span className="text-sm font-medium text-muted-foreground">Nom du domaine</span>
        <span className="text-sm font-medium text-muted-foreground">Description</span>
        <span className="text-sm font-medium text-muted-foreground">Date de création</span>
        <span />
      </div>

      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[80px_1fr_2fr_120px_40px] items-center gap-4 px-2 py-4 animate-in fade-in-0 slide-in-from-bottom-1"
            style={{ animationDelay: `${i * 60}ms`, animationDuration: "400ms" }}
          >
            <SkeletonBlock className="size-12 rounded-lg" />
            <SkeletonBlock className="h-4" style={{ width: NAME_WIDTHS[i % NAME_WIDTHS.length] }} />
            <SkeletonBlock className="h-4" style={{ width: DESC_WIDTHS[i % DESC_WIDTHS.length] }} />
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="size-5 rounded-full justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  )
}