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
import { Plus, Edit, Search } from "lucide-react";

type Permission = {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  createdAt: string;
};

// Mock data - replace with actual API call
const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "users:read",
    resource: "users",
    action: "read",
    description: "View user information",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "users:create",
    resource: "users",
    action: "create",
    description: "Create new users",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "users:update",
    resource: "users",
    action: "update",
    description: "Update user information",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "users:delete",
    resource: "users",
    action: "delete",
    description: "Delete users",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "sales:read",
    resource: "sales",
    action: "read",
    description: "View sales data",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "sales:create",
    resource: "sales",
    action: "create",
    description: "Create new sales",
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "sales:update",
    resource: "sales",
    action: "update",
    description: "Update sales records",
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    name: "sales:delete",
    resource: "sales",
    action: "delete",
    description: "Delete sales records",
    createdAt: "2024-01-01",
  },
  {
    id: "9",
    name: "reports:read",
    resource: "reports",
    action: "read",
    description: "View reports",
    createdAt: "2024-01-01",
  },
  {
    id: "10",
    name: "reports:create",
    resource: "reports",
    action: "create",
    description: "Create reports",
    createdAt: "2024-01-01",
  },
];

export function PermissionsTable() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    const loadPermissions = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPermissions(mockPermissions);
      setFilteredPermissions(mockPermissions);
      setLoading(false);
    };

    loadPermissions();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.resource
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredPermissions(filtered);
    }
  }, [searchTerm, permissions]);

  if (loading) {
    return <PermissionsTableSkeleton />;
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
          <h3 className="text-lg font-medium">System Permissions</h3>
          <p className="text-muted-foreground text-sm">
            All available permissions in the system
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Permission
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
              -translate-y-1/2"
          />
          <Input
            placeholder="Search permissions..."
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
              <TableHead>Permission</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>
                  <code className="bg-muted rounded px-2 py-1 text-sm">
                    {permission.name}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{permission.resource}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getActionColor(permission.action)}
                  >
                    {permission.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{permission.description}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {new Date(permission.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredPermissions.length === 0 && !loading && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No permissions found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function PermissionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded" />
      </div>

      <div className="bg-muted h-9 w-64 animate-pulse rounded" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
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
                  <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
