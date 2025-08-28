"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Birthday } from "@/features/dashboard/home/data/home";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
              {/* {row.original.agent.title} 
               //TODO: Add agent title when available
              
              */}
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
      const email = row.original.agent.email;
      const subject = `Happy Birthday ${row.original.agent.name}! 🎉`
      const body = `Dear ${row.original.agent.name},\n\nWishing you a wonderful birthday filled with joy and happiness! 🎂🎈\n\nBest wishes,\nYour Team`;
      if (row.original.isToday) {
        return (
          <Link href={`mailto:${email}?subject=${subject}&body=${body}`}>
          <Button variant="outline" size="sm" className="text-xs">
            Send Greetings 🎉
          </Button>

          </Link>
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
