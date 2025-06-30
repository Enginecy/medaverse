"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, users } from "@/db/schema";
import { createAdminClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

export async function getUpComingDBs() {
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
      .orderBy(profile.dob)
      ;
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
