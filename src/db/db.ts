import postgres from "postgres";
import type { DrizzleConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

import { createClient } from "@/lib/supabase/server";

import { createDrizzle } from "./drizzle";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const config = {
  casing: "snake_case",
  schema,
} satisfies DrizzleConfig<typeof schema>;

// ByPass RLS
const admin = drizzle({
  client: postgres(env.DIRECT_URL!, { prepare: false }),
  ...config,
});

// Protected by RLS
const client = drizzle({
  client: postgres(env.DATABASE_URL!, { prepare: false }),
  ...config,
});

admin.query.profile.findMany({
  with: {},
});

export async function createDrizzleSupabaseClient() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return createDrizzle(decode(session?.access_token ?? ""), {
    admin,
    client,
  });
}

export type DrizzleClient = typeof client;

function decode(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch (error: unknown) {
    console.error(error);
    return { role: "anon" } as JwtPayload & { role: string };
  }
}
