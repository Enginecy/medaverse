"use client";

import { DataTable } from "@/features/dashboard/docs/components/datatable/data-table";
import { columns } from "@/features/dashboard/docs/components/datatable/columns";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/features/dashboard/docs/server/db/docs";

export default function NewsPage() {
  const { data: docs, isPending } = useQuery({
    queryKey: ["docs"],
    queryFn: () => getNews(),
  });

  return (
    <DataTable
      columns={columns}
      data={docs ?? []}
      searchKey="fileName"
      isLoading={isPending}
    />
  );
}
