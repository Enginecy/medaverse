"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Search, X } from "lucide-react";

type UserPermission = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  permission: {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  assignedAt: string;
  expiresAt?: string;
  status: "active" | "expired" | "revoked";
  source: "role" | "direct";
};

// Mock data - replace with actual API call
const mockUserPermissions: UserPermission[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "John Smith",
      email: "john.smith@medahealth.com",
    },
    permission: {
      id: "p1",
      name: "users:delete",
      resource: "users",
      action: "delete",
      description: "Delete users",
    },
    assignedBy: {
      id: "admin",
      name: "System Admin",
    },
    assignedAt: "2024-01-01",
    status: "active",
    source: "direct",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah.johnson@medahealth.com",
    },
    permission: {
      id: "p2",
      name: "reports:create",
      resource: "reports",
      action: "create",
      description: "Create custom reports",
    },
    assignedBy: {
      id: "u1",
      name: "John Smith",
    },
    assignedAt: "2024-01-15",
    expiresAt: "2024-07-15",
    status: "active",
    source: "direct",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Mike Wilson",
      email: "mike.wilson@medahealth.com",
    },
    permission: {
      id: "p3",
      name: "sales:update",
      resource: "sales",
      action: "update",
      description: "Update sales records",
    },
    assignedBy: {
      id: "u2",
      name: "Sarah Johnson",
    },
    assignedAt: "2024-02-01",
    status: "active",
    source: "direct",
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Emily Brown",
      email: "emily.brown@medahealth.com",
    },
    permission: {
      id: "p4",
      name: "users:read",
      resource: "users",
      action: "read",
      description: "View user information",
    },
    assignedBy: {
      id: "u3",
      name: "Mike Wilson",
    },
    assignedAt: "2024-02-15",
    status: "active",
    source: "role",
  },
];

export function UserPermissionsTable() {
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [filteredUserPermissions, setFilteredUserPermissions] = useState<
    UserPermission[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    const loadUserPermissions = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserPermissions(mockUserPermissions);
      setFilteredUserPermissions(mockUserPermissions);
      setLoading(false);
    };

    loadUserPermissions();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUserPermissions(userPermissions);
    } else {
      const filtered = userPermissions.filter(
        (userPermission) =>
          userPermission.user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userPermission.user.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userPermission.permission.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userPermission.permission.resource
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userPermission.permission.action
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredUserPermissions(filtered);
    }
  }, [searchTerm, userPermissions]);

  if (loading) {
    return <UserPermissionsTableSkeleton />;
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "read":
        return "bg-blue-100 text-blue-800";
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-yellow-100 text-yellow-800";
      case "delete":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Permission Assignments</h3>
          <p className="text-muted-foreground text-sm">
            Direct permission assignments to users
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Assign Permission
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
              -translate-y-1/2"
          />
          <Input
            placeholder="Search users or permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUserPermissions.map((userPermission) => (
              <TableRow key={userPermission.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {userPermission.user.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {userPermission.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-muted rounded px-2 py-1 text-sm">
                    {userPermission.permission.name}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {userPermission.permission.resource}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getActionColor(userPermission.permission.action)}
                  >
                    {userPermission.permission.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      userPermission.source === "direct"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      userPermission.source === "direct"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {userPermission.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {userPermission.assignedBy.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {new Date(userPermission.assignedAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  {userPermission.expiresAt ? (
                    <span className="text-muted-foreground text-sm">
                      {new Date(userPermission.expiresAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      userPermission.status === "active"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      userPermission.status === "active"
                        ? "bg-green-100 text-green-800"
                        : userPermission.status === "expired"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {userPermission.status}
                  </Badge>
                </TableCell>
                <TableCell>
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
                      <span className="text-muted-foreground px-2 text-xs">
                        Via Role
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUserPermissions.length === 0 && !loading && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No user permission assignments found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function UserPermissionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-6 w-56 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-36 animate-pulse rounded" />
      </div>

      <div className="bg-muted h-9 w-64 animate-pulse rounded" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-48 animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-24 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-16 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-12 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-16 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-16 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                    <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
