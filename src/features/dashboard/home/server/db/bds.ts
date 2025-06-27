"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { profile } from "@/db/schema";
import { createAdminClient } from "@/lib/supabase/server";

export async function getUpComingDBs() {
  try {
    const db = await createDrizzleSupabaseClient();
    const today = new Date();

    const birthdays = await db.admin
      .select({
        dob: profile.dob,
        name: profile.name,
        imageUrl: profile.avatarUrl,
        title: profile.role,
      })
      .from(profile)
      .orderBy(profile.dob);
    console.log("Birthdays from DB:", birthdays);
    return birthdays.map((row) => {
      const dob = new Date(row.dob);
      const isToday =
        dob.getDate() === today.getDate() &&
        dob.getMonth() === today.getMonth();

      return {
        agent: {
          name: row.name,
          imageUrl: row.imageUrl,
          title: row.title,
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
