"use client";

import { Button } from "@/components/ui/button";
import { CarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import {Plus } from "lucide-react";

export function AddCarrierButton() {
  const showDrawer = useShowDrawer();
  const handleAddClick = () => {
    showDrawer((resolve) => <CarrierDrawer resolve={resolve} />);
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
