"use server";

import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "generated/prisma";

export async function createAgent(data: AddUserFormData) {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  // Pre-validate that username doesn't exist
  const existingProfile = await prisma.profile.findUnique({
    where: { username: data.username },
  });

  if (existingProfile) {
    throw { message: "Username already exists" };
  }

  let createdUser: Prisma.usersGetPayload<{ select: { id: true } }> | null =
    null;
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
    const profile = await prisma.$transaction(async (tx) => {
      const newProfile = await tx.profile.create({
        data: {
          id: userId,
          name: data.fullName,
          username: data.username,
          address: data.address || null,
          dob: data.dateOfBirth.toISOString(),
          role: "Associate",
          status: "active",
          avatar_url: publicUrl,
          user_id: user.id,
        },
      });

      return newProfile;
    });

    return { success: true, profile };
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
