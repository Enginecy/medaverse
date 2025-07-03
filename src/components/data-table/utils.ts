import type { Row } from "@tanstack/react-table";

export function dateRangeFilter<TData>(
  row: Row<TData>,
  columnId: string,
  value: [Date | null, Date | null],
): boolean {
  const date = new Date(row.getValue(columnId));
  const [start, end] = value;
  if (start == null || end == null) return false;
  if (!start && !end) return true;
  if (start && !end) return date >= start;
  if (!start && end) return date <= end;
  return date >= start && date <= end;
}

export function multiSelectFilter<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue || filterValue.length === 0) return true;
  const cellValue = row.getValue(columnId) as string;
  return filterValue.includes(cellValue);
}
