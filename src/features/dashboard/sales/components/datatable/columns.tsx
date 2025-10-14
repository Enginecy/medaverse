"use client";
import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import type { ColumnDef } from "@tanstack/react-table";
import { generateFriendlyId } from "@/lib/utils";
import { multiSelectFilter } from "@/components/data-table/utils";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";

export const salesColumnsDef: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <p>{generateFriendlyId("SALE", row.original.id)}</p>,
    enableHiding: false,
    filterFn: multiSelectFilter,
    id: "id",
  },
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => <UserChip user={row.original.user} size="sm" />,
    filterFn: multiSelectFilter,
    id: "agent",
  },
  {
    accessorKey: "customerName",
    header: "Client Name",
    cell: ({ row }) => {
      return <p>{row.original.customerName}</p>;
    },
    filterFn: multiSelectFilter,
    id: "customerName",
  },
  {
    accessorKey: "totalAmount",
    header: "Premium",
    cell: ({ row }) => <p>{row.original.totalAmount}</p>,
    filterFn: multiSelectFilter,
    id: "totalAmount",
  },
  {
    accessorKey: "saleDate",
    header: "Sale Date",
    cell: ({ row }) => <p>{row.original.saleDate.toLocaleDateString()}</p>,
    filterFn: multiSelectFilter,
    id: "saleDate",
  },
  {
    accessorKey: "createdAt",
    header: "Submitted Date",
    cell: ({ row }) => <p>{row.original.createdAt?.toLocaleDateString()}</p>,
    filterFn: multiSelectFilter,
    id: "createdAt",
  },
];
