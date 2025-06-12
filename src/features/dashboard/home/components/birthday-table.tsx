"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Birthday } from "../data/birthday-data";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface BirthdayTableProps {
  columns: ColumnDef<Birthday, unknown>[];
  data: Birthday[];
}

export function BirthdayTable({ columns, data }: BirthdayTableProps) {
  const todaysBirthdays = data.filter((birthday) => birthday.isToday);
  const upcomingBirthdays = data.filter((birthday) => !birthday.isToday);

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

  return (
    <div className="space-y-6">
      {todaysBirthdays.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">
            Today
          </h3>
          <Table>
            <TableBody>
              {todayTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-0">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="px-0 py-2"
                      key={cell.id}
                      style={{
                        width: cell.column.id === "agent" ? "70%" : "30%",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="bg-muted h-px w-full" />

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">
            Upcoming
          </h3>
          <Table>
            <TableBody>
              {upcomingTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="flex justify-between border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="px-0 py-2"
                      key={cell.id}
                      style={{
                        width: cell.column.id === "agent" ? "70%" : "30%",
                        textAlign:
                          cell.column.id === "action" ? "right" : "left",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {todaysBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
        <div className="text-muted-foreground text-center">
          No upcoming birthdays.
        </div>
      )}
    </div>
  );
}
