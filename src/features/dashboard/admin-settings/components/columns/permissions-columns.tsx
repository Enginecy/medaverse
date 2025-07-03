"use client";

import { Badge } from "@/components/ui/badge";
import { getActionColor } from "@/features/dashboard/admin-settings/components/utils";
import type { Permission } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import type { ColumnDef } from "@tanstack/react-table";
import {
  dateRangeFilter,
  multiSelectFilter,
} from "@/components/data-table/utils";

export const permissionsColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Permission",
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <code className="bg-muted rounded px-2 py-1 text-sm">
        {getValue() as string}
      </code>
    ),
  },
  {
    accessorKey: "resource",
    header: "Resource",
    id: "resource",
    filterFn: multiSelectFilter,
    cell: ({ getValue }) => (
      <Badge variant="outline">{getValue() as string}</Badge>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "action",
    filterFn: multiSelectFilter,
    cell: ({ getValue }) => {
      const action = getValue() as string;
      return (
        <Badge variant="secondary" className={getActionColor(action)}>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    enableColumnFilter: false,
    filterFn: dateRangeFilter,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(getValue() as string).toLocaleDateString()}
      </span>
    ),
  },
];
