import { DataTable } from "@/components/data-table";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { recentSalesColumns } from "@/features/dashboard/home/components/columns";
import { getUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/features/dashboard/home/server/db/home";
import { ErrorComponent } from "@/components/ui/error-component";

export async function RecentSalesDataTable() {
  const user = await getUserProfile();
  if (!user) return <ErrorComponent />;
  const sales = await getSales(
    user!.id,
    user!.role?.name === "Super Administrator",
  );
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
