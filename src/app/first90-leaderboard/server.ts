"use server";

import { getFirst90LeaderboardDataByCriteria } from "@/features/leaderboard/server/db/first90-leaderboard";
import type { First90LeaderboardUser } from "@/features/leaderboard/server/db/first90-leaderboard";

export async function getFirst90LeaderboardData(
  criteria: "submitted_av" | "time_efficiency" | "goal_remaining" = "submitted_av",
) {
  return await getFirst90LeaderboardDataByCriteria(criteria);
}

export type First90LeaderboardDataSection = First90LeaderboardUser;

