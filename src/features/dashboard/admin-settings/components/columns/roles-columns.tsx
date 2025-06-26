import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Users } from "lucide-react";
import { getLevelColor } from "@/features/dashboard/admin-settings/components/utils";
import type { Role } from "@/features/dashboard/admin-settings/server/db/admin-settings";

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
    cell: ({ row }) => (
      <code className="bg-muted rounded px-2 py-1 text-sm">
        {row.original.code}
      </code>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.original.level;
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
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Users className="text-muted-foreground h-4 w-4" />
        <span className="text-sm">{row.original.userCount}</span>
      </div>
    ),
  },
  {
    accessorKey: "permissionCount",
    header: "Permissions",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.permissionCount} permissions
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
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
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.createdAt?.toLocaleDateString()}
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
