"use client";

import { DataTable } from "@/components/data-table";

import { permissionsColumns } from "../columns/permissions-columns";
import { getPermissions } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { useQuery } from "@tanstack/react-query";

export function PermissionsTable() {
  const { data: permissions, isPending } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  return (
    <DataTable
      columns={permissionsColumns}
      data={permissions!}
      isLoading={isPending}
      searchKey="permissions"
      title="System Permissions"
      description="All available permissions in the system"
    />
  );
}
