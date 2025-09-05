'use client';
import { Button } from "@/components/ui/button";
import { AddGoalDrawer } from "@/features/dashboard/profile/components/modals/add-goal-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import { PlusIcon } from "lucide-react";

export function AddGoalButton() {
  const showDrawer = useShowDrawer();

  const handleOpen = () => {
    showDrawer((resolve) => <AddGoalDrawer resolve={resolve} />);
  };

  return (
    <Button onClick={handleOpen} className="w-35 cursor-pointer rounded-full bg-primary shadow-none">
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Goal
    </Button>
  );
}
