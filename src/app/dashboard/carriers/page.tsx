import { Button } from "@/components/ui/button";
import { AddCarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import { CarriersList } from "@/features/dashboard/carriers/components/carriers-list";
import { useShowDrawer } from "@/lib/react-utils";
import { SquarePen } from "lucide-react";
import { use } from "react";

export default function CarriersPage() {
  const useDrawer = useShowDrawer();
  const handleAddClick = () => {
    useDrawer((resolve) => (
      <AddCarrierDrawer resolve={resolve} />
     ))
  };
  return (
    <div className="h-full w-full px-4">
      <div className="flex flex-row items-center justify-between p-4">
        <p className="text-2xl font-semibold">Carriers Connection</p>
        <Button variant="default" className="bg-primary-500 h-auto w-20" onClick={handleAddClick}>
          <SquarePen />
          Edit
        </Button>
      </div>
      <div
        className="w-full rounded-2xl border-2 bg-white p-6"
        style={{ minHeight: "calc(100% - 80px)" }}
      >
        <CarriersList />
      </div>
    </div>
  );
}
