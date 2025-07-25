"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { insuranceCompanies } from "@/db/schema";
import { isNull } from "drizzle-orm";

export async function getCarriers() {
  const db = await createDrizzleSupabaseClient();
  const carriers = await db.rls((tx) => {
    return tx
      .select()
      .from(insuranceCompanies)
      .where(isNull(insuranceCompanies.deletedAt));
  });
  // Map carriers to extract id, name, and other fields as needed
  const carrierList = carriers.map((carrier) => ({
    id: carrier.id,
    name: carrier.name,
    phoneNumber: carrier.phone,
    email: carrier.email,
    code: carrier.code,
    imageUrl: carrier.imageUrl,
    website: carrier.website,
  }));
  return carrierList;
}

export type Carrier = Awaited<ReturnType<typeof getCarriers>>[number];
