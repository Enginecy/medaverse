"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Sale } from "./data";
import Image from "next/image";

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.agent.imageUrl}
            alt={row.original.agent.name}
            width={50}
            height={50}
            className="aspect-square rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-md font-medium">
              {row.original.agent.name}
            </span>
            <span className="text-muted-foreground text-sm">
              {row.original.agent.title}
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
          {row.original.date.toLocaleDateString("en-US", {
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
  },
  {
    accessorKey: "price",
    header: "Annual Premium",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          })}
        </span>
      );
    },
  },
];
