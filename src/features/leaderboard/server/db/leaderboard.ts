"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, sales, userRoles } from "@/db/schema";
import { desc, eq, sum, sql } from "drizzle-orm";

export async function getLastSale() {
  const db = await createDrizzleSupabaseClient();
  const [lastSale] = await db.admin
    .select()
    .from(sales)
    .orderBy(desc(sales.createdAt))
    .limit(1);

  if (!lastSale) {
    throw { message: "No sales found" };
  }

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

  return {
    createdAt: lastSale.updatedAt!,
    amount: lastSale.totalSaleValue!.toLocaleString(),
    user: {
      avatar: user.profile.avatarUrl,
      name: user.profile.name,
      role: user.roles.name,
    },
  };
}

export async function getSalesAmountByPeriod(
  period: "week" | "month" | "all" = "week",
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter = sql`1=1`; // Default: no filter for 'all'

  if (period === "week") {
    // Use DATE_TRUNC for current week calculation (Monday to Sunday)
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('week', NOW()) - INTERVAL '2 days')::date
    `;
  } else if (period === "month") {
    // Use DATE_TRUNC for month calculation
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('month', NOW()))::date
    `;
  }
  // 'all' period uses no date filter (dateFilter = sql`1=1`)

  const [salesResult] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales)
    .where(sql`${dateFilter} AND ${sales.deletedAt} IS NULL`);

  if (salesResult?.total === null) {
    return "$0";
  }
  return "$" + Math.ceil(Number(salesResult!.total!) * 12).toLocaleString();
}

export async function getTodaySalesAmount() {
  const db = await createDrizzleSupabaseClient();

  // Get today's date
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [todaySales] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales)
    .where(
      sql`DATE(${sales.createdAt}) = ${todayStr}
          AND ${sales.deletedAt} IS NULL`,
    );

  if (todaySales?.total === null) {
    return "$0";
  }
  return "$" + Math.ceil(Number(todaySales!.total!) * 12).toLocaleString();
}

export type LeaderAndFollowers = {
  id: string;
  name: string;
  avatar_url: string;
  total_subordinate_sales_count: number;
  total_leader_sales_count: number;
  role_name: string;
  total_leader_sales: string;
  total_subordinates_sales: string;
  subordinates: {
    id: string;
    user_id: string;
    name: string;
    avatar_url: string;
    sales: string;
    sales_count: number;
  }[];
};

/**
 * @deprecated
 * @param param0
 * @returns
 */
export async function getSubordinatesTeams({
  userId,
}: {
  userId: string | undefined;
}) {
  if (userId === undefined) return [];
  const db = await createDrizzleSupabaseClient();

  const result = await db.admin.transaction(async (tx) => {
    return await tx.execute(
      sql`SELECT * FROM get_user_sales_with_subordinates(${userId})`,
    );
  });

  console.group("Subordinates: ", result);

  return result as unknown as LeaderAndFollowers;
}

export async function getLeadersAndSubordinates({
  period,
  roleId,
}: {
  period?: "week" | "month" | "all";
  roleId: string;
}) {
  const db = await createDrizzleSupabaseClient();

  period ??= period = "week";

  const result = await db.admin.transaction(async (tx) => {
    return tx.execute(
      sql` SELECT * FROM get_leader_sales_summary2(${period}, null, null, ${roleId})`,
    );
  });
  if (!result) return [];
  return (result as unknown as LeadersAndSubordinates[]).sort(
    (a, b) => Number(b.full_total_sales) - Number(a.full_total_sales),
  );
}

export type LeadersAndSubordinates = {
  leader_id: string;
  leader_name: string;
  total_sales_count: number;
  total_sales_amount: string;
  full_total_sales: string;
  full_total_sales_count: number;
  avatar_url: string;
  subordinates: {
    id: string;
    name: string;
    role: string;
    avatar_url: string;
    total_sales_count: number;
    total_sales_amount: number;
  }[];
};
