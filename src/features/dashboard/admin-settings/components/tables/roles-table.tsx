"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  mockRoles,
  type Role,
} from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { rolesColumns } from "@/features/dashboard/admin-settings/components/columns/roles-columns";

export function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadRoles = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Sort by level in descending order
      setRoles(mockRoles.sort((a, b) => b.level - a.level));
      setLoading(false);
    };

    loadRoles();
  }, []);

  return (
    <DataTable
      columns={rolesColumns}
      data={roles}
      searchKey="roles"
      title="User Roles"
      description="Manage user roles and their permission levels"
      addButton={{
        label: "Add Role",
        onClick: () => console.log("Add role"),
      }}
      isLoading={loading}
    />
  );
}
