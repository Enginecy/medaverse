"use client";
import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import type { ColumnDef } from "@tanstack/react-table";
import { generateFriendlyId } from "@/lib/utils";
import { multiSelectFilter } from "@/components/data-table/utils";
import { DeleteSaleAction } from "@/features/dashboard/sales/components/datatable/delete-sale-action";

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
    accessorKey: "customerName",
    header: "Client Name",
    cell: ({ row }) => {
      return <p>{row.original.customerName}</p>;
    },
    filterFn: multiSelectFilter,
    id: "customerName",
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => <p>{row.original.productName}</p>,
    filterFn: multiSelectFilter,
    id: "productName",
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => <p>{row.original.companyName}</p>,
    filterFn: multiSelectFilter,
    id: "companyName",
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DeleteSaleAction saleId={row.original.id} />,
    enableHiding: false,
  },
];
