import { Button } from "@/components/ui/button";
import { CarriersList } from "@/features/dashboard/carriers/components/carriers-list";
import { SquarePen } from "lucide-react";

export default function CarriersPage() {
  return (
    <div className="h-full w-full px-4">
      <div className="flex flex-row items-center justify-between p-4">
        <p className="text-2xl font-semibold">Carriers Connection</p>
        <Button variant="default" className="bg-primary-500 h-auto w-20">
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
