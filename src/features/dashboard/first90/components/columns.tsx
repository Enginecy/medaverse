"use client";
import type { First90User } from "@/features/dashboard/first90/server/db/first90";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const first90Columns: ColumnDef<First90User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.avatarUrl}
            alt={row.original.name}
            width={40}
            height={40}
            className="aspect-square rounded-full object-cover"
          />

          <span className="text-md font-medium">{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "upline",
    header: "Upline",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.uplineAvatarUrl}
            alt={row.original.upline}
            width={40}
            height={40}
            className="aspect-square rounded-full object-cover"
          />

          <span className="text-md font-medium">{row.original.upline}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fnb",
    header: "FNB",
    cell: ({ row }) => {
      if (!row.original.fnb) return <p>-</p>;
      return (
        <p>{format(new Date(row.original.fnb), "MMM dd, yyyy")}</p>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      if (!row.original.endDate) return <p>-</p>;
      return (
        <p>{format(new Date(row.original.endDate), "MMM dd, yyyy")}</p>
      );
    },
  },
  {
    accessorKey: "submittedAv",
    header: "Submitted AV",
    cell: ({ row }) => {
      const value = row.original.submittedAv;
      return (
        <p className="font-medium">
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      );
    },
  },
  {
    accessorKey: "goalRemaining",
    header: "First Finisher",
    cell: ({ row }) => {
      const value = row.original.goalRemaining;
      const isNegative = value < 0;
      return (
        <p
          className={cn(
            "font-medium",
            isNegative ? "text-green-600" : "text-red-600",
          )}
        >
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
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
        <Badge
          className={cn(
            "rounded-full border-none text-xs font-normal",
            isNegative
              ? "bg-gray-100 text-gray-800"
              : weeks <= 4
                ? "bg-red-100 text-red-800"
                : weeks <= 8
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800",
          )}
        >
          {weeks.toFixed(1)} weeks
        </Badge>
      );
    },
  },
];

