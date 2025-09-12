import * as React from "react";
import { salesColumnsDef } from "@/features/dashboard/sales/components/datatable/columns";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { DataTable } from "@/components/data-table";
import { getUser } from "@/lib/supabase/server";

export async function SalesTable() {
  const user = await getUser();
  const sales  = await getSales(user.user.id);
  // TODO: Implement the sale info drawer

  return (
    <div className="p-6">
      <DataTable
        columns={salesColumnsDef}
        data={sales }
        enableColumnFilter={true}
        enableColumnVisability={true}
        enableGlobalSearch={true}
        enableDateFilter={true}
        dateFilterKey="saleDate"
      />
    </div>
  );
}
