"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import Image from "next/image";

export const columns: ColumnDef<
  Pick<Sale, "user" | "saleDate" | "totalAmount" | "productName">
>[] = [
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.user.avatar}
            alt={row.original.user.name}
            width={50}
            height={50}
            className="aspect-square rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-md font-medium">
              {row.original.user.name}
            </span>
            <span className="text-muted-foreground text-sm">
              {row.original.user.role}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.saleDate.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      return <span>{row.original.productName}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Annual Premium",
    cell: ({ row }) => {
      return <span>{row.original.totalAmount}</span>;
    },
  },
];
