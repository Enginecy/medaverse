import type { Resource } from "@/lib/data";
import type { ColumnDef } from "@tanstack/react-table";

export const resourcesColumns: ColumnDef<
  Resource & { permissionCount: number }
>[] = [
  {
    accessorKey: "name",
    header: "Resource",
    cell: ({ row }) => (
      <code className="bg-muted rounded px-2 py-1 text-sm">
        {row.original.name}
      </code>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "permissionCount",
    header: "Permissions",
    cell: ({ row }) => {
      const permissionCount = row.original.permissionCount;
      return permissionCount ? (
        <code
          className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs"
        >
          {permissionCount}
        </code>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];
