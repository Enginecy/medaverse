import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTableSkeleton({
  columns = 7,
  rows = 6,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <div className="w-full">
      {/* Filter and actions shimmer */}
      <div className="flex items-center py-4 gap-2">
        <Skeleton className="h-10 max-w-sm w-[240px] rounded bg-gray-200" />
        <div className="flex-1 flex justify-end gap-2">
          <Skeleton className="h-10 w-[120px] rounded bg-gray-200" />
        </div>
      </div>
      {/* Table shimmer */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="h-4">
            <TableRow>
              {[...Array(columns)].map((_, colIdx) => (
                <TableHead key={colIdx}>
                  <Skeleton className="h-4 w-20 bg-gray-200" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rows)].map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {[...Array(columns)].map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-8 w-full bg-gray-200 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination shimmer */}
      <div className="flex items-center justify-end space-x-2 py-4 mt-2">
        <div className="flex-1">
          <Skeleton className="h-4 w-32 bg-gray-200" />
        </div>
        <Skeleton className="h-8 w-20 rounded bg-gray-200" />
        <Skeleton className="h-8 w-20 rounded bg-gray-200" />
      </div>
    </div>
  );
}
