"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile } from "@/db/schema";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

import { eq } from "drizzle-orm";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function createAgent(data: AddUserFormData) {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();

  // Check if username already exists
  const existingProfile = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.username, data.username));

  if (existingProfile) {
    throw { message: "Username already exists" };
  }
  let createdUser: { id: string } | null = null;
  let uploadedFileName: string | null = null;

  try {
    // Step 1: Create user in Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      password: crypto.randomUUID(),
    });

    if (userError || !user?.id)
      throw { message: "Failed to create user", error: userError };
    createdUser = user;

    // Step 2: Prepare file upload details
    const file = data.profileImage;
    const userId = crypto.randomUUID();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    // Step 3: Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError)
      throw { message: "Failed to upload file", error: uploadError };
    uploadedFileName = fileName;

    // Step 4: Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(fileName);

    // Step 5: Database operations in transaction

    const profileData = await db.rls((tx) => {
      return tx
        .insert(profile)
        .values({
          id: userId,
          name: data.fullName,
          username: data.username,
          address: data.address ?? null,
          dob: data.dateOfBirth.toISOString(),
          role: "Associate",
          status: "active",
          avatarUrl: publicUrl,
          userId: user.id,
        })
        .returning();
    });

    return { success: true, profile: profileData };
  } catch (error) {
    // Rollback operations in reverse order
    console.error("Error in createAgent, rolling back:", error);

    // Clean up uploaded file if it exists
    if (uploadedFileName) {
      try {
        await supabase.storage
          .from("profile-images")
          .remove([uploadedFileName]);
      } catch (cleanupError) {
        console.error("Failed to cleanup uploaded file:", cleanupError);
      }
    }

    // Clean up created user if it exists
    if (createdUser?.id) {
      try {
        await auth.admin.deleteUser(createdUser.id);
      } catch (cleanupError) {
        console.error("Failed to cleanup created user:", cleanupError);
      }
    }

    throw error;
  }
}
