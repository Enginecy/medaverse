"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import {
  profile,
  roles,
  sales,
  userHierarchy,
  userRoles,
  users,
} from "@/db/schema";
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

export async function getTotalSalesAmount() {
  const db = await createDrizzleSupabaseClient();
  const [totalSales] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales);

  if (totalSales?.total === null) {
    return "$0";
  }
  return "$" + Number(totalSales!.total!).toLocaleString();
}

export async function getSalesAmountByPeriod(
  period: "week" | "month" | "all" = "week",
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter = sql`1=1`; // Default: no filter for 'all'

  if (period === "week") {
    // WEEKLY ALGORITHM (existing logic)
    const now = new Date();
    const currentDay = now.getDay();

    let monday: Date;
    let friday: Date;

    if (currentDay === 0 || currentDay === 6) {
      if (currentDay === 0) {
        monday = new Date(now);
        monday.setDate(now.getDate() - 6);
      } else {
        monday = new Date(now);
        monday.setDate(now.getDate() - 5);
      }
      monday.setHours(0, 0, 0, 0);

      friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);
    } else {
      if (currentDay === 1) {
        monday = new Date(now);
        monday.setHours(0, 0, 0, 0);
      } else {
        const daysToMonday = currentDay - 1;
        monday = new Date(now);
        monday.setDate(now.getDate() - daysToMonday);
        monday.setHours(0, 0, 0, 0);
      }

      friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);
    }

    const mondayStr =
      currentDay === 1
        ? now.toISOString().split("T")[0]
        : monday.toISOString().split("T")[0];

    const fridayStr = friday.toISOString().split("T")[0];

    dateFilter = sql`DATE(${sales.createdAt}) >= ${mondayStr} 
        AND DATE(${sales.createdAt}) <= ${fridayStr}`;
  } else if (period === "month") {
    // MONTHLY ALGORITHM
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startDateStr = firstDayOfMonth.toISOString().split("T")[0];
    const endDateStr = lastDayOfMonth.toISOString().split("T")[0];

    dateFilter = sql`DATE(${sales.createdAt}) >= ${startDateStr} 
        AND DATE(${sales.createdAt}) <= ${endDateStr}`;
  }
  // 'all' period uses no date filter (dateFilter = sql`1=1`)

  const [salesResult] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales)
    .where(sql`${dateFilter} AND ${sales.deletedAt} IS NULL`);

  if (salesResult?.total === null) {
    return "$0";
  }
  return "$" + (Number(salesResult!.total!) * 12).toLocaleString();
}

export async function getWeeklySalesAmount() {
  const db = await createDrizzleSupabaseClient();
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let monday: Date;
  let friday: Date;

  if (currentDay === 0 || currentDay === 6) {
    // Saturday (6) or Sunday (0): Show previous week's Monday-Friday
    if (currentDay === 0) {
      // Sunday: go back 6 days to get last Monday
      monday = new Date(now);
      monday.setDate(now.getDate() - 6);
    } else {
      // Saturday: go back 5 days to get this week's Monday
      monday = new Date(now);
      monday.setDate(now.getDate() - 5);
    }
    monday.setHours(0, 0, 0, 0);

    friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
  } else {
    // Monday-Friday: Show current week starting from THIS Monday
    if (currentDay === 1) {
      // If today is Monday, start from today (fresh start)
      monday = new Date(now);
      monday.setHours(0, 0, 0, 0);
    } else {
      // If today is Tue-Fri, find this week's Monday
      const daysToMonday = currentDay - 1; // Monday is 1, so subtract 1
      monday = new Date(now);
      monday.setDate(now.getDate() - daysToMonday);
      monday.setHours(0, 0, 0, 0);
    }

    friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); // Set to Friday for the upper bound
    friday.setHours(23, 59, 59, 999);
  }

  const mondayStr =
    currentDay === 1
      ? now.toISOString().split("T")[0] // If today is Monday, use today
      : monday.toISOString().split("T")[0]; // Otherwise use calculated Monday

  const fridayStr = friday.toISOString().split("T")[0];

  const [weeklySales] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales)
    .where(
      sql`DATE(${sales.createdAt}) >= ${mondayStr} 
          AND DATE(${sales.createdAt}) <= ${fridayStr}
          AND ${sales.deletedAt} IS NULL`,
    );

  if (weeklySales?.total === null) {
    return "$0";
  }
  return "$" + (Number(weeklySales!.total!) * 12).toLocaleString();
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
  return "$" + (Number(todaySales!.total!) * 12).toLocaleString();
}

/**
 * Get the current week date range being used for weekly sales calculation
 * Useful for debugging and displaying to users
 */
export async function getWeeklyDateRange() {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let monday: Date;
  let friday: Date;

  if (currentDay === 0 || currentDay === 6) {
    // Saturday (6) or Sunday (0): Show previous week's Monday-Friday
    if (currentDay === 0) {
      // Sunday: go back 6 days to get last Monday
      monday = new Date(now);
      monday.setDate(now.getDate() - 6);
    } else {
      // Saturday: go back 5 days to get this week's Monday
      monday = new Date(now);
      monday.setDate(now.getDate() - 5);
    }
    monday.setHours(0, 0, 0, 0);

    friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
  } else {
    // Monday-Friday: Show current week starting from THIS Monday
    if (currentDay === 1) {
      // If today is Monday, start from today (fresh start)
      monday = new Date(now);
      monday.setHours(0, 0, 0, 0);
    } else {
      // If today is Tue-Fri, find this week's Monday
      const daysToMonday = currentDay - 1; // Monday is 1, so subtract 1
      monday = new Date(now);
      monday.setDate(now.getDate() - daysToMonday);
      monday.setHours(0, 0, 0, 0);
    }

    friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); // Set to Friday for the upper bound
    friday.setHours(23, 59, 59, 999);
  }

  return {
    monday: monday.toISOString().split("T")[0],
    friday: friday.toISOString().split("T")[0],
    isWeekend: currentDay === 0 || currentDay === 6,
    currentDay: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][currentDay],
  };
}

export type LastSale = Awaited<ReturnType<typeof getLastSale>>;

export async function getLeaderAndFollowersByPeriod({
  leaderId,
  period = "week",
}: {
  leaderId?: string;
  period?: "week" | "month" | "all";
}) {
  const periodParam = String(period);
  const db = await createDrizzleSupabaseClient();
  const results = await db.admin.transaction(async (tx) => {
    return tx.execute(
      sql<LeaderAndFollowers[]>`WITH user_sales_summary AS (
        SELECT
            user_id,
            COALESCE(SUM(total_sale_value) * 12, 0) AS total_sales
        FROM
            sales
        GROUP BY
            user_id
    ),
    date_range AS (
  SELECT
    CASE ${periodParam}::text
      WHEN 'week' THEN
        CASE
          WHEN EXTRACT(DOW FROM NOW()) IN (0, 6) THEN (DATE_TRUNC('week', NOW() - INTERVAL '7 days'))::date
          ELSE (DATE_TRUNC('week', NOW()))::date
        END
      WHEN 'month' THEN (DATE_TRUNC('month', NOW()))::date
      WHEN 'all' THEN '1900-01-01'::date
    END AS start_date,
    CASE ${periodParam}::text
      WHEN 'week' THEN
        CASE
          WHEN EXTRACT(DOW FROM NOW()) IN (0, 6) THEN (DATE_TRUNC('week', NOW() - INTERVAL '7 days') + INTERVAL '4 days')::date
          ELSE (DATE_TRUNC('week', NOW()) + INTERVAL '4 days')::date
        END
      WHEN 'month' THEN (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')::date
      WHEN 'all' THEN '2999-12-31'::date
    END AS end_date
    )
    SELECT
      users.id,
      profile.name,
      profile.avatar_url,
      roles.name AS role_name,
      COALESCE(leader_sales_summary.total_leader_sales, 0) AS total_leader_sales,
      COALESCE(leader_sales_summary.total_leader_sales_count, 0) AS total_leader_sales_count,
      COALESCE(SUM(subordinate.sales), 0) AS total_subordinate_sales,
      COALESCE(SUM(subordinate.sales_count), 0) AS total_subordinate_sales_count,
      JSON_ARRAYAGG (
        JSON_OBJECT(
          ARRAY[
            'id',
            'user_id',
            'name',
            'avatar_url',
            'sales',
            'role_name',
            'sales_count'
          ],
          ARRAY[
            subordinate.id,
            subordinate.user_id,
            subordinate.name,
            subordinate.avatar_url,
            COALESCE(subordinate.sales, 0)::TEXT,
            subordinate.role_name,
            subordinate.sales_count
          ]::TEXT[]
        )
      ) AS subordinates
    FROM
      auth.users
      INNER JOIN profile ON profile.user_id = users.id
      INNER JOIN user_roles ON users.id = user_roles.user_id
      INNER JOIN roles ON user_roles.role_id = roles.id
      INNER JOIN user_hierarchy ON user_hierarchy.leader_id = users.id
      LEFT JOIN (
        SELECT
          user_id,
          COALESCE(SUM(total_sale_value) * 12, 0) AS total_leader_sales,
          COUNT(sales.id) AS total_leader_sales_count
        FROM
          sales
          INNER JOIN date_range ON sales.created_at::date >= date_range.start_date
          AND sales.created_at::date <= date_range.end_date
        GROUP BY
          user_id
      ) AS leader_sales_summary ON users.id = leader_sales_summary.user_id
      LEFT JOIN (
        SELECT
          profile.id,
          profile.user_id,
          profile.name,
          profile.avatar_url,
          COALESCE(SUM(sales.total_sale_value) * 12, 0) AS sales,
          COUNT(sales.id) AS sales_count,
          roles.name AS role_name
        FROM
          profile
          LEFT JOIN sales ON profile.user_id = sales.user_id
            AND sales.created_at::date >= (SELECT start_date FROM date_range)
            AND sales.created_at::date <= (SELECT end_date FROM date_range)
          INNER JOIN user_roles ON profile.user_id = user_roles.user_id
          INNER JOIN roles ON user_roles.role_id = roles.id
        GROUP BY
          profile.id,
          profile.user_id,
          profile.name,
          profile.avatar_url,
          roles.name
      ) AS subordinate ON user_hierarchy.user_id = subordinate.user_id
    WHERE
      roles.id = ${leaderId}
      AND user_hierarchy.user_id != users.id
    GROUP BY
      users.id,
      profile.name,
      profile.avatar_url,
      roles.name,
      leader_sales_summary.total_leader_sales,
      leader_sales_summary.total_leader_sales_count
    ORDER BY
      total_leader_sales DESC,
      total_subordinate_sales DESC;`,
    );
  });

  // const result = (results as unknown as { rows: LeaderAndFollowers[] }).rows;

  // console.log("THIS IS THE RESULT",result);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalized: LeaderAndFollowers[] = (results as any[]).map((r) => ({
    id: r.id,
    name: r.name,
    role_name: r.role_name,
    total_subordinate_sales_count: r.total_subordinate_sales_count,
    total_leader_sales_count: r.total_leader_sales_count ?? 0,
    avatar_url: r.avatar_url,
    total_leader_sales: r.total_leader_sales,
    total_subordinates_sales: r.total_subordinate_sales,
    // parse JSON string to array if necessary
    subordinates: r.subordinates ?? [],
  }));

  // Add leader sales to subordinate sales for total
  normalized.forEach((leader) => {
    const leaderSales = parseFloat(leader.total_leader_sales) || 0;
    const subordinateSales = parseFloat(leader.total_subordinates_sales) || 0;
    leader.total_subordinates_sales = (
      leaderSales + subordinateSales
    ).toLocaleString();
    const sortedSubordinates = leader.subordinates.sort((a, b) => {
      return parseFloat(b.sales) - parseFloat(a.sales);
    });
    leader.subordinates = sortedSubordinates;
  });

  

  // console.log(normalized);

  return normalized;
}

// Keep original function for backward compatibility
export async function getLeaderAndFollowers({
  leaderId,
}: {
  leaderId?: string;
}) {
  return getLeaderAndFollowersByPeriod({ leaderId, period: "week" });
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
