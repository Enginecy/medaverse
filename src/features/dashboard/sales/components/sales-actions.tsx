"use client";
import { Button } from "@/components/ui/button";
import { AddSaleDrawer } from "@/features/dashboard/sales/components/add-sale-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import { Download, Plus } from "lucide-react";

export function SalesActions() {
  const showDrawer = useShowDrawer();
  const openAddNewSaleModal = () => {
    showDrawer((resolve) => {
      return <AddSaleDrawer closeDrawer={resolve} />;
    });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <Download />
        Download Xlsx
      </Button>
      <Button variant="default" onClick={openAddNewSaleModal}>
        <Plus />
        Add New
      </Button>
    </div>
  );
}
