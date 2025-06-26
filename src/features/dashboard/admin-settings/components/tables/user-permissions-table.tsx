"use client";

import { DataTable } from "@/components/data-table";
import { userPermissionsColumns } from "@/features/dashboard/admin-settings/components/columns/user-permissions-columns";
import { getUserPermissions } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { useQuery } from "@tanstack/react-query";

export function UserPermissionsTable() {
  const { data: userPermissions, isPending } = useQuery({
    queryKey: ["userPermissions"],
    queryFn: getUserPermissions,
  });

  return (
    <DataTable
      columns={userPermissionsColumns}
      isLoading={isPending}
      data={userPermissions!}
      searchKey="users or permissions"
      title="User Permission Assignments"
      description="Direct permission assignments to users"
      addButton={{
        label: "Assign Permission",
        onClick: () => console.log("Assign permission"),
      }}
    />
  );
}
