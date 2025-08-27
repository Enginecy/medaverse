"use client";

import { Button } from "@/components/ui/button";
import { CarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import { Plus } from "lucide-react";
import { AllowPermissions } from "@/lib/supabase/roles-component";

export function AddCarrierButton() {
  const showDrawer = useShowDrawer();
  const handleAddClick = () => {
    showDrawer((resolve) => <CarrierDrawer resolve={resolve} />);
  };

  return (
    <AllowPermissions 
      permissions={["companies:create"]}
      fallback={null}
    >
      <Button
        variant="default"
        className="bg-primary-500 h-auto w-30"
        onClick={handleAddClick}
      >
        <Plus />
        Add Carrier
      </Button>
    </AllowPermissions>
  );
}
