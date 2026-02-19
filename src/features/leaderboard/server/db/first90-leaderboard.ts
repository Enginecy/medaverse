"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { sql } from "drizzle-orm";

export type First90LeaderboardUser = {
  userId: string;
  name: string;
  avatarUrl: string;
  upline: string;
  uplineAvatarUrl: string;
  fnb: Date | null;
  endDate: Date | null;
  submittedAv: number;
  goalRemaining: number;
  weeksLeft: number;
  weeksElapsed: number;
  timeEfficiency: number; // submitted_av / weeks_elapsed
  goalProgress: number; // percentage of $200k goal
  completionDate: Date | null; // Date when goal was reached (goalRemaining <= 0)
};

export async function getFirst90LeaderboardDataByCriteria(
  criteria: "submitted_av" | "time_efficiency" | "goal_remaining" = "submitted_av",
) {
  const db = await createDrizzleSupabaseClient();

  const first90Data = await db.admin.transaction(async (tx) => {
    return tx.execute(sql`
      WITH FirstSaleDates AS (
        SELECT 
          p.user_id, 
          p.name, 
          p.avatar_url,
          lp.name as upline,
          lp.avatar_url as upline_avatar_url,
          (SELECT MIN(created_at)::date 
           FROM sales 
           WHERE sales.user_id = p.user_id 
           AND sales.deleted_at IS NULL) as time
        FROM 
          profile p
        INNER JOIN 
          user_hierarchy uh ON uh.user_id = p.user_id
        INNER JOIN 
          profile lp ON uh.leader_id = lp.user_id
        WHERE 
          p.is_first90 = true
          AND p.deleted_at IS NULL
          AND uh.deleted_at IS NULL
          AND lp.deleted_at IS NULL
      ),
      SalesSummary AS (
        SELECT
          fsd.user_id,
          fsd.name,
          fsd.avatar_url,
          fsd.upline,
          fsd.upline_avatar_url,
          fsd.time as FNB, 
          fsd.time + INTERVAL '3 months' as end_date,
          (
            SELECT 
              COALESCE(SUM(s.total_sale_value * 12), 0)
            FROM 
              sales s
            WHERE 
              s.user_id = fsd.user_id
              AND s.created_at >= fsd.time
              AND s.created_at < fsd.time + INTERVAL '3 months'
              AND s.deleted_at IS NULL
          ) as submitted_av,
          GREATEST(1, ROUND(DATE_PART('day', NOW()::timestamp - fsd.time::timestamp) / 7)) as weeks_elapsed,
          (
            SELECT MIN(cumulative.created_at)::date
            FROM (
              SELECT 
                s2.created_at,
                SUM(s2.total_sale_value * 12) OVER (
                  ORDER BY s2.created_at 
                  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) as running_total
              FROM sales s2
              WHERE s2.user_id = fsd.user_id
                AND s2.created_at >= fsd.time
                AND s2.created_at < fsd.time + INTERVAL '3 months'
                AND s2.deleted_at IS NULL
            ) cumulative
            WHERE cumulative.running_total >= 200000
            LIMIT 1
          ) as completion_date
        FROM
          FirstSaleDates fsd
        WHERE
          fsd.time IS NOT NULL
      )
      SELECT 
        user_id,
        name,
        avatar_url,
        upline,
        upline_avatar_url,
        FNB,
        end_date,
        submitted_av,
        200000 - submitted_av as goal_remaining,
        ROUND(DATE_PART('day', end_date::timestamp - NOW()) / 7) as weeks_left,
        weeks_elapsed,
        CASE 
          WHEN weeks_elapsed > 0 THEN submitted_av / weeks_elapsed
          ELSE 0
        END as time_efficiency,
        completion_date
      FROM 
        SalesSummary
      WHERE 
        submitted_av > 0 OR weeks_elapsed > 0
    `);
  });

  // Transform and sort by criteria
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users: First90LeaderboardUser[] = first90Data.map((row: any) => {
    const submittedAv = parseFloat(String(row.submitted_av ?? 0));
    const weeksElapsed = parseFloat(String(row.weeks_elapsed ?? 1));
    const timeEfficiency = parseFloat(String(row.time_efficiency ?? 0));
    const goalRemaining = parseFloat(String(row.goal_remaining ?? 200000));
    const goalProgress = (submittedAv / 200000) * 100;
    const completionDate = row.completion_date
      ? new Date(row.completion_date)
      : null;

    return {
      userId: row.user_id as string,
      name: row.name as string,
      avatarUrl: row.avatar_url as string,
      upline: row.upline as string,
      uplineAvatarUrl: row.upline_avatar_url as string,
      fnb: row.fnb ? new Date(row.fnb) : null,
      endDate: row.end_date ? new Date(row.end_date) : null,
      submittedAv,
      goalRemaining,
      weeksLeft: parseFloat(String(row.weeks_left ?? 0)),
      weeksElapsed,
      timeEfficiency,
      goalProgress,
      completionDate,
    };
  });

  // Sort by selected criteria
  let sortedUsers: First90LeaderboardUser[];
  switch (criteria) {
    case "submitted_av":
      sortedUsers = [...users].sort((a, b) => b.submittedAv - a.submittedAv);
      break;
    case "time_efficiency":
      sortedUsers = [...users].sort(
        (a, b) => b.timeEfficiency - a.timeEfficiency,
      );
      break;
    case "goal_remaining":
      // Sort by completion date (who finished first)
      // Only show users who have completed (goalRemaining <= 0)
      // Sort by completion date ascending (earliest completion first)
      sortedUsers = [...users]
        .filter((user) => user.goalRemaining <= 0 && user.completionDate !== null)
        .sort((a, b) => {
          if (!a.completionDate || !b.completionDate) return 0;
          return a.completionDate.getTime() - b.completionDate.getTime();
        });
      break;
    default:
      sortedUsers = users;
  }

  return sortedUsers;
}

export async function getFirst90Stats() {
  const db = await createDrizzleSupabaseClient();

  const stats = await db.admin.transaction(async (tx) => {
    return tx.execute(sql`
      WITH FirstSaleDates AS (
        SELECT 
          p.user_id,
          (SELECT MIN(created_at)::date 
           FROM sales 
           WHERE sales.user_id = p.user_id 
           AND sales.deleted_at IS NULL) as time
        FROM 
          profile p
        WHERE 
          p.is_first90 = true
          AND p.deleted_at IS NULL
      ),
      SalesSummary AS (
        SELECT
          fsd.user_id,
          (
            SELECT 
              COALESCE(SUM(s.total_sale_value * 12), 0)
            FROM 
              sales s
            WHERE 
              s.user_id = fsd.user_id
              AND s.created_at >= fsd.time
              AND s.created_at < fsd.time + INTERVAL '3 months'
              AND s.deleted_at IS NULL
          ) as submitted_av
        FROM
          FirstSaleDates fsd
        WHERE
          fsd.time IS NOT NULL
      )
      SELECT 
        COUNT(*) as total_users,
        COALESCE(AVG(submitted_av), 0) as avg_av,
        COALESCE(SUM(CASE WHEN submitted_av >= 200000 THEN 1 ELSE 0 END), 0) as users_at_goal
      FROM 
        SalesSummary
    `);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = stats[0] as any;
  return {
    totalUsers: parseInt(String(row?.total_users ?? 0), 10),
    avgAv: parseFloat(String(row?.avg_av ?? 0)),
    usersAtGoal: parseInt(String(row?.users_at_goal ?? 0), 10),
  };
}

