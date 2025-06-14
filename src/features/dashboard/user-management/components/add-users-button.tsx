"use client";

import { Button } from "@/components/ui/button";
import { AddUserDrawer } from "@/features/dashboard/user-management/components/add-user-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import { Plus } from "lucide-react";

export function AddUsersButton() {
  const showDrawer = useShowDrawer();

  const handleAddUser = async () => {
    const result = await showDrawer((resolve) => (
      <AddUserDrawer resolve={resolve} />
    ));
    console.log(result);
  };

  return (
    <Button variant="default" onClick={handleAddUser}>
      Add User
      <Plus />
    </Button>
  );
}
