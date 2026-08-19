import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface DataPaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationControl({
  currentPage,
  lastPage,
  onPageChange,
  className,
}: DataPaginationProps) {
  if (lastPage <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const maxVisible = 5

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("ellipsis")

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(lastPage - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < lastPage - 2) pages.push("ellipsis")
      pages.push(lastPage)
    }

    return pages
  }

  return (
    <Pagination className={cn("mt-6", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(
              "cursor-pointer",
              currentPage === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className={cn(
                  "cursor-pointer",
                  page === currentPage && "bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
                )}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(
              "cursor-pointer",
              currentPage === lastPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}