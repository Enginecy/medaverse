"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createGoal,
  getUserGoals,
  updateGoalProgress,
  deleteGoal,
} from "../db/goals";
import type { ActionResult } from "@/lib/utils";

const createGoalSchema = z.object({
  label: z.string().min(1, "Goal title is required"),
  target: z.number().positive("Target must be a positive number").optional(),
  endDate: z.date().optional(),
  goalType: z.enum(["sales", "revenue"]).optional(),
  recurringDuration: z
    .enum(["daily", "weekly", "monthly", "yearly"])
    .optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export async function createGoalAction(
  input: CreateGoalInput,
): Promise<ActionResult<void>> {
  const validatedInput = createGoalSchema.parse(input);

  const goal = await createGoal(validatedInput);

  revalidatePath("/dashboard/profile");
  if (!goal) {
    return {
      success: false,
      error: {
        message: "Failed to create goal",
        statusCode: 400,
        details: "Failed to create this goal, Please try again later.",
      },
    };
  }
  return {
    success: true,
    data: undefined,
  };
}

export async function getUserGoalsAction() {
  try {
    const goals = await getUserGoals();

    return {
      success: true,
      data: goals,
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch goals",
    };
  }
}

const updateGoalProgressSchema = z.object({
  goalId: z.string().uuid("Invalid goal ID"),
  achieved: z.number().min(0, "Achieved amount must be non-negative"),
});

export type UpdateGoalProgressInput = z.infer<typeof updateGoalProgressSchema>;

export async function updateGoalProgressAction(input: UpdateGoalProgressInput) {
  try {
    const validatedInput = updateGoalProgressSchema.parse(input);

    const goal = await updateGoalProgress(
      validatedInput.goalId,
      validatedInput.achieved,
    );

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      data: goal,
    };
  } catch (error) {
    console.error("Error updating goal progress:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update goal progress",
    };
  }
}

const deleteGoalSchema = z.object({
  goalId: z.string().uuid("Invalid goal ID"),
});

export type DeleteGoalInput = z.infer<typeof deleteGoalSchema>;

export async function deleteGoalAction(input: DeleteGoalInput) {
  try {
    const validatedInput = deleteGoalSchema.parse(input);

    const goal = await deleteGoal(validatedInput.goalId);

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      data: goal,
    };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete goal",
    };
  }
}
