
import { CommissionCard } from "@/features/dashboard/home/components/commission-card";
import { SalesCard } from "@/features/dashboard/home/components/sales-card";

export function CommissionAndSalesCards() {
  return (
    <div className="flex w-full flex-col items-center gap-2 md:flex-row">
      {/* <CommissionCard title="Commission" range={{ min: 4200, max: 12000 }} /> */}
      <SalesCard />
    </div>
  );
}
