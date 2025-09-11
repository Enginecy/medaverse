"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, userHierarchy, userRoles, users } from "@/db/schema";
import type { Role } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { createClient } from "@/lib/supabase/server";
import { desc, getTableColumns, eq, gt, sql } from "drizzle-orm";

export async function getUsers() {
  const db = await createDrizzleSupabaseClient();

  const profiles = await db.rls((tx) => {
    return tx
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles,
        upline: sql<string>`leader_profile.id`.as("upline"),
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(userHierarchy, eq(userHierarchy.userId, profile.userId))
      .leftJoin(
        sql`${profile} as leader_profile`,
        eq(userHierarchy.leaderId, sql`leader_profile.user_id`)
      )
      .orderBy(desc(profile.createdAt));
  });
  return profiles;
}

export type User = Awaited<ReturnType<typeof getUsers>>[number];

export async function getAboveSuperiors(selectedRole: Role) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user) {
      throw { message: "You are not authenticated`" };
    }

    const db = await createDrizzleSupabaseClient();

    const superiors = await db.admin

      .select({
        ...getTableColumns(profile),
        role: roles,
      })
      .from(profile)
      .innerJoin(userRoles, eq(userRoles.userId, profile.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(gt(roles.level, selectedRole.level));

    return superiors;
  } catch (e) {
    console.error("Error fetching superiors:", e);
    throw {
      message: `Failed to get superiors`,
    };
  }
}

export type Superior = Awaited<ReturnType<typeof getAboveSuperiors>>[number];

export async function getRegionalDirectors() {
  try {
    const db = await createDrizzleSupabaseClient();

    const regionalDirectors = await db.admin
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .innerJoin(userRoles, eq(userRoles.userId, profile.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(roles.code, "regional_director"));

    return regionalDirectors;
  } catch {
    throw {
      message: "Failed to get regional directors",
    };
  }
}

export async function getExportUsers() {
  const db = await createDrizzleSupabaseClient();

  const exportUsers = await db.rls((tx) => {
    return tx
      .select({
        name: profile.name,
        username: profile.username,
        phoneNumber: profile.phoneNumber,
        email: users.email,
        role: roles.name,
        status: profile.status,
        office: profile.office,
        dob: sql`TO_CHAR(${profile.dob}, 'YYYY-MM-DD')`.as("dob"),
        NpnNumber: profile.npnNumber,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .orderBy(desc(profile.createdAt));
  });

  return exportUsers;
}

export type ExportedUsers = Awaited<ReturnType<typeof getExportUsers>>[number];
