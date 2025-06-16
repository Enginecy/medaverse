"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, users } from "@/db/schema";
import { desc, getTableColumns, eq } from "drizzle-orm";

export async function getUsers() {
  const db = await createDrizzleSupabaseClient();

  const profiles = await db.rls((tx) => {
    return tx
      .select({
        ...getTableColumns(profile),
        email: users.email,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .orderBy(desc(profile.createdAt));
  });

  return profiles;
}

export type User = Awaited<ReturnType<typeof getUsers>>[number];
