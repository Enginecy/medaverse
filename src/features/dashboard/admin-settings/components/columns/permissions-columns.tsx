import { Badge } from "@/components/ui/badge";
import { getActionColor } from "@/features/dashboard/admin-settings/components/utils";
import type { Permission } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import type { ColumnDef } from "@tanstack/react-table";

export const permissionsColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Permission",
    cell: ({ getValue }) => (
      <code className="bg-muted rounded px-2 py-1 text-sm">
        {getValue() as string}
      </code>
    ),
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ getValue }) => (
      <Badge variant="outline">{getValue() as string}</Badge>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
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
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(getValue() as string).toLocaleDateString()}
      </span>
    ),
  },
];
