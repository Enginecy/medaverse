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
import { Plus, Edit, Search, Users } from "lucide-react";

type Role = {
  id: string;
  name: string;
  code: string;
  description: string;
  level: number;
  userCount: number;
  permissionCount: number;
  status: "active" | "disabled";
  createdAt: string;
};

// Mock data - replace with actual API call
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    code: "super_admin",
    description: "Full system access",
    level: 10,
    userCount: 2,
    permissionCount: 25,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Regional Director",
    code: "regional_director",
    description: "Regional management and oversight",
    level: 8,
    userCount: 5,
    permissionCount: 18,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Lead Agent",
    code: "lead_agent",
    description: "Team lead with additional permissions",
    level: 6,
    userCount: 12,
    permissionCount: 12,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Associate",
    code: "associate",
    description: "Standard agent permissions",
    level: 4,
    userCount: 45,
    permissionCount: 8,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Sales Manager",
    code: "sales_manager",
    description: "Sales team management",
    level: 7,
    userCount: 8,
    permissionCount: 15,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Trainee",
    code: "trainee",
    description: "Limited access for new hires",
    level: 2,
    userCount: 15,
    permissionCount: 4,
    status: "active",
    createdAt: "2024-01-01",
  },
];

export function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    const loadRoles = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRoles(mockRoles);
      setFilteredRoles(mockRoles);
      setLoading(false);
    };

    loadRoles();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredRoles(filtered);
    }
  }, [searchTerm, roles]);

  if (loading) {
    return <RolesTableSkeleton />;
  }

  const getLevelColor = (level: number) => {
    if (level >= 9) return "bg-red-100 text-red-800";
    if (level >= 7) return "bg-orange-100 text-orange-800";
    if (level >= 5) return "bg-yellow-100 text-yellow-800";
    if (level >= 3) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Roles</h3>
          <p className="text-muted-foreground text-sm">
            Manage user roles and their permission levels
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
              -translate-y-1/2"
          />
          <Input
            placeholder="Search roles..."
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
              <TableHead>Role</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles
              .sort((a, b) => b.level - a.level)
              .map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {role.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {role.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getLevelColor(role.level)}
                    >
                      Level {role.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {role.permissionCount} permissions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        role.status === "active" ? "default" : "secondary"
                      }
                      className={
                        role.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {role.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {new Date(role.createdAt).toLocaleDateString()}
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

      {filteredRoles.length === 0 && !loading && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No roles found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function RolesTableSkeleton() {
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
              <TableHead>Role</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
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
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-24 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-16 animate-pulse rounded" />
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
