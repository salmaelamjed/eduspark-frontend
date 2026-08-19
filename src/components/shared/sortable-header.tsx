import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortDirection = "asc" | "desc" | null

interface SortableHeaderProps {
  label: string
  sortKey: string
  currentSort: { key: string; direction: SortDirection } | null
  onSort: (key: string, direction: SortDirection) => void
  className?: string
}

export function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className,
}: SortableHeaderProps) {
  const isActive = currentSort?.key === sortKey
  const direction = isActive ? currentSort?.direction : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            isActive && "text-foreground",
            className
          )}
        >
          {label}
          {direction === "asc" ? (
            <ArrowUp className="size-3.5" />
          ) : direction === "desc" ? (
            <ArrowDown className="size-3.5" />
          ) : (
            <ChevronsUpDown className="size-3.5 opacity-50" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-40 animate-in fade-in-0 zoom-in-95"
      >
        <DropdownMenuItem
          onClick={() => onSort(sortKey, "asc")}
          className="cursor-pointer gap-2"
        >
          <ArrowUp className="size-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSort(sortKey, "desc")}
          className="cursor-pointer gap-2"
        >
          <ArrowDown className="size-4" />
          Desc
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}