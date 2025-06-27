"use client";

import { DataTable } from "@/components/data-table";
import { userRolesColumns } from "@/features/dashboard/admin-settings/components/columns/user-roles-columns";
import { useQuery } from "@tanstack/react-query";
import { getUserRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { useShowDrawer } from "@/lib/react-utils";
import { UserRoleFormDialog } from "@/features/dashboard/admin-settings/components/modals/user-role-form-dialog";
export function UserRolesTable() {
  const { data: userRoles, isPending } = useQuery({
    queryKey: ["userRoles"],
    queryFn: getUserRoles,
  });

  const showDrawer = useShowDrawer();

  const handleShowDrawer = () => {
    showDrawer((resolve) => <UserRoleFormDialog resolve={resolve} />);
  };

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
        onClick: handleShowDrawer,
      }}
    />
  );
}
