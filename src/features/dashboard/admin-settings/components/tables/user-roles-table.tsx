"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  mockUserRoles,
  type UserRole,
} from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { userRolesColumns } from "@/features/dashboard/admin-settings/components/columns/user-roles-columns";
export function UserRolesTable() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadUserRoles = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Sort by role level in descending order
      setUserRoles(mockUserRoles.sort((a, b) => b.role.level - a.role.level));
      setLoading(false);
    };

    loadUserRoles();
  }, []);

  return (
    <DataTable
      columns={userRolesColumns}
      data={userRoles}
      searchKey="users or roles"
      title="User Role Assignments"
      description="Current role assignments for users"
      addButton={{
        label: "Assign Role",
        onClick: () => console.log("Assign role"),
      }}
      isLoading={loading}
    />
  );
}
