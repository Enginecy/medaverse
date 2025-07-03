"use client";

import { DataTable } from "@/components/data-table";
import { rolesColumns } from "@/features/dashboard/admin-settings/components/columns/roles-columns";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { useShowDrawer } from "@/lib/react-utils";
import { RolesFormSheet } from "@/features/dashboard/admin-settings/components/modals/roles-form-sheet";

export function RolesTable() {
  const { data: roles, isPending } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const showDrawer = useShowDrawer();

  const handleShowDrawer = () => {
    showDrawer((resolve) => <RolesFormSheet resolve={resolve} />);
  };

  return (
    <DataTable
      columns={rolesColumns}
      data={roles!}
      isLoading={isPending}
      title="User Roles"
      description="Manage user roles and their permission levels"
      addButton={{
        label: "Add Role",
        onClick: handleShowDrawer,
      }}
    />
  );
}
