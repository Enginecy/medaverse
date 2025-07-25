import * as React from "react";

import { userManagementColumns } from "@/features/dashboard/user-management/components/columns";
import { getUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { DataTable } from "@/components/data-table";
import { UsersActions } from "@/features/dashboard/user-management/components/user-actions";

export async function UserManagementTable() {
  const users = await getUsers();

  return (
    <DataTable
      columns={userManagementColumns}
      data={users ?? []}
      enableColumnFilter={true}
      enableColumnVisability={true}
      enableGlobalSearch={true}
      enableDateFilter={false}
      action ={
        <UsersActions />
      }
    />
  );
}
