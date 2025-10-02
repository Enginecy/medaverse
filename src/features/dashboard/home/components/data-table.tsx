import { DataTable } from "@/components/data-table";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { recentSalesColumns } from "@/features/dashboard/home/components/columns";


export async function RecentSalesDataTable() {
  const sales = await getSales();
  // TODO: enable pages or not
  return (
    <DataTable
      columns={recentSalesColumns}
      data={sales}
      enableColumnFilter={false}
      enableGlobalSearch={false}
      enableColumnVisability={false}
      enableDateFilter={false}
      enablePagination={false}
    />
  );
}
