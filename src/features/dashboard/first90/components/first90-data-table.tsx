import { first90Columns } from "@/features/dashboard/first90/components/columns";
import { getFirst90Users } from "@/features/dashboard/first90/server/db/first90";
import { DataTable } from "@/components/data-table";
import { First90Actions } from "@/features/dashboard/first90/components/first90-actions";

export async function First90DataTable() {
  const users = await getFirst90Users();

  return (
    <DataTable
      columns={first90Columns}
      data={users ?? []}
      enableColumnFilter={false}
      enableColumnVisability={true}
      enableGlobalSearch={true}
      enableDateFilter={false}
      action={<First90Actions />}
    />
  );
}

