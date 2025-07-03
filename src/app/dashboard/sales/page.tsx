import { SalesActions } from "@/features/dashboard/sales/components/sales-actions";
import { SalesTable } from "@/features/dashboard/sales/components/datatable/sales-data-table";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Sales",
  description: "Manage your sales data and insights.",
};
export default function SalesPage() {
  return (
    <div className="flex h-full w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-semibold">Sales</h1>
        <SalesActions />
      </div>
      <Card className="w-full grow py-0">
        <CardContent className="grow">
          <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <SalesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
