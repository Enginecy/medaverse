'use server';

import * as React from "react";
import { salesColumnsDef } from "@/features/dashboard/sales/components/datatable/columns";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { DataTable } from "@/components/data-table";

export async function SalesTable() {
  const sales  = await getSales();
  // TODO: Implement the sale info drawer

  return (
    <div className="py-6">
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
