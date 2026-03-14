import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const DomainsTableSkeletonWithAnimation=()=> {
  return (
    <div className="w-full animate-pulse">
      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-20">
                <div className="h-4 bg-gray-200 rounded w-20" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-gray-200 rounded w-32" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-gray-200 rounded w-40" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-gray-200 rounded w-28" />
              </TableHead>
              <TableHead className="text-right w-30">
                <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Image */}
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      <div className="h-4 w-4 bg-gray-300 rounded" />
                    </div>
                  </div>
                </TableCell>

                {/* Nom */}
                <TableCell>
                  <div className="h-5 bg-gray-200 rounded w-36" />
                </TableCell>

                {/* Description */}
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {["edit", "view", "delete"].map((action) => (
                      <div
                        key={action}
                        className="h-8 w-8 bg-gray-200 rounded"
                      />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DomainsTableSkeletonWithAnimation