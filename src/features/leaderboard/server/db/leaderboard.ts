"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, sales, userRoles } from "@/db/schema";
import { desc, eq, sum } from "drizzle-orm";

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
    return "0$";
  }

  return totalSales!.total!.toLocaleString();
}

export type LastSale = Awaited<ReturnType<typeof getLastSale>>;
