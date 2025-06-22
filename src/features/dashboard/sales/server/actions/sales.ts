"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { saleItems, sales } from "@/db/schema";
import type { AddSaleFormData } from "@/features/dashboard/sales/schemas/add-sale-schema";

export async function addSale(
  userId: string,
  { clientName, date, products }: AddSaleFormData,
) {
  const db = await createDrizzleSupabaseClient();

  await db.rls(async (tx) => {
    const [sale] = await tx
      .insert(sales)
      .values({
        id: crypto.randomUUID(),
        customerName: clientName,
        saleDate: date,
        userId,
      })
      .returning({
        id: sales.id,
      });

    if (!sale) {
      throw {
        message: "Sale not created",
        status: 500,
      };
    }

    const payload: (typeof saleItems.$inferInsert)[] = products.map(
      (product) => ({
        id: crypto.randomUUID(),
        saleId: sale.id,
        productId: product.productId,
        companyId: product.companyId,
        premiumAmount: product.premium!.toString(),
        policyNumber: product.policyNumber,
      }),
    );

    await tx.insert(saleItems).values(payload);
  });
}
