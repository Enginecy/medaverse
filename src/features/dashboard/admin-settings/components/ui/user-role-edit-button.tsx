"use client";

import { Button } from "@/components/ui/button";
import { UserRoleFormDialog } from "@/features/dashboard/admin-settings/components/modals/user-role-form-dialog";
import type { UserRoleFormSchemaData } from "@/features/dashboard/admin-settings/schemas/user-role";
import { useShowDrawer } from "@/lib/react-utils";
import { Edit } from "lucide-react";

export function UserRoleEditButton({
  userRole,
}: {
  userRole: UserRoleFormSchemaData;
}) {
  const showDrawer = useShowDrawer();

  const handleShowDrawer = () => {
    showDrawer((resolve) => (
      <UserRoleFormDialog resolve={resolve} data={userRole} />
    ));
  };
  return (
    <Button onClick={handleShowDrawer} variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  );
}
