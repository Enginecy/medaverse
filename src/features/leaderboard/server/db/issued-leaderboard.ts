"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, saleItems, sales, userRoles } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import type { LeadersAndSubordinates } from "./leaderboard";

export async function getIssuedLastSale() {
  const db = await createDrizzleSupabaseClient();
  const issuedSales = await db.admin
    .select({ sale: sales })
    .from(sales)
    .innerJoin(saleItems, eq(sales.id, saleItems.saleId))
    .where(
      sql`${saleItems.isIssued} = true AND ${saleItems.deletedAt} IS NULL AND ${sales.deletedAt} IS NULL`,
    )
    .orderBy(desc(sales.createdAt))
    .limit(1);

  const lastSaleRow = issuedSales[0];
  if (!lastSaleRow) {
    throw { message: "No issued sales found" };
  }
  const lastSale = lastSaleRow.sale;

  const [user] = await db.admin
    .select()
    .from(profile)
    .innerJoin(userRoles, eq(profile.userId, userRoles.userId))
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(profile.userId, lastSale.userId))
    .limit(1);

  if (!user) {
    throw { message: "User not found for last sale" };
  }

  const [issuedSum] = await db.admin
    .select({
      total: sql<number>`COALESCE(SUM(${saleItems.premiumAmount}), 0)`,
    })
    .from(saleItems)
    .where(
      sql`${saleItems.saleId} = ${lastSale.id} AND ${saleItems.isIssued} = true AND ${saleItems.deletedAt} IS NULL`,
    );

  return {
    createdAt: lastSale.updatedAt!,
    amount: String(issuedSum?.total ?? 0),
    user: {
      avatar: user.profile.avatarUrl,
      name: user.profile.name,
      role: user.roles.name,
    },
  };
}

export async function getIssuedSalesAmountByPeriod(
  period: "week" | "month" | "all" = "week",
  customDateRange?: { from: string; to: string },
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter = sql`1=1`;
  if (customDateRange?.from && customDateRange?.to) {
    dateFilter = sql`
      ${sales.createdAt}::date >= ${customDateRange.from}::date
      AND ${sales.createdAt}::date <= ${customDateRange.to}::date
    `;
  } else if (period === "week") {
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('week', NOW()) - INTERVAL '2 days')::date
    `;
  } else if (period === "month") {
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('month', NOW()))::date
    `;
  }

  const [result] = await db.admin
    .select({
      total: sql<number>`COALESCE(SUM(${saleItems.premiumAmount}), 0)`,
    })
    .from(sales)
    .innerJoin(saleItems, eq(sales.id, saleItems.saleId))
    .where(
      sql`${dateFilter} AND ${sales.deletedAt} IS NULL AND ${saleItems.isIssued} = true AND ${saleItems.deletedAt} IS NULL`,
    );

  if (result?.total == null) return "$0";
  return "$" + Math.ceil(Number(result.total) * 12).toLocaleString();
}

export async function getIssuedTodaySalesAmount(
  customDateRange?: { from: string; to: string },
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter;
  if (customDateRange?.from && customDateRange?.to) {
    dateFilter = sql`
      ${sales.createdAt}::date >= ${customDateRange.from}::date
      AND ${sales.createdAt}::date <= ${customDateRange.to}::date
      AND ${sales.deletedAt} IS NULL AND ${saleItems.isIssued} = true AND ${saleItems.deletedAt} IS NULL
    `;
  } else {
    const today = new Date(
      new Intl.DateTimeFormat("en-US", {
        timeStyle: "medium",
        dateStyle: "short",
        timeZone: "America/New_York",
      }).format(),
    ).toISOString();
    const todayStr = today.split("T")[0];
    dateFilter = sql`DATE(${sales.createdAt}) = ${todayStr}
      AND ${sales.deletedAt} IS NULL AND ${saleItems.isIssued} = true AND ${saleItems.deletedAt} IS NULL`;
  }

  const [result] = await db.admin
    .select({
      total: sql<number>`COALESCE(SUM(${saleItems.premiumAmount}), 0)`,
    })
    .from(sales)
    .innerJoin(saleItems, eq(sales.id, saleItems.saleId))
    .where(dateFilter);

  if (result?.total == null) return "$0";
  return "$" + Math.ceil(Number(result.total) * 12).toLocaleString();
}

export async function getIssuedLeaderboardDataByPeriod(
  period: "week" | "month" | "all" = "week",
  customDateRange?: { from: string; to: string },
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter = sql`1=1`;
  if (customDateRange?.from && customDateRange?.to) {
    dateFilter = sql`
      ${sales.createdAt}::date >= ${customDateRange.from}::date
      AND ${sales.createdAt}::date <= ${customDateRange.to}::date
    `;
  } else if (period === "week") {
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('week', NOW()) - INTERVAL '2 days')::date
    `;
  } else if (period === "month") {
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('month', NOW()))::date
    `;
  }

  const results = await db.admin
    .select({
      userId: profile.userId,
      name: profile.name,
      role: roles.name,
      avatarUrl: profile.avatarUrl,
      totalSalesAmount: sql<number>`COALESCE(SUM(${saleItems.premiumAmount}), 0)`,
      salesCount: sql<number>`COUNT(DISTINCT ${sales.id})`,
    })
    .from(profile)
    .leftJoin(userRoles, eq(profile.userId, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(sales, eq(profile.userId, sales.userId))
    .innerJoin(saleItems, eq(sales.id, saleItems.saleId))
    .where(
      sql`${dateFilter} AND ${sales.deletedAt} IS NULL
        AND ${saleItems.isIssued} = true AND ${saleItems.deletedAt} IS NULL`,
    )
    .groupBy(profile.userId, profile.name, profile.avatarUrl, roles.name)
    .having(sql`COUNT(DISTINCT ${sales.id}) > 0`)
    .orderBy(desc(sql<number>`COALESCE(SUM(${saleItems.premiumAmount}), 0)`));

  return results.map((r) => ({
    ...r,
    totalSalesAmount: Math.ceil(Number(r.totalSalesAmount ?? 0) * 12).toLocaleString(),
    salesCount: Number(r.salesCount ?? 0),
  }));
}

export async function getIssuedLeadersAndSubordinates({
  period,
  roleId,
  customDateRange,
}: {
  period?: "week" | "month" | "all";
  roleId: string;
  customDateRange?: { from: string; to: string };
}) {
  const db = await createDrizzleSupabaseClient();
  period ??= "week";
  const fromDate = customDateRange?.from ?? null;
  const toDate = customDateRange?.to ?? null;

  const result = await db.admin.transaction(async (tx) => {
    return tx.execute(
      sql`SELECT * FROM get_leader_issued_sales_summary2(${period}, ${fromDate}, ${toDate}, ${roleId})`,
    );
  });
  if (!result) return [];
  return (result as unknown as LeadersAndSubordinates[]).sort(
    (a, b) => Number(b.full_total_sales) - Number(a.full_total_sales),
  );
}
