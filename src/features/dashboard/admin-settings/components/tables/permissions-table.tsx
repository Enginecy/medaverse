import { DataTable } from "@/components/data-table";

import { permissionsColumns } from "../columns/permissions-columns";
import { getPermissions } from "@/features/dashboard/admin-settings/server/db/admin-settings";
export async function PermissionsTable() {
  const permissions = await getPermissions();

  return (
    <DataTable
      title="System Permissions"
      description="All available permissions in the system"
      enableGlobalSearch
      enableColumnVisability
      enableColumnFilter
      pageCount={10}
      columns={permissionsColumns}
      data={permissions}
      footer={<div>Total {permissions.length} permissions</div>}
    />
  );
}
