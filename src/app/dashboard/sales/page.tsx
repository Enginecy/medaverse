import { SalesActions } from "@/features/dashboard/sales/components/sales-actions";
import { SalesTable } from "@/features/dashboard/sales/components/datatable/data-table";

export default function SalesPage() {
  return (
    <div className="flex w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-semibold">Sales</h1>
        <SalesActions />
      </div>
      <SalesTable />
    </div>
  );
}
