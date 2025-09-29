"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, sales, userRoles } from "@/db/schema";
import { count, eq, sql, desc, gt } from "drizzle-orm";

export async function getLeaderboardDataByPeriod(period: 'week' | 'month' | 'all' = 'week') {
  const db = await createDrizzleSupabaseClient();
  
  let dateFilter = sql`1=1`; // Default: no filter for 'all'
  
  if (period === 'week') {
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
    
    const mondayStr = currentDay === 1 ? 
      now.toISOString().split('T')[0] : 
      monday.toISOString().split('T')[0];
    
    const fridayStr = friday.toISOString().split('T')[0];
    
    dateFilter = sql`DATE(${sales.createdAt}) >= ${mondayStr} 
        AND DATE(${sales.createdAt}) <= ${fridayStr}`;
        
  } else if (period === 'month') {
    // MONTHLY ALGORITHM
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const startDateStr = firstDayOfMonth.toISOString().split('T')[0];
    const endDateStr = lastDayOfMonth.toISOString().split('T')[0];
    
    dateFilter = sql`DATE(${sales.createdAt}) >= ${startDateStr} 
        AND DATE(${sales.createdAt}) <= ${endDateStr}`;
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
    .where(
      sql`${dateFilter} AND ${sales.deletedAt} IS NULL`
    )
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
  
  // SAME WEEKLY ALGORITHM - Calculate Monday to Friday range
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
  
  // Get date strings properly to avoid timezone issues
  const mondayStr = currentDay === 1 ? 
    now.toISOString().split('T')[0] : // If today is Monday, use today
    monday.toISOString().split('T')[0]; // Otherwise use calculated Monday
  
  const fridayStr = friday.toISOString().split('T')[0];
  
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
    .where(
      sql`DATE(${sales.createdAt}) >= ${mondayStr} 
          AND DATE(${sales.createdAt}) <= ${fridayStr}
          AND ${sales.deletedAt} IS NULL`
    )
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
