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
            'insured_person_name', ${saleItems.insuredPersonName},
            'premium_amount', ${saleItems.premiumAmount},
            'policy_number', ${saleItems.policyNumber},
            'policy_start_date', ${saleItems.policyStartDate},
            'policy_end_date', ${saleItems.policyEndDate},
            'coverage_amount', ${saleItems.coverageAmount}
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
        eq(insuranceProducts.companyId, insuranceCompanies.id),
      )
      .groupBy(sales.id, insuranceProducts.name, insuranceCompanies.name)
      .orderBy(desc(sales.createdAt));
  });

  return salesData;
}
type SaleItem = {
  productName: string;
  insuredPersonName: string;
  premiumAmount: number;
  policyNumber: string;
  policyStartDate: Date;
  policyEndDate: Date;
  coverageAmount: number;
};
export type Sale = Awaited<ReturnType<typeof getSales>>[number];
