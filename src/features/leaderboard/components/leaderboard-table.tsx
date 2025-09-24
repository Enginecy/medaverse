"use client";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
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

export function LeaderboardTable({
  title,
  data,
}: {
  title: string;
  data: LeaderAndFollowers[];
}) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [isExpanded, setIsExpanded] = useState(false);
  function toggleExpand() {
    setIsExpanded(!isExpanded);
  }
  return (
    <div
      onClick={toggleExpand}
      className="w-full cursor-pointer rounded-3xl border border-neutral-800
        bg-neutral-900/80 p-4"
    >
      <div className="text-center text-xl font-semibold text-white">
        {title}
      </div>
      <Button variant={"ghost"} className="rounded-3xl"></Button>
      <LeaderboardList data={data} />
     
    </div>
  );
}

export function LeaderboardList({ data }: { data: LeaderAndFollowers[] }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((leader, i) => (
        <div
          key={leader.id}
          className="rounded-3xl border border-neutral-800 bg-neutral-900/80
            p-4"
        >
          {/* Leader Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-neutral-500">#{i + 1}</span>
              <UserChip
                size="sm"
                user={{
                  name: leader.name,
                  avatar: leader.avatar_url,
                }}
              />
            </div>
            <div className="flex gap-6 text-sm font-semibold text-neutral-300">
              <span>Premium: ${leader.total_subordinates_sales}</span>
              <span>
                Sales:{" "}
                {leader.subordinates.reduce(
                  (sum, s) => sum + (s.sales_count ?? 0),
                  0,
                )}
              </span>
            </div>
          </div>

          {/* Followers */}
          <div className="mt-3 border-l border-neutral-800 pl-8">
            {leader.subordinates.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between py-2"
              >
                <UserChip
                  size="sm"
                  user={{
                    name: sub.name,
                    avatar: sub.avatar_url,
                  }}
                />
                <div className="text-sm font-medium text-neutral-400">
                  Sales: {sub.sales_count}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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