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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Search, X } from "lucide-react";

type UserRole = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: {
    id: string;
    name: string;
    code: string;
    level: number;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  assignedAt: string;
  expiresAt?: string;
  status: "active" | "expired" | "revoked";
};

// Mock data - replace with actual API call
const mockUserRoles: UserRole[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "John Smith",
      email: "john.smith@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r1",
      name: "Super Admin",
      code: "super_admin",
      level: 10,
    },
    assignedBy: {
      id: "admin",
      name: "System Admin",
    },
    assignedAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah.johnson@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r2",
      name: "Regional Director",
      code: "regional_director",
      level: 8,
    },
    assignedBy: {
      id: "u1",
      name: "John Smith",
    },
    assignedAt: "2024-01-15",
    status: "active",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Mike Wilson",
      email: "mike.wilson@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r3",
      name: "Lead Agent",
      code: "lead_agent",
      level: 6,
    },
    assignedBy: {
      id: "u2",
      name: "Sarah Johnson",
    },
    assignedAt: "2024-02-01",
    status: "active",
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Emily Brown",
      email: "emily.brown@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r4",
      name: "Associate",
      code: "associate",
      level: 4,
    },
    assignedBy: {
      id: "u3",
      name: "Mike Wilson",
    },
    assignedAt: "2024-02-15",
    expiresAt: "2024-08-15",
    status: "active",
  },
];

export function UserRolesTable() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [filteredUserRoles, setFilteredUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    const loadUserRoles = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserRoles(mockUserRoles);
      setFilteredUserRoles(mockUserRoles);
      setLoading(false);
    };

    loadUserRoles();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUserRoles(userRoles);
    } else {
      const filtered = userRoles.filter(
        (userRole) =>
          userRole.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userRole.user.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userRole.role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userRole.role.code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredUserRoles(filtered);
    }
  }, [searchTerm, userRoles]);

  if (loading) {
    return <UserRolesTableSkeleton />;
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
          <h3 className="text-lg font-medium">User Role Assignments</h3>
          <p className="text-muted-foreground text-sm">
            Current role assignments for users
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Assign Role
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
              -translate-y-1/2"
          />
          <Input
            placeholder="Search users or roles..."
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
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUserRoles
              .sort((a, b) => b.role.level - a.role.level)
              .map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userRole.user.avatar} />
                        <AvatarFallback>
                          {userRole.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{userRole.user.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {userRole.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{userRole.role.name}</div>
                      <code className="text-muted-foreground text-xs">
                        {userRole.role.code}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getLevelColor(userRole.role.level)}
                    >
                      Level {userRole.role.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{userRole.assignedBy.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {new Date(userRole.assignedAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {userRole.expiresAt ? (
                      <span className="text-muted-foreground text-sm">
                        {new Date(userRole.expiresAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Never
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        userRole.status === "active" ? "default" : "secondary"
                      }
                      className={
                        userRole.status === "active"
                          ? "bg-green-100 text-green-800"
                          : userRole.status === "expired"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {userRole.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {filteredUserRoles.length === 0 && !loading && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No user role assignments found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function UserRolesTableSkeleton() {
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
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
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
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
                    <div className="space-y-1">
                      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-48 animate-pulse rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                  </div>
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
