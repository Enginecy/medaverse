"use client";

import * as React from "react";
import { salesColumnsDef } from "@/features/dashboard/sales/components/datatable/columns";
import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import { DataTable } from "@/components/data-table";
import { SaleInfoDrawer } from "@/features/dashboard/sales/components/sale-info-drawer";
import { useShowDrawer } from "@/lib/react-utils";

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const showDrawer = useShowDrawer();
  const handleRowClick = (sale: Sale) => {
    showDrawer(() => <SaleInfoDrawer selectedRow={sale} />);
  };

  return (
    <DataTable
      columns={salesColumnsDef}
      data={sales}
      enableColumnFilter={true}
      enableColumnVisability={true}
      enableGlobalSearch={true}
      enableDateFilter={true}
      dateFilterKey="saleDate"
      onRowClick={handleRowClick}
    />
  );
}
