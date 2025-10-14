import { sql } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type * as schema from "./schema";
import type { DrizzleClient } from "./db";

type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

export function createDrizzle<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Database extends PgDatabase<any, typeof schema, any>,
  Token extends SupabaseToken = SupabaseToken,
>(token: Token, { admin, client }: { admin: Database; client: DrizzleClient }) {
  return {
    admin,
    rls: (async (transaction, ...rest) => {
      return await client.transaction(
        async (tx) => {
          try {
            await tx.execute(sql`
          -- set timezone
          SET TIME ZONE 'America/New_York';
          
          -- auth.jwt()
          select set_config('request.jwt.claims', '${sql.raw(
            JSON.stringify(token),
          )}', TRUE);
          -- auth.uid()
          select set_config('request.jwt.claim.sub', '${sql.raw(
            token.sub ?? "",
          )}', TRUE);												
          -- set local role
          set local role ${sql.raw(token.role ?? "anon")};
          `);
            return await transaction(tx);
          } catch (error) {
            console.error("Error setting RLS", error);
          } finally {
            await tx.execute(sql`
            -- reset
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
            `);
          }
        },
        ...rest,
      );
    }) as typeof client.transaction,
  };
}
