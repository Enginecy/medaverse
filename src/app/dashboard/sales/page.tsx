import { SalesActions } from "@/features/dashboard/sales/components/sales-actions";
import { SalesTable } from "@/features/dashboard/sales/components/datatable/sales-data-table";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table";
export const metadata: Metadata = {
  title: "Sales",
  description: "Manage your sales data and insights.",
};
export default function SalesPage() {
  return (
    <div className="flex h-full w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">Sales</h1>
        <SalesActions />
      </div>
      <Card className="w-full grow py-0">
        <CardContent className="grow p-0">
          <Suspense fallback={<DataTableSkeleton />}>
            <SalesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
