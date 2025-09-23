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
    cell: ({ row }) => {
      return (
        <UserChip
          size="sm"
          user={{
            name: row.original.name,
            avatar: row.original.avatar_url,
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
        ${row.original.total_subordinates_sales}
      </div>
    ),
  },
  {
    accessorKey: "salesCount",
    header: "Sales",
    cell: ({ row }) => (
      <div className="font-semibold text-neutral-400">
        {row.original.subordinates[row.index]?.sales_count}
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
    data,
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
      <Button variant={'ghost'} className="rounded-3xl "></Button>

      {true && (
        <Table className="cursor-pointer">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
