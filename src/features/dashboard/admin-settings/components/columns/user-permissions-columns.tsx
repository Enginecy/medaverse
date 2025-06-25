import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import type { UserPermission } from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { getActionColor } from "@/features/dashboard/admin-settings/components/utils";

export const userPermissionsColumns: ColumnDef<UserPermission>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "permission.name",
    header: "Permission",
    cell: ({ row }) => (
      <code className="bg-muted rounded px-2 py-1 text-sm">
        {row.original.permission.name}
      </code>
    ),
  },
  {
    accessorKey: "permission.resource",
    header: "Resource",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.permission.resource}</Badge>
    ),
  },
  {
    accessorKey: "permission.action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.permission.action;
      return (
        <Badge variant="secondary" className={getActionColor(action)}>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ getValue }) => {
      const source = getValue() as "role" | "direct";
      return (
        <Badge
          variant={source === "direct" ? "default" : "secondary"}
          className={
            source === "direct"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }
        >
          {source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedBy",
    header: "Assigned By",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.assignedBy.name}</span>
    ),
  },
  {
    accessorKey: "assignedAt",
    header: "Assigned",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(getValue() as string).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ getValue }) => {
      const expiresAt = getValue() as string | undefined;
      return expiresAt ? (
        <span className="text-muted-foreground text-sm">
          {new Date(expiresAt).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">Never</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as "active" | "expired" | "revoked";
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "expired"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userPermission = row.original;
      return (
        <div className="flex items-center gap-1">
          {userPermission.source === "direct" && (
            <>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {userPermission.source === "role" && (
            <span className="text-muted-foreground px-2 text-xs">Via Role</span>
          )}
        </div>
      );
    },
  },
];
