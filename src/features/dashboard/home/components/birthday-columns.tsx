"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Birthday } from "@/features/dashboard/home/data/birthday-data";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const birthdayColumns: ColumnDef<Birthday>[] = [
  {
    accessorKey: "agent",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Image
            src={row.original.agent.imageUrl}
            alt={row.original.agent.name}
            width={40}
            height={40}
            className="aspect-square rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {row.original.agent.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {row.original.agent.title}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => {
      if (row.original.isToday) {
        return (
          <Button variant="outline" size="sm" className="text-xs">
            Send Greetings 🎉
          </Button>
        );
      } else {
        return (
          <span className="text-muted-foreground text-right text-sm">
            {row.original.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }
    },
  },
];
