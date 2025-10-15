"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import {
  insuranceCompanies,
  insuranceProducts,
  profile,
  saleItems,
  sales,
} from "@/db/schema";
import { getUserProfile } from "@/features/dashboard/home/server/db/home";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getSales() {
  const db = await createDrizzleSupabaseClient();
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (currentUser.error || !currentUser.data.user) {
    throw new Error("User not authenticated");
  }
  const userProfile = await getUserProfile();
  if (!userProfile) {
    throw new Error("User profile not found");
  }
  const salesData = await db.rls(async (tx) => {
    const _count = await tx.select({ count: count() }).from(sales).limit(1);

    const baseQuery = await tx
      .select({
        id: sales.id,
        user: {
          name: profile.name,
          // role: profile.role,
          avatar: profile.avatarUrl,
        },
        totalAmount: sales.totalSaleValue,
        saleDate: sales.saleDate,
        notes: sales.notes,
        customerName: sales.customerName,
        products: sql<SaleItem[]>`json_agg(
          json_build_object(
            'productName', ${insuranceProducts.name},
            'companyName', ${insuranceCompanies.name},
            'premiumAmount', ${saleItems.premiumAmount},
            'policyNumber', ${saleItems.policyNumber}
          )
        )`.as("products"),
        createdAt: sales.createdAt,
        updatedAt: sales.updatedAt,
        _count: sql<number>`${_count[0]?.count}`,
      })
      .from(sales)
      .innerJoin(saleItems, eq(sales.id, saleItems.saleId))
      .innerJoin(
        insuranceProducts,
        eq(saleItems.productId, insuranceProducts.id),
      )
      .innerJoin(
        insuranceCompanies,
        eq(saleItems.companyId, insuranceCompanies.id),
      )
      .innerJoin(profile, eq(sales.userId, profile.userId))
      .groupBy(sales.id, profile.name, profile.avatarUrl)
      .orderBy(desc(sales.createdAt));
    return baseQuery;
  });

  return salesData;
}
export type SaleItem = {
  productName: string;
  companyName: string;
  premiumAmount: number;
  policyNumber: string;
};
export type Sale = Awaited<ReturnType<typeof getSales>>[number];

export async function getProducts() {
  const db = await createDrizzleSupabaseClient();
  const products = await db.rls(async (tx) => {
    return tx
      .select({
        id: insuranceProducts.id,
        name: insuranceProducts.name,
        productCode: insuranceProducts.productCode,
      })
      .from(insuranceProducts);
  });
  return products;
}
export type Product = Awaited<ReturnType<typeof getProducts>>[number];

export async function getCompanies() {
  const db = await createDrizzleSupabaseClient();
  const companies = await db.rls(async (tx) => {
    return tx
      .select({
        id: insuranceCompanies.id,
        name: insuranceCompanies.name,
        companyCode: insuranceCompanies.code,
      })
      .from(insuranceCompanies);
  });
  return companies;
}
export type Company = Awaited<ReturnType<typeof getCompanies>>[number];

export async function getProductsAndCompanies() {
  const products = await getProducts();
  const companies = await getCompanies();
  return { products, companies };
}
