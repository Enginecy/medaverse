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
  
  const mondayStr = currentDay === 1 ? 
    now.toISOString().split('T')[0] : // If today is Monday, use today
    monday.toISOString().split('T')[0]; // Otherwise use calculated Monday
  
  const fridayStr = friday.toISOString().split('T')[0];
  
  const [weeklySales] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales)
    .where(
      sql`DATE(${sales.createdAt}) >= ${mondayStr} 
          AND DATE(${sales.createdAt}) <= ${fridayStr}
          AND ${sales.deletedAt} IS NULL`
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
  const todayStr = today.toISOString().split('T')[0];
  
  const [todaySales] = await db.admin
    .select({ total: sum(sales.totalSaleValue) })
    .from(sales)
    .where(
      sql`DATE(${sales.createdAt}) = ${todayStr}
          AND ${sales.deletedAt} IS NULL`
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
    monday: monday.toISOString().split('T')[0],
    friday: friday.toISOString().split('T')[0],
    isWeekend: currentDay === 0 || currentDay === 6,
    currentDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]
  };
}

export type LastSale = Awaited<ReturnType<typeof getLastSale>>;
