"use client";

import { Button } from "@/components/ui/button";
import { AddCarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import {Plus } from "lucide-react";

export function AddCarrierButton() {
  const useDrawer = useShowDrawer();
  const handleAddClick = () => {
    useDrawer((resolve) => <AddCarrierDrawer resolve={resolve} />);
  };

  return (
    <Button
      variant="default"
      className="bg-primary-500 h-auto w-30"
      onClick={handleAddClick}
    >
      <Plus />
      Add Carrier
    </Button>
  );
}
