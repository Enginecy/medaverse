"use client";

import { DataTable } from "@/components/data-table";
import { userRolesColumns } from "@/features/dashboard/admin-settings/components/columns/user-roles-columns";
import { useQuery } from "@tanstack/react-query";
import { getUserRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
export function UserRolesTable() {
  const { data: userRoles, isPending } = useQuery({
    queryKey: ["userRoles"],
    queryFn: getUserRoles,
  });

  return (
    <DataTable
      columns={userRolesColumns}
      data={userRoles!}
      isLoading={isPending}
      searchKey="users or roles"
      title="User Role Assignments"
      description="Current role assignments for users"
      addButton={{
        label: "Assign Role",
        onClick: () => console.log("Assign role"),
      }}
    />
  );
}
