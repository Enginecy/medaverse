import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import type { ColumnDef } from "@tanstack/react-table";
import { generateFriendlyId } from "@/lib/utils";

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <p>{generateFriendlyId("SALE", row.original.id)}</p>,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Client Name",
    cell: ({ row }) => {
      return <p>{row.original.customerName}</p>;
    },
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => <p>{row.original.productName}</p>,
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => <p>{row.original.companyName}</p>,
  },
  {
    accessorKey: "totalAmount",
    header: "Premium",
    cell: ({ row }) => <p>{row.original.totalAmount}</p>,
  },
  {
    accessorKey: "saleDate",
    header: "Sale Date",
    cell: ({ row }) => <p>{row.original.saleDate.toLocaleDateString()}</p>,
  },
  {
    accessorKey: "createdAt",
    header: "Submitted Date",
    cell: ({ row }) => <p>{row.original.createdAt?.toLocaleDateString()}</p>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sale = row.original;
      return <p>Actions</p>;
      // return <RowActionsDropdown sale={sale} />;
    },
  },
];
