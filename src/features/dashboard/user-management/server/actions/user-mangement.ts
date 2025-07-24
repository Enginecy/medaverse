"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, userRoles } from "@/db/schema";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

import { eq } from "drizzle-orm";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { env } from "@/env";
import type { State } from "@/lib/data";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { showSonnerToast } from "@/lib/react-utils";

export async function createAgent(data: AddUserFormData) {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();
  const currentUser = await supabase.auth.getUser();

  if (!currentUser.data.user?.id) {
    throw { message: "You are unauthenticated" };
  }

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

    if (userError || !user?.id) throw { message: "Failed to create user" };
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
    const profileData = await db.rls(async (tx) => {
      await tx
        .insert(profile)
        .values({
          name: data.fullName,
          username: data.username,
          address: data.address ?? null,
          dob: data.dateOfBirth,
          phoneNumber: data.phoneNumber,
          regional: data.regional,
          upLine: data.upLine,
          npnNumber: data.npnNumber,
          states: data.states as State[],
          status: "active",
          avatarUrl: publicUrl,
          userId: user.id,
        })
        .returning();
      return await tx
        .insert(userRoles)
        .values({
          roleId: data.role,
          userId: user.id,
          assignedBy: currentUser.data.user?.id,
        })
        .returning({ id: userRoles.id });
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

    const currentUser = await supabase.auth.getUser();

    if (currentUser === null || currentUser.data.user === null) {
      throw { message: "Not Authorized" };
    }
    if (userError || !user?.id) {
      throw { message: "Failed to update user" };
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
        tx.update(userRoles)
          .set({
            roleId: data.role,
            userId: user.id,
            assignedBy: currentUser!.data!.user?.id,
          })
          .returning({ id: userRoles.id });

        return tx
          .update(profile)
          .set({
            name: data.fullName,
            username: data.username,
            address: data.address ?? null,
            dob: data.dateOfBirth,
            avatarUrl: publicUrl,
            phoneNumber: data.phoneNumber,
            regional: data.regional,
            upLine: data.upLine,
            npnNumber: data.npnNumber,
            states: data.states as State[],
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
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();

  // Get the user profile
  const [existingProfile] = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.id, id));

  if (!existingProfile) {
    throw { message: "User not found" };
  }

  const {
    data: { user: currentUser },
    error: currentUserError,
  } = await supabase.auth.getUser();

  if (currentUserError) {
    throw { message: "Failed to get current user" };
  }

  if (currentUser?.id === existingProfile.userId) {
    throw { message: "You cannot delete your account" };
  }

  const banUntil = new Date();
  banUntil.setFullYear(banUntil.getFullYear() + 100);

  await auth.admin.updateUserById(existingProfile.userId!, {
    ban_duration: banUntil.toISOString(),
  });

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

export async function addImportedUsers(importedData: Partial<User>[]) {
  const { auth } = createAdminClient();
  const db = await createDrizzleSupabaseClient();
  const supabase = await createClient();

  const currentUser = await supabase.auth.getUser();

  const roles = await getRoles();

  if (!currentUser.data.user?.id) {
    throw new Error ("You are unauthenticated");
  }

  for (const singleUser of importedData) {

    const existingProfile = await db.admin
      .select()
      .from(profile)
      .where(eq(profile.username, singleUser.username ?? ""));

    if (existingProfile.length > 0) {
      throw new Error ( "Username already exists");
    }

    const {
      data: { user },
      error: userError,
    } = await auth.admin.createUser({
      email: singleUser.email || "",
      email_confirm: true,
      password: env.AUTOMATIC_LOGIN_PASSWORD,
    });

    console.log("User <=========================================");
    if (userError || !user || !user.id) {
      throw new Error (userError?.message! + " " + singleUser.email);
    }

    const profileData = await db.rls(async (tx) => {
      await tx
        .insert(profile)
        .values({
          name: singleUser.name ?? "",
          username: singleUser.username ?? "",
          address: singleUser.address ?? "",
          dob: singleUser.dob
            ? new Date(singleUser.dob)
            : new Date("MM/DD/YYYY"),
          phoneNumber: singleUser.phoneNumber ?? "",
          regional: singleUser.regional ?? "",
          upLine: singleUser.upLine ?? "",
          npnNumber: singleUser.npnNumber ?? "",
          status: "active",
          userId: user?.id ?? "",
        })
        .returning();
      const role = roles.find((role) => singleUser.role ?? "" === role.name);
      //TODO: make sure this is right
      return await tx
        .insert(userRoles)
        .values({
          roleId: singleUser.role?.id ?? "",
          userId: user?.id ?? "",
          assignedBy: currentUser.data.user?.id,
        })
        .returning({ id: userRoles.id });
    });
  }
  return { success: true, message: "Users imported successfully" };
}
