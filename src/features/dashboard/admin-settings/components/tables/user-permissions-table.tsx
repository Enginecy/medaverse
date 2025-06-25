"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  mockUserPermissions,
  type UserPermission,
} from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { userPermissionsColumns } from "@/features/dashboard/admin-settings/components/columns/user-permissions-columns";

export function UserPermissionsTable() {
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadUserPermissions = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserPermissions(mockUserPermissions);
      setLoading(false);
    };

    loadUserPermissions();
  }, []);

  return (
    <DataTable
      columns={userPermissionsColumns}
      data={userPermissions}
      searchKey="users or permissions"
      title="User Permission Assignments"
      description="Direct permission assignments to users"
      addButton={{
        label: "Assign Permission",
        onClick: () => console.log("Assign permission"),
      }}
      isLoading={loading}
    />
  );
}
