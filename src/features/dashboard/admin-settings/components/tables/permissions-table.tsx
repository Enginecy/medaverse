"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  mockPermissions,
  type Permission,
} from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { permissionsColumns } from "../columns/permissions-columns";

export function PermissionsTable() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadPermissions = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPermissions(mockPermissions);
      setLoading(false);
    };

    loadPermissions();
  }, []);

  return (
    <DataTable
      columns={permissionsColumns}
      data={permissions}
      searchKey="permissions"
      title="System Permissions"
      description="All available permissions in the system"
      addButton={{
        label: "Add Permission",
        onClick: () => console.log("Add permission"),
      }}
      isLoading={loading}
    />
  );
}
