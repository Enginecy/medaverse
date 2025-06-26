"use client";

import { DataTable } from "@/components/data-table";
import { rolesColumns } from "@/features/dashboard/admin-settings/components/columns/roles-columns";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";

export function RolesTable() {
  const { data: roles, isPending } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <DataTable
      columns={rolesColumns}
      data={roles!}
      isLoading={isPending}
      searchKey="roles"
      title="User Roles"
      description="Manage user roles and their permission levels"
      addButton={{
        label: "Add Role",
        onClick: () => console.log("Add role"),
      }}
    />
  );
}
