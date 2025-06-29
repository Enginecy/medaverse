import { createDrizzleSupabaseClient } from "@/db/db";



export async function getCarriers(){
    const db = await createDrizzleSupabaseClient();
    return db.admin.select().from();
    
}