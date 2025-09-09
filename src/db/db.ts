import postgres from "postgres";
import type { DrizzleConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

import { createClient } from "@/lib/supabase/server";

import { createDrizzle } from "./drizzle";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { cache } from "react";

declare global {
  var __pg_admin: ReturnType<typeof postgres> | undefined;
  var __pg_client: ReturnType<typeof postgres> | undefined;
}

const config = {
  casing: "snake_case",
  schema,
} satisfies DrizzleConfig<typeof schema>;

// Underlying Postgres singletons (avoid exhausting connection limits in dev/HMR)
const pgAdmin =
  globalThis.__pg_admin ??
  postgres(
    env.DIRECT_URL!,
    {
      prepare: false,
      ...(process.env.NODE_ENV !== "production" ? { max: 1 } : {}),
    },
  );
if (process.env.NODE_ENV !== "production") globalThis.__pg_admin = pgAdmin;

const pgClient =
  globalThis.__pg_client ??
  postgres(
    env.DATABASE_URL!,
    {
      prepare: false,
      ...(process.env.NODE_ENV !== "production" ? { max: 1 } : {}),
    },
  );
if (process.env.NODE_ENV !== "production") globalThis.__pg_client = pgClient;

// ByPass RLS
const admin = drizzle({
  client: pgAdmin,
  ...config,
});

// Protected by RLS
const client = drizzle({
  client: pgClient,
  ...config,
});

export const createDrizzleSupabaseClient = cache(async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return createDrizzle(decode(session?.access_token ?? ""), {
    admin,
    client,
  });
});

export type DrizzleClient = typeof client;

function decode(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch (error: unknown) {
    console.error(error);
    return { role: "anon" } as JwtPayload & { role: string };
  }
}