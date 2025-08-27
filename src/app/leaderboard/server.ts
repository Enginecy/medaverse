"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, sales, userRoles } from "@/db/schema";
import { count, eq, sql, desc } from "drizzle-orm";

export async function getLeaderboardData() {
  const db = await createDrizzleSupabaseClient();
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
    .leftJoin(sales, eq(profile.userId, sales.userId))
    .orderBy(desc(sql<number>`COALESCE(SUM(${sales.totalSaleValue}), 0)`))
    .groupBy(profile.userId, profile.name, profile.avatarUrl, roles.name);

  return results.map((r) => ({
    ...r,
    totalSalesAmount: Number(r.totalSalesAmount ?? 0).toLocaleString(),
    salesCount: Number(r.salesCount ?? 0),
  }));
}

export async function getLeaderboardDataByRole(roleCode: string) {
  const db = await createDrizzleSupabaseClient();
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
    .leftJoin(sales, eq(profile.userId, sales.userId))
    .where(eq(roles.code, roleCode))
    .orderBy(desc(sql<number>`COALESCE(SUM(${sales.totalSaleValue}), 0)`))
    .groupBy(profile.userId, profile.name, profile.avatarUrl, roles.name);

  return results.map((r) => ({
    ...r,
    totalSalesAmount: Number(r.totalSalesAmount ?? 0).toLocaleString(),
    salesCount: Number(r.salesCount ?? 0),
  }));
}

export type LeaderboardDataSection = Awaited<
  ReturnType<typeof getLeaderboardData>
>[number];
