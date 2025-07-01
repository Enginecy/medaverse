import { createDrizzleSupabaseClient } from "@/db/db";
import { eq, sql, type SQL } from "drizzle-orm";

import { PgTable } from "drizzle-orm/pg-core"; // Adjust import path as needed

export async function selectHelper({
  table,
  tableName,
}: {
  table: SQL<unknown>;
  tableName: string;
}) {
  const db = await createDrizzleSupabaseClient();
  const isExist = await doesColumnExist({
    tableName: tableName,
    columnName: "deleted_at",
    schema: "public",
  });

  if (isExist) {
    return db.rls((tx) => {
      return tx
        .select()
        .from(table)
        .where(sql`${table}.deleted_at IS NULL`);
    });
  }
}

export async function doesColumnExist({
  tableName,
  columnName,
  schema,
}: {
  tableName: string;
  columnName: string;
  schema: string;
}): Promise<boolean> {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls(async (tx) => {
    const response = tx.execute(
      sql`SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = ${schema}
            AND table_name = ${tableName}
            AND column_name = ${columnName}
        ) AS "exists"`,
    );
    const rows = (response as unknown as { rows: { exists: boolean }[] }).rows;

    return rows?.[0]?.exists ?? false;
  });

  return result;
}
