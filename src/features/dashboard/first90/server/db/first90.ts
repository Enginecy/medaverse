"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { sql } from "drizzle-orm";

export async function getFirst90Users() {
  const db = await createDrizzleSupabaseClient();

  const first90Data = await db.rls(async (tx) => {
    // Using raw SQL for complex query with CTEs
    return tx.execute(sql`
      WITH FirstSaleDates AS (
        -- 1. Finds the first sale date (FNB) for each user
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
        -- 2. Calculates the 3-month submitted average (submitted_av)
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
          ) as submitted_av
        FROM
          FirstSaleDates fsd
        WHERE
          fsd.time IS NOT NULL
      )
      SELECT 
        name,
        avatar_url,
        upline,
        upline_avatar_url,
        FNB,
        end_date,
        submitted_av,
        150000 - submitted_av as goal_remaining,
        -- 3. New Column: Calculates weeks left between TODAY and the end_date
        ROUND(DATE_PART('day', end_date::timestamp - NOW()) / 7) as weeks_left
      FROM 
        SalesSummary
      ORDER BY 
        name;
    `);
  });

  // Transform the result to match TypeScript types
  // execute() returns an array of rows directly
  return first90Data.map((row: any) => ({
    name: row.name as string,
    avatarUrl: row.avatar_url as string,
    upline: row.upline as string,
    uplineAvatarUrl: row.upline_avatar_url as string,
    fnb: row.fnb ? new Date(row.fnb) : null,
    endDate: row.end_date ? new Date(row.end_date) : null,
    submittedAv: parseFloat(String(row.submitted_av ?? 0)),
    goalRemaining: parseFloat(String(row.goal_remaining ?? 0)),
    weeksLeft: parseFloat(String(row.weeks_left ?? 0)),
  }));
}

export type First90User = {
  name: string;
  avatarUrl: string;
  upline: string;
  uplineAvatarUrl: string;
  fnb: Date | null;
  endDate: Date | null;
  submittedAv: number;
  goalRemaining: number;
  weeksLeft: number;
};

