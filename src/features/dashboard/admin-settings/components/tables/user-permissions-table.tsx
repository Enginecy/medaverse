"use client";

import { DataTable } from "@/components/data-table";
import { userPermissionsColumns } from "@/features/dashboard/admin-settings/components/columns/user-permissions-columns";
import { getUserPermissions } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { useQuery } from "@tanstack/react-query";
import { useShowDrawer } from "@/lib/react-utils";
import { UserPermissionFormDialog } from "@/features/dashboard/admin-settings/components/modals/user-permission-form-dialog";

export function UserPermissionsTable() {
  const { data: userPermissions, isPending } = useQuery({
    queryKey: ["userPermissions"],
    queryFn: getUserPermissions,
  });

  const showDrawer = useShowDrawer();

  const handleShowDrawer = () => {
    showDrawer((resolve) => <UserPermissionFormDialog resolve={resolve} />);
  };

  return (
    <DataTable
      columns={userPermissionsColumns}
      isLoading={isPending}
      data={userPermissions!}
      title="User Permission Assignments"
      description="Direct permission assignments to users"
      addButton={{
        label: "Assign Permission",
        onClick: handleShowDrawer,
      }}
    />
  );
}
