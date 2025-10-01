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

export async function getSalesAmountByPeriod(
  period: "week" | "month" | "all" = "week",
) {
  const db = await createDrizzleSupabaseClient();

  let dateFilter = sql`1=1`; // Default: no filter for 'all'

  if (period === "week") {
    // Use DATE_TRUNC for current week calculation (Monday to Sunday)
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('week', NOW()))::date
      AND ${sales.createdAt}::date < (DATE_TRUNC('week', NOW()) + INTERVAL '1 week')::date
    `;
  } else if (period === "month") {
    // Use DATE_TRUNC for month calculation
    dateFilter = sql`
      ${sales.createdAt}::date >= (DATE_TRUNC('month', NOW()))::date
      AND ${sales.createdAt}::date <= (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')::date
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
  return "$" + (Number(salesResult!.total!) * 12).toLocaleString();
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

  // // console.log(normalized);

  return normalized;
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

export async function getSubordinatesTeams({ userId }: { userId: string | undefined}) {
  if(userId === undefined) return [];
  const db = await createDrizzleSupabaseClient();

  const result = await db.admin.transaction(async (tx) => {
    return await tx.execute(
      sql`SELECT * FROM get_user_sales_with_subordinates(${userId})`,
    );
  });

  console.group("Subordinates: ", result);

  return result as unknown as LeaderAndFollowers ;

}
