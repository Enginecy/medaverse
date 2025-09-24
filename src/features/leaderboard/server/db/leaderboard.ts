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

export async function getLeaderAndFollowers({
  leaderId,
}: {
  leaderId?: string;
}) {
  const db = await createDrizzleSupabaseClient();
  const results = await db.rls(async (tx) => {
    return tx.execute(
      sql<LeaderAndFollowers[]>`select
                users.id,
                profile.name,
                profile.avatar_url,
                roles.name as role_name,
                coalesce(SUM(subordinate.sales), 0) as total_subordinate_sales,
                coalesce(SUM(subordinate.sales_count), 0) as total_subordinate_sales_count,
                JSON_ARRAYAGG (
                  JSON_OBJECT(
                    array[
                      'id',
                      'user_id',
                      'name',
                      'avatar_url',
                      'sales',
                      'role_name',
                      'sales_count'
                    ],
                    array[
                      subordinate.id,
                      subordinate.user_id,
                      subordinate.name,
                      subordinate.avatar_url,
                      COALESCE(subordinate.sales, 0)::TEXT,
                      subordinate.role_name,
                      subordinate.sales_count
                    ]::text[]
                  )
                ) as subordinates
              from
                auth.users
                inner join profile on profile.user_id = users.id
                inner join user_roles on users.id = user_roles.user_id
                inner join roles on user_roles.role_id = roles.id
                inner join user_hierarchy on user_hierarchy.leader_id = users.id
                inner join (
                  select
                    profile.id,
                    profile.user_id,
                    profile.name,
                    profile.avatar_url,
                    SUM(sales.total_sale_value) * 12 as sales,
                    COUNT(sales.id) as sales_count,
                    roles.name as role_name
                  from
                    profile
                    left join sales on profile.user_id = sales.user_id
                    inner join user_roles on profile.user_id = user_roles.user_id
                    inner join roles on user_roles.role_id = roles.id
                  group by
                    profile.id,
                    profile.user_id,
                    profile.name,
                    profile.avatar_url,
                    roles.name
                ) as subordinate on user_hierarchy.user_id = subordinate.user_id
              where
                roles.id = ${leaderId}
              group by
                users.id,
                profile.name,
                profile.avatar_url,
                roles.name
              order by
                total_subordinate_sales desc;`,
    );
  });

  // const result = (results as unknown as { rows: LeaderAndFollowers[] }).rows;

  // console.log("THIS IS THE RESULT",result);

  const normalized: LeaderAndFollowers[] = (results as any[]).map((r) => ({
    id: r.id,
    name: r.name,
    role_name: r.role_name,
    total_subordinate_sales_count: r.total_subordinate_sales_count,
    avatar_url: r.avatar_url,
    total_subordinates_sales: r.total_subordinate_sales,
    // parse JSON string to array if necessary
    subordinates: r.subordinates ? r.subordinates : [],
  }));

  console.log((normalized));

  return normalized;
}

export type LeaderAndFollowers = {
  id: string;
  name: string;
  avatar_url: string;
  total_subordinate_sales_count: number;
  role_name: string;
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
