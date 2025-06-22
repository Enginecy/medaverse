"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import {
  insuranceCompanies,
  insuranceProducts,
  saleItems,
  sales,
} from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getSales() {
  const db = await createDrizzleSupabaseClient();
  const salesData = await db.rls(async (tx) => {
    const _count = await tx.select({ count: count() }).from(sales).limit(1);
    return tx
      .select({
        id: sales.id,
        totalAmount: sales.totalSaleValue,
        saleDate: sales.saleDate,
        notes: sales.notes,
        customerName: sales.customerName,
        products: sql<SaleItem[]>`json_agg(
          json_build_object(
            'product_name', ${insuranceProducts.name},
            'premium_amount', ${saleItems.premiumAmount},
            'policy_number', ${saleItems.policyNumber}
          )
        )`.as("products"),
        productName: insuranceProducts.name,
        companyName: insuranceCompanies.name,
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
      .groupBy(sales.id, insuranceProducts.name, insuranceCompanies.name)
      .orderBy(desc(sales.createdAt));
  });

  return salesData;
}
type SaleItem = {
  productName: string;
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
