"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { goals, profile } from "@/db/schema";
import type { ActionResult } from "@/lib/utils";
import { eq, and, isNull } from "drizzle-orm";

export async function createGoal(data: {
  label: string;
  target?: number;
  endDate?: Date;
  goalType?: string;
  recurringDuration?: "daily" | "weekly" | "monthly" | "yearly";
}) {
  const db = await createDrizzleSupabaseClient();

  return await db.rls(async (tx) => {
    // Get user's profile - RLS will ensure we only get the current user's profile
    const userProfile = await tx
      .select({ id: profile.id })
      .from(profile)
      .limit(1);

    if (!userProfile.length) {
      throw new Error("Profile not found");
    }

    const profileId = userProfile[0]!.id;

    const [newGoal] = await tx
      .insert(goals)
      .values({
        profileId,
        label: data.label,
        target: data.target?.toString(),
        endDate: data.endDate,
        goalType: data.goalType ?? "sales",
        recurringDuration: data.recurringDuration,
      })
      .returning();

    return newGoal;
  });
}

export async function getUserGoals() {
  const db = await createDrizzleSupabaseClient();

  return await db.rls(async (tx) => {
    // Get user's profile - RLS will ensure we only get the current user's profile
    const userProfile = await tx
      .select({ id: profile.id })
      .from(profile)
      .limit(1);

    if (!userProfile.length) {
      throw new Error("Profile not found");
    }

    const profileId = userProfile[0]!.id;

    const userGoals = await tx
      .select()
      .from(goals)
      .where(and(eq(goals.profileId, profileId), isNull(goals.deletedAt)))
      .orderBy(goals.createdAt);

    return userGoals;
  });
}

export async function updateGoalProgress(goalId: string, achieved: number) : Promise<ActionResult<typeof result>> {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls(async (tx) => {
    // Get user's profile - RLS will ensure we only get the current user's profile
    const userProfile = await tx
      .select({ id: profile.id })
      .from(profile)
      .limit(1);

    if (!userProfile.length) {
        return {
        success: false,
        error: {
          message: "Profile not found",
          statusCode: 400,
          details:
            "Ensure you have a profile created before updating goals.",
        },
      };
    }

    const profileId = userProfile[0]!.id;

    const [updatedGoal] = await tx
      .update(goals)
      .set({
        achieved: achieved.toString(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(goals.id, goalId),
          eq(goals.profileId, profileId),
          isNull(goals.deletedAt),
        ),
      )
      .returning();

    return updatedGoal;
  });
  if (!result) {
   return { 
    success: false, 
    error: {
      message: "Goal not found to update it.",
      statusCode: 400, 
      details: "Ensure the goal exists to your profile.",
    }
   }
  }
  return { success: true, data: result };
}


export async function deleteGoal(goalId: string) {
  const db = await createDrizzleSupabaseClient();

  return await db.rls(async (tx) => {
    // Get user's profile - RLS will ensure we only get the current user's profile
    const userProfile = await tx
      .select({ id: profile.id })
      .from(profile)
      .limit(1);

    if (!userProfile.length) {
      throw new Error("Profile not found");
    }

    const profileId = userProfile[0]!.id;

    const [deletedGoal] = await tx
      .update(goals)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(goals.id, goalId),
          eq(goals.profileId, profileId),
          isNull(goals.deletedAt),
        ),
      )
      .returning();

    return deletedGoal;
  });
}

export type Goal = Awaited<ReturnType<typeof getUserGoals>>[number];
