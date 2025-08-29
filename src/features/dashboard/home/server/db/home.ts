"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, userRoles, users } from "@/db/schema";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { desc, eq, getTableColumns } from "drizzle-orm";

export async function getUpComingBDs() {
  try {
    const db = await createDrizzleSupabaseClient();
    const today = new Date();

    const birthdays = await db.admin
      .select({
        dob: profile.dob,
        name: profile.name,
        imageUrl: profile.avatarUrl,
        // title: "profile.role", //TODO: Add user role when available
        email: users.email,
      })
      .from(profile)
      .innerJoin(users, eq(users.id, profile.userId))
      .orderBy(profile.dob);
    return birthdays.map((row) => {
      const dob = new Date(row.dob);
      const isToday =
        dob.getDate() === today.getDate() &&
        dob.getMonth() === today.getMonth();

      return {
        agent: {
          name: row.name,
          imageUrl: row.imageUrl,
          // title: row.title,
          email: row.email,
        },
        date: dob,
        isToday,
      };
    });
  } catch (error) {
    console.error("Error fetching birthdays from DB:", error);
    throw new Error("Failed to fetch birthdays from the database.");
  }
}

export async function getUserProfile() {
  const supabase = await createClient();

  const {
    data: { session },
    error: userError,
  } = await supabase.auth.getSession();

  if (userError) {
    throw { message: "Error fetching user", error: userError };
  }
  if (!session?.user) {
    throw { message: "User not found" };
  }
  const db = await createDrizzleSupabaseClient();

  const userProfile = await db.rls((tx) => {
    return tx
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(profile.userId, session.user.id))
      .limit(1);
  });

  if (!userProfile) {
    throw { message: "User profile not found" };
  }

  return userProfile[0];
}

export type UserProfile = Awaited<ReturnType<typeof getUserProfile>>;