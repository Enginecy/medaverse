"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchX } from "lucide-react";

export function LeaderboardTableEmptyState() {
  return (
    <div
      className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/80
        p-4"
    >
      
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-700 hover:bg-transparent">
            <TableHead className="text-neutral-400">No</TableHead>
            <TableHead className="text-neutral-400">Agent Name</TableHead>
            <TableHead className="text-neutral-400">Premium</TableHead>
            <TableHead className="text-neutral-400">Sales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="h-48 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <SearchX className="h-12 w-12 text-neutral-500" />
                <span className="text-base font-semibold text-neutral-300">
                  No data available
                </span>
                <span className="text-sm text-neutral-500">
                  The table is currently empty.
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
