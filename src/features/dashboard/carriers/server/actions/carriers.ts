"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { insuranceCompanies } from "@/db/schema";
import type { AddCarrierFormData } from "@/features/dashboard/carriers/schema/carrier-schema";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function createCarrier(
  data: AddCarrierFormData,
): Promise<ActionResult<typeof carrier>> {
  const drizzle = await createDrizzleSupabaseClient();
  const supabase = await createClient();

  const carrierId = crypto.randomUUID();
  const file = data.carrierImage as File;
  const fileExt = file.name.split(".").pop();
  const fileName = `${carrierId}/carrier.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("company-images")
    .upload(fileName, file, { upsert: true });
  if (uploadError)
    throw { message: "Failed to upload file", error: uploadError };

  const {
    data: { publicUrl },
  } = supabase.storage.from("company-images").getPublicUrl(fileName);

  const carrier = await drizzle.rls(async (tx) => {
    return tx
      .insert(insuranceCompanies)
      .values({
        id: carrierId,
        code: data.code,
        name: data.companyName,
        email: data.email,
        phone: data.phoneNumber,
        website: data.website,
        imageUrl: publicUrl,
      })
      .returning();
  });
  if (!carrier) {
    return {
      success: false,
      error: {
        message: "Failed to create carrier",
        statusCode: 400,
        details:
          "Something went wrong creating a carrier, please try again later.",
      },
    };
  }
  return { success: true, data: carrier };
}

export async function deleteCarrier(id: string): Promise<ActionResult<void>> {
  const drizzle = await createDrizzleSupabaseClient();
  const result = await drizzle.rls(async (tx) => {
    return tx
      .update(insuranceCompanies)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(insuranceCompanies.id, id));
  });
  if (!result) {
    return {
      success: false,
      error: {
        message: "Failed to delete carrier",
        statusCode: 400,
        details:
          "Something went wrong deleting this carrier, please try again later.",
      },
    };
  }
 return { success: true, data: undefined}; 
}

export async function updateCarrier(
  data: AddCarrierFormData,
  carrierId: string,
) {
  try {
    const drizzle = await createDrizzleSupabaseClient();
    const supabase = await createClient();

    if (data.carrierImage instanceof File) {
      const file = data.carrierImage as File;
      const fileName = `${carrierId}/carrier.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("company-images")
        .upload(fileName, file, { upsert: true });
      if (uploadError)
        throw { message: "Failed to upload file", error: uploadError };
    }

    const carrier = await drizzle.rls(async (tx) => {
      return tx
        .update(insuranceCompanies)
        .set({
          code: data.code,
          name: data.companyName,
          email: data.email,
          phone: data.phoneNumber,
          website: data.website,
        })
        .where(eq(insuranceCompanies.id, carrierId))
        .returning();
    });
    return { success: true, carrier: carrier };
  } catch (error) {
    console.error("Error creating carrier:", error);
    throw { success: false, message: "Failed to create carrier" };
  }
}
