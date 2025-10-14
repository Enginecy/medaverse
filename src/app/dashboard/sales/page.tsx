import { SalesActions } from "@/features/dashboard/sales/components/sales-actions";
import { SalesTable } from "@/features/dashboard/sales/components/datatable/sales-data-table";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { ErrorComponent } from "@/components/ui/error-component";
import { getUserProfile } from "@/features/dashboard/home/server/db/home";

export const metadata: Metadata = {
  title: "Sales",
  description: "Manage your sales data and insights.",
};

export default async function SalesPage() {
  const user = await getUserProfile();
  if (!user) return <ErrorComponent />;
  
  const sales = await getSales();

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">Sales</h1>
        <SalesActions />
      </div>
      <Card className="w-full grow rounded-3xl border-0 shadow-none p-6">
        <CardContent className="grow p-0">
          <SalesTable sales={sales} />
        </CardContent>
      </Card>
    </div>
  );
}
