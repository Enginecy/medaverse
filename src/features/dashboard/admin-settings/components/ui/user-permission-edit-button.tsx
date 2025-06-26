"use client";

import { Button } from "@/components/ui/button";
import { UserPermissionFormDialog } from "@/features/dashboard/admin-settings/components/modals/user-permission-form-dialog";
import type { UserPermissionFormSchemaData } from "@/features/dashboard/admin-settings/schemas/user-permission";
import { useShowDrawer } from "@/lib/react-utils";
import { Edit } from "lucide-react";

export function UserPermissionEditButton({
  userPermission,
}: {
  userPermission: UserPermissionFormSchemaData;
}) {
  const showDrawer = useShowDrawer();

  const handleShowDrawer = () => {
    showDrawer((resolve) => (
      <UserPermissionFormDialog resolve={resolve} data={userPermission} />
    ));
  };
  return (
    <Button onClick={handleShowDrawer} variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  );
}
