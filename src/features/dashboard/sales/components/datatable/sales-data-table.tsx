"use client";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { salesColumnsDef } from "@/features/dashboard/sales/components/datatable/columns";
import { useQuery } from "@tanstack/react-query";

import { ErrorComponent } from "@/components/ui/error-component";
import { UserTableSkeleton } from "@/components/ui/user-table-skeleton";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

import { SaleInfoDrawer } from "@/features/dashboard/sales/components/sale-info-drawer";
import { useShowDrawer } from "@/lib/react-utils";
import { DataTable } from "@/components/data-table";

export function SalesTable() {
  const showDrawer = useShowDrawer();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

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

  const table = useReactTable({
    data: sales!,
    columns: salesColumnsDef,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // const [drawerOpen, setDrawerOpen] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<any>(null);

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

  const rowCount = sales?.[0]?._count;

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  // TODO: Implement the sale info drawer 
  return (
    <div className="py-6">

    <DataTable
      columns={salesColumnsDef}
      data={sales}
      enableColumnFilter={true}
      enableColumnVisability={true}
      enableGlobalSearch={true}
      enableDateFilter= {true}
      dateFilterKey="saleDate"
    />

      </div>
    // <div className="flex h-full w-full flex-col">
    //   <Header />
    //   <div
    //     className="max-h-[calc(100vh-350px)] overflow-y-scroll rounded-md
    //       border"
    //   >
    //     <Table>
    //       <TableHeader className="bg-muted sticky top-0 z-10">
    //         {table.getHeaderGroups().map((headerGroup) => (
    //           <TableRow key={headerGroup.id}>
    //             {headerGroup.headers.map((header) => {
    //               return (
    //                 <TableHead key={header.id}>
    //                   {header.isPlaceholder
    //                     ? null
    //                     : flexRender(
    //                         header.column.columnDef.header,
    //                         header.getContext(),
    //                       )}
    //                 </TableHead>
    //               );
    //             })}
    //           </TableRow>
    //         ))}
    //       </TableHeader>
    //       <TableBody>
    //         {table.getRowModel().rows?.length ? (
    //           table.getRowModel().rows.map((row) => (
    //             <TableRow
    //               key={row.id}
    //               className="hover:bg-muted cursor-pointer"
    //               onClick={() => {
    //                 showDrawer((resolve) => (
    //                   <SaleInfoDrawer
    //                     // closeDrawer={resolve}
    //                     selectedRow={row.original}
    //                   />
    //                 ));
    //               }}
    //             >
    //               {row.getVisibleCells().map((cell) => (
    //                 <TableCell key={cell.id}>
    //                   {flexRender(
    //                     cell.column.columnDef.cell,
    //                     cell.getContext(),
    //                   )}
    //                 </TableCell>
    //               ))}
    //             </TableRow>
    //           ))
    //         ) : (
    //           <TableRow>
    //             <TableCell
    //               colSpan={columns.length}
    //               className="h-24 text-center"
    //             >
    //               No results.
    //             </TableCell>
    //           </TableRow>
    //         )}
    //       </TableBody>
    //     </Table>
    //   </div>
    //   <div className="grow" />
    //   <Footer />
    // </div>
  );

  function Header() {
    const initialDateFrom = new Date(
      new Date().setDate(new Date().getDate() - 30),
    );
    const initialDateTo = new Date();
    return (
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter sales..."
          value={
            (table.getColumn("customerName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="grow" />
        <DateRangePicker
          onUpdate={(values) => console.log(values)}
          initialDateFrom={initialDateFrom}
          initialDateTo={initialDateTo}
          align="start"
          locale="en-GB"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  function Footer() {
    return (
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {"Total Sales: "}
          <span className="text-foreground font-bold">{rowCount}</span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={table.previousPage}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={table.nextPage}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}
