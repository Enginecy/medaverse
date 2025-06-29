"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { insuranceCompanies } from "@/db/schema";
import type { AddCarrierFormData } from "@/features/dashboard/carriers/schema/carrier-schema";
import { createClient } from "@/lib/supabase/server";


export async function createCarrier(data: AddCarrierFormData) {
 try{
    alert("Creating carrier...");
     const drizzle = await createDrizzleSupabaseClient();
  const supabase = await createClient();
  
  
  const carrierId = crypto.randomUUID();
  const file = data.carrierImage as File;
    const fileExt = file.name.split(".").pop();
    const fileName = `${carrierId}/carrier.${fileExt}`;
    const { error: uploadError } = await supabase.storage
          .from("carrier-images")
          .upload(fileName, file, { upsert: true });
   if (uploadError)
      throw { message: "Failed to upload file", error: uploadError };
  const  uploadedFileName = fileName;

const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(fileName);
  const carrier = await drizzle.rls(async (tx) => {
    return tx
      .insert(insuranceCompanies)
      .values({
        code: "",
        //TDOD: generate a code or something 
        id: carrierId,
        name: data.companyName,
        email: data.email,
        phone: data.phoneNumber,
        website: data.website,

        imageUrl:
          publicUrl,
      })
      .returning();
  });
  return {success : true , carrier: carrier};
 }catch (error) {
    console.error("Error creating carrier:", error);
    return { success: false, error: "Failed to create carrier" };
 }
}
