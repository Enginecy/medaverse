"use client";

import { NewsDataTable } from "@/features/dashboard/docs/components/datatable/news-data-table";
import { columns } from "@/features/dashboard/docs/components/datatable/columns";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/features/dashboard/docs/server/db/docs";

export default function NewsPage() {
  const { data: docs, isPending } = useQuery({
    queryKey: ["docs"],
    queryFn: () => getNews(),
  });

  return (
    <NewsDataTable
      columns={columns}
      data={docs ?? []}
      isLoading={isPending}
    />
  );
}
