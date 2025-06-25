import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Users } from "lucide-react";
import type { Role } from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { getLevelColor } from "@/features/dashboard/admin-settings/components/utils";

export const rolesColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div>
          <div className="font-medium">{role.name}</div>
          <div className="text-muted-foreground text-sm">
            {role.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ getValue }) => (
      <code className="bg-muted rounded px-2 py-1 text-sm">
        {getValue() as string}
      </code>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ getValue }) => {
      const level = getValue() as number;
      return (
        <Badge variant="secondary" className={getLevelColor(level)}>
          Level {level}
        </Badge>
      );
    },
  },
  {
    accessorKey: "userCount",
    header: "Users",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <Users className="text-muted-foreground h-4 w-4" />
        <span className="text-sm">{getValue() as number}</span>
      </div>
    ),
  },
  {
    accessorKey: "permissionCount",
    header: "Permissions",
    cell: ({ getValue }) => (
      <Badge variant="outline">{getValue() as number} permissions</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as "active" | "disabled";
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {status}
        </Badge>
      );
    },
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
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
    ),
  },
];
