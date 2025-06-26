"use client";

import { Button } from "@/components/ui/button";
import { RolesFormSheet } from "@/features/dashboard/admin-settings/components/modals/roles-form-sheet";
import type { RolesFormSchemaData } from "@/features/dashboard/admin-settings/schemas/roles";
import { useShowDrawer } from "@/lib/react-utils";
import { Edit } from "lucide-react";

export function RolesEditButton({ role }: { role: RolesFormSchemaData }) {
  const showDrawer = useShowDrawer();

  const handleShowDrawer = () => {
    showDrawer((resolve) => <RolesFormSheet resolve={resolve} data={role} />);
  };
  return (
    <Button onClick={handleShowDrawer} variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  );
}
