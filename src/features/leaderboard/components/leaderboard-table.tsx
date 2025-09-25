"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeaderboardDataSection } from "@/app/leaderboard/server";
import type { LeaderAndFollowers } from "@/features/leaderboard/server/db/leaderboard";

const columns: ColumnDef<LeaderAndFollowers>[] = [
  {
    id: "rank",
    header: "No",
    cell: ({ row }) => (
      <div className="font-bold text-neutral-500">#{row.index + 1}</div>
    ),
  },
  {
    id: "agent",
    header: "Agent Name",
    cell: ({ row }) => (
      <UserChip
        size="sm"
        user={{
          name: row.original.name,
          avatar: row.original.avatar_url,
        }}
      />
    ),
  },
  {
    id: "premium",
    header: "Premium",
    cell: ({ row }) => (
      <div className="font-semibold text-neutral-400">
        ${row.original.total_subordinates_sales}
      </div>
    ),
  },
  {
    id: "sales",
    header: "Sales",
    cell: ({ row }) => (
      <div className="font-semibold text-neutral-400">
        {row.original.subordinates?.reduce(
          (sum, s) => sum + (s.sales_count ?? 0),
          0,
        )}
      </div>
    ),
  },
];

const oldColumns: ColumnDef<LeaderboardDataSection>[] = [
  {
    id: "rank",
    header: "No",
    cell: ({ row }) => (
      <div className="font-bold text-neutral-500">#{row.index + 1}</div>
    ),
  },
  {
    id: "agent",
    header: "Agent Name",
    cell: ({ row }) => {
      return (
        <UserChip
          size="sm"
          user={{
            name: row.original.name,
            avatar: row.original.avatarUrl,
          }}
        />
      );
    },
  },
  {
    accessorKey: "totalSalesAmount",
    header: "Premium",
    cell: ({ row }) => (
      <div className="font-semibold text-neutral-400">
        ${row.original.totalSalesAmount}
      </div>
    ),
  },
  {
    accessorKey: "salesCount",
    header: "Sales",
    cell: ({ row }) => (
      <div className="font-semibold text-neutral-400">
        {row.original.salesCount}
      </div>
    ),
  },
];

export function LeaderboardTable({
  title,
  data,
}: {
  title: string;
  data: LeaderboardDataSection[];
}) {
  const table = useReactTable({
    data,
    columns:oldColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/80
        p-4"
    >
      <div className="mb-4 text-center text-xl font-semibold text-white">
        {title}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-neutral-700 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-neutral-400">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-none hover:bg-neutral-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

//  {false && (
//         <Table className="cursor-pointer">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow
//                 key={headerGroup.id}
//                 className="border-neutral-700 hover:bg-transparent"
//               >
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id} className="text-neutral-400">
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <>
//                   {/* Leader row */}
//                   <TableRow
//                     key={row.id}
//                     className="border-none hover:bg-neutral-800/50"
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id} className="py-4">
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext(),
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>

//                   {/* Subordinate rows */}
//                   {row.original.subordinates?.map((sub) => (
//                     <TableRow
//                       key={sub.id}
//                       className="border-none bg-neutral-950/30
//                         hover:bg-neutral-800/40"
//                     >
//                       <TableCell /> {/* empty for rank column */}
//                       <TableCell colSpan={2}>
//                         <UserChip
//                           size="sm"
//                           user={{
//                             name: sub.name,
//                             avatar: sub.avatar_url,
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell className="font-semibold text-neutral-400">
//                         {sub.sales_count}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}
