import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

type FilterOperators<T> = {
  eq?: T;
  neq?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  like?: T;
  ilike?: T;
  is?: T;
  in?: T[];
  contains?: T;
  containedBy?: T;
  overlaps?: T;
  textSearch?: string;
};

type Filters<T extends keyof Database["public"]["Tables"]> = {
  [K in keyof Database["public"]["Tables"][T]["Row"]]?: FilterOperators<
    Database["public"]["Tables"][T]["Row"][K]
  >;
};

interface findOptions<T extends keyof Database["public"]["Tables"]> {
  table: T;
  columns?: (keyof Database["public"]["Tables"][T]["Row"])[] | "*";
  filters?: Filters<T>;
}

interface updateOptions<T extends keyof Database["public"]["Tables"]> {
  table: T;
  column: Database["public"]["Tables"][T]["Update"];
  filters: Filters<T>;
}

interface createOptions<T extends keyof Database["public"]["Tables"]> {
  table: T;
  column: Database["public"]["Tables"][T]["Insert"];
}

class ORM {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private applyFilter<T extends keyof Database["public"]["Tables"]>({
    query,
    filters,
  }: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    query: any;
    filters: Filters<T>;
  }) {
    for (const [column, filterOps] of Object.entries(filters)) {
      if (filterOps) {
        for (const [operator, v] of Object.entries(filterOps)) {
          const value = v as never;
          switch (operator) {
            case "eq":
              query = query.eq(column, value);
              break;
            case "neq":
              query = query.neq(column, value);
              break;
            case "gt":
              query = query.gt(column, value);
              break;
            case "gte":
              query = query.gte(column, value);
              break;
            case "lt":
              query = query.lt(column, value);
              break;
            case "lte":
              query = query.lte(column, value);
              break;
            case "like":
              query = query.like(column, value);
              break;
            case "ilike":
              query = query.ilike(column, value);
              break;
            case "is":
              query = query.is(column, value);
              break;
            case "in":
              query = query.in(column, value);
              break;
            case "contains":
              query = query.contains(column, value);
              break;
            case "containedBy":
              query = query.containedBy(column, value);
              break;
            case "overlaps":
              query = query.overlaps(column, value);
              break;
            case "textSearch":
              query = query.textSearch(column, value);
              break;
          }
        }
      }
    }
    return query;
  }

  async find<T extends keyof Database["public"]["Tables"]>({
    table,
    columns,
    filters,
  }: findOptions<T>) {
    let columnsString = "*";
    if (columns && columns !== "*") {
      columnsString = columns.join(",");
    }

    let query = this.supabase.from(table).select(columnsString);

    if (filters) {
      query = this.applyFilter({ query, filters });
    }
    const { data, error } = await query;

    return {
      data: data as unknown as Database["public"]["Tables"][T]["Row"][],
      error,
    };
  }

  async update<T extends keyof Database["public"]["Tables"]>({
    table,
    column,
    filters,
  }: updateOptions<T>) {
    let query = this.supabase.from(table).update(column as never);
    if (filters) {
      query = this.applyFilter({ query, filters });
    }
    const { data, error } = await query;
    return { data, error };
  }

  async create<T extends keyof Database["public"]["Tables"]>({
    table,
    column,
  }: createOptions<T>) {
    const { data, error } = await this.supabase
      .from(table)
      .insert(column as never);
    return { data, error };
  }
}

export { ORM };
