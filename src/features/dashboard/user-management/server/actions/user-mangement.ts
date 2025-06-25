"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile } from "@/db/schema";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

import { eq } from "drizzle-orm";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { env } from "@/env";

import { roles } from "@/lib/data";

export async function createAgent(data: AddUserFormData) {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();

  // Check if username already exists
  const existingProfile = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.username, data.username));

  if (existingProfile.length > 0) {
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
      password: env.AUTOMATIC_LOGIN_PASSWORD,
    });

    if (userError || !user?.id)
      throw { message: "Failed to create user", error: userError };
    createdUser = user;

    // Step 2: Prepare file upload details
    const file = data.profileImage as File;
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
          name: data.fullName,
          username: data.username,
          address: data.address ?? null,
          dob: data.dateOfBirth,
          role: data.contractId,
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

export async function updateAgent(data: AddUserFormData, id: string) {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();
  const [existingProfile] = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.id, id));

  if (!existingProfile) {
    throw { message: "User not found" };
  }

  let createdUser: { id: string } | null = null;
  let uploadedFileName: string | null = null;

  try {
    const {
      data: { user },
      error: userError,
    } = await auth.admin.updateUserById(existingProfile!.userId!, {
      email: data.email,
    });
    if (userError || !user?.id) {
      throw { message: "Failed to update user", error: userError };
    }
    createdUser = user;

    if (data.profileImage instanceof File) {
      const file = data.profileImage;
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError)
        throw { message: "Failed to upload file", error: uploadError };
      uploadedFileName = fileName;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(fileName);

      const profileData = await db.rls((tx) => {
        return tx
          .update(profile)
          .set({
            name: data.fullName,
            username: data.username,
            address: data.address ?? null,
            dob: data.dateOfBirth,
            role: "Associate",
            status: "active",
            avatarUrl: publicUrl,
          })
          .where(eq(profile.id, id))
          .returning();
      });

      return { success: true, profile: profileData };
    }
  } catch (error) {
    // Rollback operations in reverse order
    console.error("Error in updateAgent, rolling back:", error);

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

export async function deleteAgent(id: string) {
  const { auth } = createAdminClient();
  const db = await createDrizzleSupabaseClient();

  // Get the user profile
  const [existingProfile] = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.id, id));

  if (!existingProfile) {
    throw { message: "User not found" };
  }

  // Disable user in Supabase Auth
  // Ban user until a far future date (e.g., 100 years from now)
  const banUntil = new Date();
  banUntil.setFullYear(banUntil.getFullYear() + 100);
  // Get the current authenticated user
  const {
    data: { user: currentUser },
    error: currentUserError,
  } = await auth.getUser();

  if (currentUserError) {
    throw { message: "Failed to get current user", error: currentUserError };
  }
  if (currentUser?.id !== existingProfile.userId) {
    await auth.admin.updateUserById(existingProfile.userId!, {
      ban_duration: banUntil.toISOString(), 
    });
  } else {
    throw { message: "You cannot delete your own account" };
  }

  // Update profile status and deletedAt
  await db.rls((tx) => {
    return tx
      .update(profile)
      .set({
        status: "disabled",
        deletedAt: new Date(),
      })
      .where(eq(profile.id, id));
  });

  return { success: true };
}
