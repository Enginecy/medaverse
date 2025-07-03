"use client";

import * as React from "react";
import { salesColumnsDef } from "@/features/dashboard/sales/components/datatable/columns";
import { useQuery } from "@tanstack/react-query";
import { ErrorComponent } from "@/components/ui/error-component";
import { UserTableSkeleton } from "@/components/ui/user-table-skeleton";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { DataTable } from "@/components/data-table";

export function SalesTable() {
  const {
    data: sales,
    isPending,
    isFetching,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  if (isPending || (isFetching && isError))
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <UserTableSkeleton />
      </div>
    );
  if (isError)
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center">
        <ErrorComponent message={error.message} onRetry={refetch} />
      </div>
    );

  // TODO: Implement the sale info drawer
  return (
    <div className="py-6">
      <DataTable
        columns={salesColumnsDef}
        data={sales ?? []}
        enableColumnFilter={true}
        enableColumnVisability={true}
        enableGlobalSearch={true}
        enableDateFilter={true}
        dateFilterKey="saleDate"
      />
    </div>
  );
}
