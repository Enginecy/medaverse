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
import { Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

type Resource = {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  createdAt: string;
};

// Mock data - replace with actual API call
const mockResources: Resource[] = [
  {
    id: "1",
    name: "users",
    description: "User management and profiles",
    permissionCount: 5,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "sales",
    description: "Sales data and transactions",
    permissionCount: 5,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "reports",
    description: "Analytics and reporting",
    permissionCount: 3,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "companies",
    description: "Insurance companies",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "products",
    description: "Insurance products",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "roles",
    description: "User roles and assignments",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "permissions",
    description: "Permission management",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
];

export function ResourcesTable() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadResources = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResources(mockResources);
      setLoading(false);
    };

    loadResources();
  }, []);

  if (loading) {
    return <ResourcesTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">System Resources</h3>
          <p className="text-muted-foreground text-sm">
            Manage application resources and their permissions
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {resource.name}
                    </code>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{resource.description}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {resource.permissionCount} permissions
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {new Date(resource.createdAt).toLocaleDateString()}
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
    </div>
  );
}

function ResourcesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="bg-muted h-6 w-20 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-24 animate-pulse rounded" />
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
