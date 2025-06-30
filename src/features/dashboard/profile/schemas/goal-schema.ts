import { z } from "zod";

export const addGoalSchema = z
  .object({
    title: z.string().min(1, "Goal title is required"),
    targetAmount: z
      .string()
      .min(1, "Target amount is required")
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Target amount must be a positive number",
      ),
    endDate: z.date().optional(),
    goalType: z.enum(["sales", "revenue"], {
      required_error: "Please select a goal type",
    }),
    recurringDuration: z
      .enum(["daily", "weekly", "monthly", "yearly"])
      .optional(),
  })
  .refine(
    (data) => {
      // Must have either end date OR recurring duration, but not both or neither
      const hasEndDate = !!data.endDate;
      const hasRecurringDuration = !!data.recurringDuration;

      // Neither provided
      if (!hasEndDate && !hasRecurringDuration) {
        return false;
      }

      // Both provided
      if (hasEndDate && hasRecurringDuration) {
        return false;
      }

      return true;
    },
    (data) => {
      const hasEndDate = !!data.endDate;
      const hasRecurringDuration = !!data.recurringDuration;

      if (!hasEndDate && !hasRecurringDuration) {
        return {
          message: "Either end date or recurring duration must be specified",
          path: ["recurringDuration"],
        };
      }

      if (hasEndDate && hasRecurringDuration) {
        return {
          message:
            "Cannot have both end date and recurring duration. Choose one or the other.",
          path: ["recurringDuration"],
        };
      }

      return { message: "", path: [] };
    },
  );

export type AddGoalFormData = z.infer<typeof addGoalSchema>;
