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

type LeaderboardData = {
  rank: number;
  agent: {
    name: string;
    email: string;
    avatar: string;
  };
  premium: string;
};

const data: LeaderboardData[] = [
  {
    rank: 1,
    agent: {
      name: "Austin Woodruff",
      email: "Senior Associate",
      avatar: "https://placehold.co/60x60",
    },
    premium: "$4,806",
  },
  {
    rank: 2,
    agent: {
      name: "Maria Gonzalez",
      email: "Project Manager",
      avatar: "https://placehold.co/60x60",
    },
    premium: "$5,250",
  },
  {
    rank: 3,
    agent: {
      name: "James Park",
      email: "Software Engineer",
      avatar: "https://placehold.co/60x60",
    },
    premium: "$6,200",
  },
  {
    rank: 4,
    agent: {
      name: "Linda Chen",
      email: "UX Designer",
      avatar: "https://placehold.co/60x60",
    },
    premium: "$4,900",
  },
  {
    rank: 5,
    agent: {
      name: "Michael Patel",
      email: "Data Analyst",
      avatar: "https://placehold.co/60x60",
    },
    premium: "$5,600",
  },
  {
    rank: 6,
    agent: {
      name: "Sarah Johnson",
      email: "Marketing Specialist",
      avatar: "https://placehold.co/60x60",
    },
    premium: "$4,750",
  },
];

const columns: ColumnDef<LeaderboardData>[] = [
  {
    accessorKey: "rank",
    header: "No",
    cell: ({ row }) => (
      <div className="font-bold text-neutral-500">#{row.getValue("rank")}</div>
    ),
  },
  {
    accessorKey: "agent",
    header: "Agent Name",
    cell: ({ row }) => {
      const agent = row.getValue("agent") as LeaderboardData["agent"];
      return <UserChip user={agent} />;
    },
  },
  {
    accessorKey: "premium",
    header: "Premium",
    cell: ({ row }) => (
      <div className="text-right font-semibold text-neutral-400">
        {row.getValue("premium")}
      </div>
    ),
  },
];

export function LeaderboardTable({ title }: { title: string }) {
  const table = useReactTable({
    data,
    columns,
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
                className="border-neutral-800 hover:bg-neutral-800/50"
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
