"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  mockResources,
  type Resource,
} from "@/features/dashboard/admin-settings/data/admin-settings-data";
import { resourcesColumns } from "@/features/dashboard/admin-settings/components/columns/resources-columns";

export function ResourcesTable() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadResources = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResources(mockResources);
      setLoading(false);
    };

    loadResources();
  }, []);

  return (
    <DataTable
      columns={resourcesColumns}
      data={resources}
      searchKey="resources"
      title="System Resources"
      description="Manage application resources and their permissions"
      addButton={{
        label: "Add Resource",
        onClick: () => console.log("Add resource"),
      }}
      isLoading={loading}
    />
  );
}
