import { AddCarrierButton } from "@/features/dashboard/carriers/components/add-carrier-button";
import { CarriersList } from "@/features/dashboard/carriers/components/carriers-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carriers Connection - Dashboard",
  description: "Manage your carriers and their connections.",
};
export default function CarriersPage() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 md:p-4">
        <p className="text-xl md:text-2xl font-semibold">Carriers Connection</p>
        <AddCarrierButton />
      </div>
      <div
        className="w-full rounded-2xl border-1 bg-white p-4 md:p-6"
        style={{ minHeight: "calc(100% - 80px)" }}
      >
        <CarriersList />
      </div>
    </div>
  );
}
