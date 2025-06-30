"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { goals, profile } from "@/db/schema";
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

export async function updateGoalProgress(goalId: string, achieved: number) {
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
