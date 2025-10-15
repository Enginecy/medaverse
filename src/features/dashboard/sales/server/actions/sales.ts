"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { saleItems, sales } from "@/db/schema";
import type { AddSaleFormData } from "@/features/dashboard/sales/schemas/add-sale-schema";
import type { ActionResult } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addSale(
  userId: string,
  { clientName, date, products }: AddSaleFormData,
): Promise<ActionResult<void>> {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls(async (tx) => {
    const [sale] = await tx
      .insert(sales)
      .values({
        id: crypto.randomUUID(),
        customerName: clientName,
        saleDate: date,
        totalSaleValue: products
          .reduce((acc, product) => {
            const premium = product.premium!;
            return acc + premium;
          }, 0)
          .toString(),
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

    return await tx.insert(saleItems).values(payload);
  });

  if (!result) {
    return {
      success: false,
      error: {
        message: "Failed to create sale",
        statusCode: 400,
        details:
          "An error occurred while creating the sale. Please try again later.",
      },
    };
  }
  return { success: true, data: undefined };
}

export async function deleteSale(
  saleId: string,
): Promise<ActionResult<void>> {
  try {
    const db = await createDrizzleSupabaseClient();

    await db.rls(async (tx) => {
      // First delete all sale items associated with this sale
      await tx.delete(saleItems).where(eq(saleItems.saleId, saleId));

      // Then delete the sale itself
      await tx.delete(sales).where(eq(sales.id, saleId));
    });

    revalidatePath("/dashboard/sales");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to delete sale",
        statusCode: 500,
        details:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the sale. Please try again later.",
      },
    };
  }
}
