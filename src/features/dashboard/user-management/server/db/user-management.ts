"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, userHierarchy, userRoles, users } from "@/db/schema";
import type { Role } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { createClient } from "@/lib/supabase/server";
import { desc, getTableColumns, eq, sql, gte } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function getUsers() {
  const db = await createDrizzleSupabaseClient();

  const profiles = await db.rls((tx) => {
    return tx
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles,
        upline: sql<string>`user_hierarchy.leader_id`.as("upline"),
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(userHierarchy, eq(userHierarchy.userId, profile.userId))
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
      .where(gte(roles.level, 6));

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

  const uplineProfile = alias(profile, "upline_profile");

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
        uplineName: uplineProfile.name,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(userHierarchy, eq(userHierarchy.userId, profile.userId))
      .leftJoin(uplineProfile, eq(userHierarchy.leaderId, uplineProfile.userId))
      .orderBy(desc(profile.createdAt));
  });

  return exportUsers;
}

export type ExportedUsers = Awaited<ReturnType<typeof getExportUsers>>[number];
