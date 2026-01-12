"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { saleItems, sales } from "@/db/schema";
import type { AddSaleFormData } from "@/features/dashboard/sales/schemas/add-sale-schema";
import type { ActionResult } from "@/lib/utils";
import { readIssuedSalesFile, type IssuedSaleRecord } from "@/utils/extract-issued-sales";
import { eq, inArray, sql } from "drizzle-orm";
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

export type ImportIssuedSalesResult = {
  matchedCount: number;
  unmatchedRecords: IssuedSaleRecord[];
};

export async function importIssuedSales(
  formData: FormData,
): Promise<ActionResult<ImportIssuedSalesResult>> {
  try {
    // Extract file from FormData
    const file = formData.get("file") as File;
    if (!file || !(file instanceof File)) {
      return {
        success: false,
        error: {
          message: "No file provided",
          statusCode: 400,
          details: "Please select a file to upload.",
        },
      };
    }

    // Parse Excel file
    const records = await readIssuedSalesFile(file);

    if (records.length === 0) {
      return {
        success: false,
        error: {
          message: "No records found in file",
          statusCode: 400,
          details: "The Excel file does not contain any valid sales records.",
        },
      };
    }

    const db = await createDrizzleSupabaseClient();

    // Normalize policy numbers from Excel for matching (trim and uppercase for case-insensitive matching)
    const normalizedPolicyNumbers = new Set(
      records.map((r) => r.policyNo.trim().toUpperCase()),
    );

    // Fetch all sale items and match in memory (safer than raw SQL)
    const allSaleItems = await db.rls(async (tx) => {
      return tx
        .select({
          id: saleItems.id,
          policyNumber: saleItems.policyNumber,
        })
        .from(saleItems);
    });

    // Create a map of normalized policy numbers to existing sale item IDs
    const policyNumberMap = new Map<string, string>();
    allSaleItems.forEach((item) => {
      const normalized = item.policyNumber.trim().toUpperCase();
      if (normalizedPolicyNumbers.has(normalized)) {
        policyNumberMap.set(normalized, item.id);
      }
    });

    // Update matched sale items
    const matchedIds: string[] = [];
    const unmatchedRecords: IssuedSaleRecord[] = [];

    records.forEach((record) => {
      const normalizedPolicyNo = record.policyNo.trim().toUpperCase();
      const saleItemId = policyNumberMap.get(normalizedPolicyNo);

      if (saleItemId) {
        matchedIds.push(saleItemId);
      } else {
        unmatchedRecords.push(record);
      }
    });

    // Update matched sale items to set isIssued = true
    if (matchedIds.length > 0) {
      await db.rls(async (tx) => {
        await tx
          .update(saleItems)
          .set({ isIssued: true })
          .where(inArray(saleItems.id, matchedIds));
      });
    }

    revalidatePath("/dashboard/sales");

    return {
      success: true,
      data: {
        matchedCount: matchedIds.length,
        unmatchedRecords,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to import issued sales",
        statusCode: 500,
        details:
          error instanceof Error
            ? error.message
            : "An error occurred while importing issued sales. Please try again later.",
      },
    };
  }
}
