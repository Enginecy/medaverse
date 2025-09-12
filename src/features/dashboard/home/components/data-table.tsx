import { DataTable } from "@/components/data-table";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { recentSalesColumns } from "@/features/dashboard/home/components/columns";
import { getUser } from "@/lib/supabase/server";

export async function RecentSalesDataTable() {
  const user = await getUser();
  const sales = await getSales(user.user.id).then((sales) => sales.slice(0, 5));
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
