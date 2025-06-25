import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, X } from "lucide-react";
import type { UserRole } from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { getLevelColor } from "@/features/dashboard/admin-settings/components/utils";

export const userRolesColumns: ColumnDef<UserRole>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
        </div>
      );
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
    cell: () => (
      <div className="flex items-center gap-1">
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
      </div>
    ),
  },
];
