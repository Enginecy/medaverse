"use client";

import { DataTable } from "@/components/data-table";
import { resourcesColumns } from "@/features/dashboard/admin-settings/components/columns/resources-columns";
import { getResources } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { useQuery } from "@tanstack/react-query";

export function ResourcesTable() {
  const { data: resources, isPending } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  return (
    <DataTable
      columns={resourcesColumns}
      data={resources!}
      isLoading={isPending}
      searchKey="resources"
      title="System Resources"
      description="View application resources and their permissions"
    />
  );
}
