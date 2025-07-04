"use client";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RowActionsDropdown } from "@/features/dashboard/user-management/components/row-actions-dropdown";

export const userManagementColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.avatarUrl!}
            alt={row.original.name!}
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
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <p>{row.original.username}</p>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p>{row.original.email}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          `rounded-full border-none text-xs font-normal text-green-800
          focus-visible:outline-none`,
          row.original.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-200 text-red-800",
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "role",
  //   header: "Role",
  //   // cell: ({ row }) => <p>{row.original.role}</p>,
  //   // TODO: Add user role when available
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return <RowActionsDropdown user={user} />;
    },
  },
];
