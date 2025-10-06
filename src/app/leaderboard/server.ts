"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, sales, userRoles } from "@/db/schema";
import { count, eq, sql, desc, gt } from "drizzle-orm";

export async function getLeaderboardDataByPeriod(
  period: "week" | "month" | "all" = "week",
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter = sql`1=1`; // Default: no filter for 'all'

  if (period === "week") {
    // Use DATE_TRUNC for current week calculation (Monday to Sunday)
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('week', NOW()))::date
    `;
  } else if (period === "month") {
    // Use DATE_TRUNC for month calculation
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('month', NOW()))::date
    `;
  }
  // 'all' period uses no date filter

  const results = await db.admin
    .select({
      userId: profile.userId,
      name: profile.name,
      role: roles.name,
      avatarUrl: profile.avatarUrl,
      totalSalesAmount: sql<number>`COALESCE(SUM(${sales.totalSaleValue}), 0)`,
      salesCount: count(sales.id),
    })
    .from(profile)
    .leftJoin(userRoles, eq(profile.userId, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(sales, eq(profile.userId, sales.userId))
    .where(sql`${dateFilter} AND ${sales.deletedAt} IS NULL`)
    .orderBy(desc(sql<number>`COALESCE(SUM(${sales.totalSaleValue}), 0)`))
    .groupBy(profile.userId, profile.name, profile.avatarUrl, roles.name)
    .having(gt(count(sales.id), 0));

  console.log(results);

  return results.map((r) => ({
    ...r,
    totalSalesAmount: (Number(r.totalSalesAmount ?? 0) * 12).toLocaleString(),
    salesCount: Number(r.salesCount ?? 0),
  }));
}

export async function getLeaderboardData() {
  const db = await createDrizzleSupabaseClient();

  // Use DATE_TRUNC for current week calculation (Monday to Sunday)
  const dateFilter = sql`
    ${sales.createdAt}::date >= (DATE_TRUNC('week', NOW()))::date
    AND ${sales.createdAt}::date < (DATE_TRUNC('week', NOW()) + INTERVAL '1 week')::date
  `;

  const results = await db.admin
    .select({
      userId: profile.userId,
      name: profile.name,
      role: roles.name,
      avatarUrl: profile.avatarUrl,
      totalSalesAmount: sql<number>`COALESCE(SUM(${sales.totalSaleValue}), 0)`,
      salesCount: count(sales.id),
    })
    .from(profile)
    .leftJoin(userRoles, eq(profile.userId, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(sales, eq(profile.userId, sales.userId))
    .where(sql`${dateFilter} AND ${sales.deletedAt} IS NULL`)
    .orderBy(desc(sql<number>`COALESCE(SUM(${sales.totalSaleValue}), 0)`))
    .groupBy(profile.userId, profile.name, profile.avatarUrl, roles.name)
    .having(gt(count(sales.id), 0));

  return results.map((r) => ({
    ...r,
    totalSalesAmount: (Number(r.totalSalesAmount ?? 0) * 12).toLocaleString(),
    salesCount: Number(r.salesCount ?? 0),
  }));
}

export type LeaderboardDataSection = Awaited<
  ReturnType<typeof getLeaderboardData>
>[number];
