"use client";

import { FilterPanel } from "@/components/data-table/filter-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type Table as ReactTable,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronDown,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface DataTableProps<TData, TValue> {
  /**
   * Title to display in the top left corner of the table.
   */
  title?: string;
  /**
   * Description to display in the top left corner of the table below the title.
   */
  description?: string;
  /**
   * Key to filter by date (defaults to "createdAt") it should be a date type
   */
  dateFilterKey?: keyof TData;
  /**
   * Page count to allow table to be paginated.
   */
  pageCount?: number;
  /**
   * Columns definition for the table.
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Data to display in the table.
   */
  data: TData[];
  /**
   * Actions to display in the top right corner of the table.
   */
  action?: React.ReactNode;

  /**
   * Action to display in the top right corner of the table when rows are selected.
   */
  multiSelectAction?: (selectedRows: TData[]) => React.ReactNode;

  /**
   * footer to display in the bottom left corner of the table.
   */
  footer?: React.ReactNode;

  /**
   * footer to display in the bottom left corner of the table when rows are selected.
   */
  multiSelectFooter?: (selectedRows: TData[]) => React.ReactNode;

  /**
   * @deprecated This prop is deprecated and will be removed in a future release. Use actions instead.
   */
  addButton?: {
    label: string;
    onClick: () => void | Promise<void>;
  };
  /**
   * A flag to show a loading skeleton state in case of used in a client component. rather than [Suspense]
   */
  isLoading?: boolean;
  /**
   * A flag to show a loading skeleton state in case of used in a client component. rather than [Suspense]
   */
  enableColumnVisability?: boolean;
  /**
   * Enable date filtering functionality
   */
  enableDateFilter?: boolean;
  /**
   * Enable global search functionality
   */
  enableGlobalSearch?: boolean;
  /**
   * Enable column filtering functionality
   */
  enableColumnFilter?: boolean;
  /**
   * Enable pagination functionality
   */
  enablePagination?: boolean;
}

export function DataTableSkeleton() {
  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded" />
      </div>

      <div className="bg-muted h-9 w-64 animate-pulse rounded" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableHead key={i}>
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="bg-muted h-6 w-20 animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  action,
  footer,
  multiSelectAction,
  multiSelectFooter,
  enableColumnVisability = false,
  addButton,
  isLoading = false,
  pageCount = 10,
  enableDateFilter = false,
  enableGlobalSearch = true,
  dateFilterKey = "createdAt" as keyof TData,
  enableColumnFilter = true,
  enablePagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageCount,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
    },
  });

  const handleDateRangeUpdate = (range: DateRange) => {
    const { from, to } = range;
    table.getColumn(String(dateFilterKey))?.setFilterValue([from, to]);
  };

  const hasSelectionEnabled =
    multiSelectAction !== undefined || multiSelectFooter !== undefined;

  const hasActions =
    enableGlobalSearch ||
    action !== undefined ||
    enableDateFilter ||
    enableColumnFilter;

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  const earliestDate = data.reduce((min, item) => {
    const itemDate = new Date(item[dateFilterKey] as string);
    return itemDate < min ? itemDate : min;
  }, new Date());

  return (
    <div className="space-y-4 w-full max-w-full min-w-0">
      {(title ?? addButton) && (
        <div className="flex items-center justify-between min-w-0">
          {title && (
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium truncate">{title}</h3>
              {description && (
                <p className="text-muted-foreground text-sm truncate">{description}</p>
              )}
            </div>
          )}
          {addButton && (
            <Button size="sm" className="gap-2 flex-shrink-0" onClick={addButton.onClick}>
              <Plus className="h-4 w-4" />
              {addButton.label}
            </Button>
          )}
        </div>
      )}

      {hasActions && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
          <div className="relative max-w-sm flex-1 min-w-0">
            <Search
              className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
                -translate-y-1/2"
            />
            <Input
              placeholder={`Search...`}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-9 min-h-[44px] w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {enableColumnFilter && <ColumnFilter table={table} />}
            {enableDateFilter && (
              <DateRangePicker
                initialDateFrom={earliestDate}
                onUpdate={handleDateRangeUpdate}
                align="start"
              />
            )}
            {multiSelectAction &&
              table.getSelectedRowModel().rows.length > 0 &&
              multiSelectAction(
                table.getSelectedRowModel().rows.map((row) => row.original),
              )}
            {action}
            {enableColumnVisability && <ColumnsDropdown table={table} />}
          </div>
        </div>
      )}

      <div className="rounded-md border w-full overflow-x-auto">
        <Table className="min-w-full w-full">
          <TableHeader className="bg-secondary text-secondary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {hasSelectionEnabled && (
                  <TableHead className="w-[50px] sticky left-0 bg-secondary">
                    <Checkbox
                      aria-label="Select all"
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                      }
                    />
                  </TableHead>
                )}

                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  const handleSort = header.column.getToggleSortingHandler();

                  const headerComponent = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      );

                  let sortIcon = null;
                  if (!isSorted) {
                    sortIcon = <ArrowDownUp className="h-4 w-4" />;
                  } else if (isSorted === "asc") {
                    sortIcon = <ArrowUpNarrowWide className="h-4 w-4" />;
                  } else if (isSorted === "desc") {
                    sortIcon = <ArrowDownWideNarrow className="h-4 w-4" />;
                  } else if (!canSort) {
                    sortIcon = null;
                  }

                  return (
                    <TableHead key={header.id} onClick={handleSort} className="whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        {headerComponent}
                        {sortIcon}
                      </span>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="data-[state=selected]:bg-primary/10"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {hasSelectionEnabled && (
                    <TableCell className="w-[50px] sticky left-0 bg-background">
                      <Checkbox
                        aria-label="Select row"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          {footer}
          {multiSelectFooter &&
            table.getSelectedRowModel().rows.length > 0 &&
            multiSelectFooter(
              table.getSelectedRowModel().rows.map((row) => row.original),
            )}
        </div>
        {enablePagination && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-muted-foreground text-sm text-center sm:text-left">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={table.previousPage}
                disabled={!table.getCanPreviousPage()}
                className="min-h-[44px] flex-1 sm:flex-initial"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={table.nextPage}
                disabled={!table.getCanNextPage()}
                className="min-h-[44px] flex-1 sm:flex-initial"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColumnsDropdown<TData>({ table }: { table: ReactTable<TData> }) {
  const hideable = (column: Column<TData>) => column.getCanHide();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter(hideable)
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColumnFilter<TData>({ table }: { table: ReactTable<TData> }) {
  const filterable = (column: Column<TData>) => column.getCanFilter();
  const resetFilters = () => table.resetColumnFilters();
  const tableData = table
    .getPreFilteredRowModel()
    .rows.map((row) => row.original);

  // Check if there are any active column filters
  const activeFilters = table.getState().columnFilters;
  const hasActiveFilters = activeFilters.length > 0;
  const activeFilterCount = activeFilters.length;

  const filters = table
    .getAllColumns()
    .filter(filterable)
    .map((column) => {
      const valuesSet = new Set<string>();
      tableData.forEach((row) => {
        const value = row[column.id as keyof typeof row];
        if (value !== undefined && value !== null) {
          valuesSet.add(String(value));
        }
      });
      const options = Array.from(valuesSet).map((val) => ({
        label: val,
        value: val,
      }));
      return {
        key: column.id,
        title: column.id,
        options,
      };
    });

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    for (const [key, value] of Object.entries(filters)) {
      table.getColumn(key)?.setFilterValue(value);
    }
  };

  console.log(hasActiveFilters, activeFilterCount);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          className="relative gap-2 min-h-[44px]"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
          {hasActiveFilters && (
            <span
              className="bg-background text-foreground absolute -top-1 -right-1
                flex h-5 w-4 items-center justify-center rounded-full text-xs
                font-medium"
            >
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <FilterPanel
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={resetFilters}
        />
      </PopoverContent>
    </Popover>
  );
}
