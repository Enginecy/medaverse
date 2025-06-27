"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { birthdayColumns } from "@/features/dashboard/home/components/birthday-columns";
import type { Birthday } from "../data/birthday-data";

export function BirthdayTable() {
  const {
    data: birthdays,
    isPending,
    isError,
    error,
  } = useQuery<Birthday[]>({
    queryKey: ["birthdays"],
    queryFn: async () => {
      const res = await fetch("/api/birthdays");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const columns = birthdayColumns;

  const todaysBirthdays = birthdays?.filter((b) => b.isToday) ?? [];
  const upcomingBirthdays = birthdays?.filter((b) => !b.isToday) ?? [];

  const todayTable = useReactTable({
    data: todaysBirthdays,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const upcomingTable = useReactTable({
    data: upcomingBirthdays,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <SkeletonSection title="Today" rows={2} />
        <div className="bg-muted h-px w-full" />
        <SkeletonSection title="Upcoming" rows={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-sm text-destructive">
        Failed to load birthdays. {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {todaysBirthdays.length > 0 && (
        <BirthdaySection title="Today" table={todayTable} />
      )}

      <div className="bg-muted h-px w-full" />

      {upcomingBirthdays.length > 0 && (
        <BirthdaySection title="Upcoming" table={upcomingTable} />
      )}

      {todaysBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
        <div className="text-muted-foreground text-center">
          No upcoming birthdays.
        </div>
      )}
    </div>
  );
}

function BirthdaySection({
  title,
  table,
}: {
  title: string;
  table: ReturnType<typeof useReactTable<Birthday>>;
}) {
  return (
    <div>
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">{title}</h3>
      <Table>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-0">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="px-0 py-2"
                  style={{
                    width: cell.column.id === "agent" ? "70%" : "30%",
                    textAlign: cell.column.id === "action" ? "right" : "left",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SkeletonSection({ title, rows }: { title: string; rows: number }) {
  return (
    <div>
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">{title}</h3>
      <Table>
        <TableBody>
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRow key={idx} className="border-0">
              <TableCell className="px-0 py-2" style={{ width: "70%" }}>
                <Skeleton className="h-4 w-3/4 rounded" />
              </TableCell>
              <TableCell
                className="px-0 py-2"
                style={{ width: "30%", textAlign: "right" }}
              >
                <Skeleton className="h-4 w-1/2 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

//  <div className="space-y-6">
//       {todaysBirthdays.length > 0 && (
//         <div>
//           <h3 className="text-muted-foreground mb-3 text-sm font-medium">
//             Today
//           </h3>
//           <Table>
//             <TableBody>
//               {todayTable.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} className="border-0">
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell
//                       className="px-0 py-2"
//                       key={cell.id}
//                       style={{
//                         width: cell.column.id === "agent" ? "70%" : "30%",
//                       }}
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       <div className="bg-muted h-px w-full" />

//       {/* Upcoming Birthdays */}
//       {upcomingBirthdays.length > 0 && (
//         <div>
//           <h3 className="text-muted-foreground mb-3 text-sm font-medium">
//             Upcoming
//           </h3>
//           <Table>
//             <TableBody>
//               {upcomingTable.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   className="flex justify-between border-0"
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell
//                       className="px-0 py-2"
//                       key={cell.id}
//                       style={{
//                         width: cell.column.id === "agent" ? "70%" : "30%",
//                         textAlign:
//                           cell.column.id === "action" ? "right" : "left",
//                       }}
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       {todaysBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
//         <div className="text-muted-foreground text-center">
//           No upcoming birthdays.
//         </div>
//       )}
//     </div>