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
import type { First90LeaderboardDataSection } from "@/app/first90-leaderboard/server";

const columns: ColumnDef<First90LeaderboardDataSection>[] = [
  {
    id: "rank",
    header: "No",
    cell: ({ row }) => (
      <div className="font-bold text-cyan-400/70">#{row.index + 1}</div>
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
    accessorKey: "submittedAv",
    header: "Submitted AV",
    cell: ({ row }) => (
      <div className="font-semibold text-cyan-300">
        ${Math.ceil(row.original.submittedAv).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "timeEfficiency",
    header: "AV/Week",
    cell: ({ row }) => (
      <div className="font-semibold text-blue-300">
        ${Math.ceil(row.original.timeEfficiency).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "goalRemaining",
    header: "Goal Remaining",
    cell: ({ row }) => {
      const remaining = row.original.goalRemaining;
      const isNegative = remaining < 0;
      return (
        <div
          className={`font-semibold ${
            isNegative
              ? "text-emerald-400 drop-shadow-lg"
              : "text-blue-300"
          }`}
        >
          ${Math.ceil(Math.abs(remaining)).toLocaleString()}
          {isNegative && " ✓"}
        </div>
      );
    },
  },
  {
    accessorKey: "weeksLeft",
    header: "Weeks Left",
    cell: ({ row }) => {
      const weeks = row.original.weeksLeft;
      const isNegative = weeks < 0;
      return (
        <div
          className={`font-semibold ${
            isNegative
              ? "text-slate-500"
              : weeks <= 4
                ? "text-red-400 drop-shadow-lg"
                : weeks <= 8
                  ? "text-yellow-400 drop-shadow-lg"
                  : "text-cyan-300"
          }`}
        >
          {weeks.toFixed(1)}
        </div>
      );
    },
  },
];

export function First90LeaderboardTable({
  title,
  data,
}: {
  title: string;
  data: First90LeaderboardDataSection[];
  criteria: "submitted_av" | "time_efficiency" | "goal_remaining";
}) {
  // Show all columns - they're all relevant for first90 leaderboard
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="w-full rounded-3xl border border-cyan-500/30 bg-gradient-to-br
        from-slate-900/90 via-slate-800/50 to-slate-900/90 p-4 backdrop-blur-sm
        transition-all hover:border-cyan-400/50 hover:shadow-xl
        hover:shadow-cyan-500/20"
    >
      <div
        className="mb-4 text-center text-xl font-semibold bg-gradient-to-r
          from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent
          drop-shadow-lg"
      >
        {title}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-cyan-500/20 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-cyan-300/80">
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
                className="border-none hover:bg-cyan-500/10 hover:bg-gradient-to-r
                  hover:from-cyan-500/5 hover:to-blue-500/5 transition-all"
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
    </div>
  );
}

