import { createDrizzleSupabaseClient } from "@/db/db";
import { insuranceCompanies } from "@/db/schema";
import type { AddCarrierFormData } from "@/features/dashboard/carriers/schema/carrier-schema";
import { createClient } from "@/lib/supabase/server";


export async function createCarrier(data: AddCarrierFormData) {
  const drizzle = await createDrizzleSupabaseClient();
  const supabase = await createClient();
  
  
  const carrierId = crypto.randomUUID();
  const file = data.carrierImage as File;
    const fileExt = file.name.split(".").pop();
    const fileName = `${carrierId}/carrier.${fileExt}`;
    const { error: uploadError } = await supabase.storage
          .from("carrier-images")
          .upload(fileName, file, { upsert: true });

  const carrier = await drizzle.rls(async (tx) => {
    return tx
      .insert(insuranceCompanies)
      .values({
        code: "",
        id: carrierId,
        name: data.companyName,
        email: data.email,
        phone: data.phoneNumber,
        website: data.website,

        imageUrl:
          data.carrierImage instanceof File
            ? URL.createObjectURL(data.carrierImage)
            : (data.carrierImage as string),
      })
      .returning();
  });
}
