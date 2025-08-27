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
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" className="min-h-[44px]">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download Xlsx</span>
        <span className="sm:hidden">Download</span>
      </Button>
      <Button variant="default" onClick={openAddNewSaleModal} className="min-h-[44px]">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add New</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  );
}
