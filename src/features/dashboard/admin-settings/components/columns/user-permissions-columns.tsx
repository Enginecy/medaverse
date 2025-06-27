import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getActionColor } from "@/features/dashboard/admin-settings/components/utils";
import type { UserPermission } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { UserPermissionEditButton } from "@/features/dashboard/admin-settings/components/ui/user-permission-edit-button";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";

export const userPermissionsColumns: ColumnDef<UserPermission>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return <UserChip user={user} />;
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
    cell: ({ row }) => {
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          {row.original.source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedBy",
    header: "Assigned By",
    cell: ({ row }) => <UserChip user={row.original.grantedBy} />,
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
    cell: ({ row }) => {
      const expiresAt = row.original.expiresAt;
      return expiresAt ? (
        <span className="text-muted-foreground text-sm">
          {expiresAt.toLocaleDateString()}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">Never</span>
      );
    },
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userPermission = row.original;
      return (
        <div className="flex items-center gap-1">
          {userPermission.source === "direct" && (
            <>
              <UserPermissionEditButton
                userPermission={{
                  id: userPermission.id,
                  user: {
                    id: userPermission.user.id,
                    name: userPermission.user.name,
                    email: userPermission.user.email!,
                    avatar: userPermission.user.avatar,
                  },
                  permission: {
                    id: userPermission.permission.id,
                    name: userPermission.permission.name,
                    resource: userPermission.permission.resource,
                    action: userPermission.permission.action,
                  },
                  expiresAt: userPermission.expiresAt
                    ? new Date(userPermission.expiresAt)
                    : undefined,
                }}
              />
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
