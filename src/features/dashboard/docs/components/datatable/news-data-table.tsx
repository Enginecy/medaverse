import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export function NewsDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}) {
  return (
    <div className="py-5">
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data}
        enableColumnFilter={true}
        enableColumnVisability={true}
        enableDateFilter={true}
        enableGlobalSearch={true}
      />
    </div>
  );
}
//TODO: make the date filter key
