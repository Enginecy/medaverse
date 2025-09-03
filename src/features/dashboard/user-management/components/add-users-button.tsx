"use client";

import { Button } from "@/components/ui/button";
import { AddUserDrawer } from "@/features/dashboard/user-management/components/form/add-user-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import { Plus } from "lucide-react";

export function AddUsersButton() {
  const showDrawer = useShowDrawer();

  const handleAddUser = async () => {
    await showDrawer((resolve) => <AddUserDrawer closeDrawer={resolve} />);
  };

  return (
    <Button
      variant="default"
      onClick={handleAddUser}
      className="text-primary w-35 cursor-pointer rounded-full bg-[#E5ECF6]
        shadow-none hover:bg-[#E5ECF6]/50"
    >
      Add User
      <Plus />
    </Button>
  );
}
