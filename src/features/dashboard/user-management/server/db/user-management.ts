"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, userRoles, users } from "@/db/schema";
import { createAdminClient } from "@/lib/supabase/server";
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

export async function getAboveSuperiors() {
  try{
    const {auth} =   createAdminClient();
    const user = await auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const userRole = user.data.user?.role;

    const db = await createDrizzleSupabaseClient();
    
    const superiors = await db.admin
  
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles.name,
      })
      .from(profile)
      .innerJoin(userRoles, eq(userRoles.userId, profile.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
  
      .where(eq(roles.name, userRole));
    return superiors;
  } catch(e){

    throw new Error(`Failed to get superiors: ${e instanceof Error ? e.message : String(e)}`);

  }  
}

export type Superiors = Awaited<ReturnType<typeof getAboveSuperiors>>[number];