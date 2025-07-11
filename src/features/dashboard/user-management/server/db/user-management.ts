"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, userRoles, users } from "@/db/schema";
import { desc, getTableColumns, eq } from "drizzle-orm";

export async function getUsers() {
  //TODO: Remove this delay in production code
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay for demonstration purposes
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

export async function getAboveSuperiors({ userRole }: { userRole: string }) {
  const db = await createDrizzleSupabaseClient();

  const superiors = await db.admin

    .select()
    .from(profile)
    .innerJoin(userRoles, eq(userRoles.userId, profile.userId))
    .innerJoin(roles, eq(userRoles.roleId, roles.id))

    .where(eq(roles.name, userRole));
}
