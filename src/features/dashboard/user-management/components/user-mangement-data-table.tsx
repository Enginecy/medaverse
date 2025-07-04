"use client";

import * as React from "react";

import { userManagementColumns } from "@/features/dashboard/user-management/components/columns";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { ErrorComponent } from "@/components/ui/error-component";
import { UserTableSkeleton } from "@/components/ui/user-table-skeleton";
import { DataTable } from "@/components/data-table";

export function UserManagementTable() {
  const {
    data: users,
    isPending,
    isFetching,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
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

  return (
    <DataTable
      columns={userManagementColumns}
      data={users ?? []}
      enableColumnFilter={true}
      enableColumnVisability={true}
      enableGlobalSearch={true}
      enableDateFilter={false}
    />
  );
}
