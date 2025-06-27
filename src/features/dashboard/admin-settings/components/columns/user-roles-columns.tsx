import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getLevelColor } from "@/features/dashboard/admin-settings/components/utils";
import type { UserRole } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import { UserRoleEditButton } from "@/features/dashboard/admin-settings/components/ui/user-role-edit-button";

export const userRolesColumns: ColumnDef<UserRole>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return <UserChip user={user} />;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div>
          <div className="font-medium">{role.name}</div>
          <code className="text-muted-foreground text-xs">{role.code}</code>
        </div>
      );
    },
  },
  {
    accessorKey: "role.level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.original.role.level;
      return (
        <Badge variant="secondary" className={getLevelColor(level)}>
          Level {level}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedBy",
    header: "Assigned By",
    cell: ({ row }) => <UserChip user={row.original.assignedBy} />,
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
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <UserRoleEditButton
          userRole={{
            id: row.original.id,
            user: {
              id: row.original.user.id,
              name: row.original.user.name,
              email: row.original.user.email!,
              avatar: row.original.user.avatar,
            },
            role: {
              id: row.original.role.id,
              name: row.original.role.name,
              code: row.original.role.code,
            },
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
