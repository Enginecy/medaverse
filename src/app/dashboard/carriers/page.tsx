import { AddCarrierButton } from "@/features/dashboard/carriers/components/add-carrier-button";
import { CarriersList } from "@/features/dashboard/carriers/components/carriers-list";

export default function CarriersPage() {

  return (
    <div className="h-full w-full px-4">
      <div className="flex flex-row items-center justify-between p-4">
        <p className="text-2xl font-semibold">Carriers Connection</p>
        <AddCarrierButton />
      </div>
      <div
        className="w-full rounded-2xl border-1 bg-white p-6"
        style={{ minHeight: "calc(100% - 80px)" }}
      >
        <CarriersList />
      </div>
    </div>
  );
}
