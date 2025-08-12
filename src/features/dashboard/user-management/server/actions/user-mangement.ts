"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, userRoles } from "@/db/schema";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

import { eq, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { State } from "@/lib/data";
import type { ActionResult } from "@/lib/utils";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";

export async function createAgent(
  data: AddUserFormData,
): Promise<ActionResult<void>> {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();
  const currentUser = await supabase.auth.getUser();

  if (!currentUser?.data.user?.id) {
    return {
      success: false,
      error: {
        message: "Not Authorized",
        statusCode: 401,
        details: "You must be logged in to perform this action.",
      },
    };
  }

  // Check if username already exists
  const existingProfile = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.username, data.username));

  if (existingProfile.length > 0) {
    return {
      success: false,
      error: {
        message: "Username already exists",
        statusCode: 400,
        details: "Please choose a different username.",
      },
    };
  }
  let createdUser: { id: string } | null = null;
  let uploadedFileName: string | null = null;
  let avatarUrl: string | null = null;

  try {
    // Step 1: Create user in Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      password: env.AUTOMATIC_LOGIN_PASSWORD,
      user_metadata: { must_update_password: true },
    });

    if (userError || !user?.id) {
      return {
        success: false,
        error: {
          message: "Failed to create user",
          statusCode: 400,
          details:
            userError?.message ?? "An error occurred while creating the user.",
        },
      };
    }

    createdUser = user;

    // Step 2: Prepare file upload details
    const file = data.profileImage as File;
    const userId = crypto.randomUUID();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    // Step 3: Upload to Supabase Storage
    if (file !== null && file.size > 0 && file) {
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        if (createdUser?.id) {
          try {
            await auth.admin.deleteUser(createdUser.id);
          } catch (cleanupError) {
            console.error("Failed to cleanup created user:", cleanupError);
          }
        }
        return {
          success: false,
          error: {
            message: "Failed to upload file",
            statusCode: 400,
            details:
              uploadError.message ||
              "An error occurred while uploading the file.",
          },
        };
      }
      uploadedFileName = fileName;
    }

    // Step 4: Get public URL
    if (uploadedFileName) {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("profile-images")
        .getPublicUrl(uploadedFileName!);

      avatarUrl = publicUrl;
    }

    // Step 5: Database operations in transaction
    await db.rls(async (tx) => {
      await tx
        .insert(profile)
        .values({
          name: data.fullName,
          username: data.username,
          office: data.office,
          dob: data.dateOfBirth,
          phoneNumber: data.phoneNumber,
          npnNumber: data.npnNumber,
          states: data.states ?? ([] as State[]),
          status: "active",
          ...(avatarUrl ? { avatarUrl } : {}),
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

    return { success: true, data: undefined };
  } catch {
    // Clean up uploaded file if it exists
    if (uploadedFileName) {
      try {
        await supabase.storage
          .from("profile-images")
          .remove([uploadedFileName]);
      } catch {
        return {
          success: false,
          error: {
            message: "Failed to upload file ",
            statusCode: 400,
            details: "An error occurred while cleaning up the uploaded file.",
          },
        };
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

    return {
      success: false,
      error: {
        message: "Failed to create user",
        statusCode: 400,
        details: "An error occurred while creating the user.",
      },
    };
  }
}

export async function updateAgent(
  data: AddUserFormData,
  id: string,
): Promise<ActionResult<void>> {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();
  const [existingProfile] = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.id, id));

  if (!existingProfile) {
    return {
      success: false,
      error: {
        message: "Failed to update user",
        statusCode: 400,
        details:
          "Something went wrong updating this user, please try again later.",
      },
    };
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

    if (currentUser?.data.user === null) {
      return {
        success: false,
        error: {
          message: "Not Authorized",
          statusCode: 401,
          details: "You must be authorized to perform this action.",
        },
      };
    }
    if (userError || !user?.id) {
      return {
        success: false,
        error: {
          message: "Failed to update user",
          statusCode: 400,
          details:
            userError?.message ?? "An error occurred while updating the user.",
        },
      };
    }
    createdUser = user;

    if (data.profileImage instanceof File) {
      const file = data.profileImage;
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        return {
          success: false,
          error: {
            message: "Failed to upload file",
            statusCode: 400,
            details:
              uploadError.message ||
              "An error occurred while uploading the file.",
          },
        };
      }
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
            office: data.office,
            dob: data.dateOfBirth,
            avatarUrl: publicUrl,
            phoneNumber: data.phoneNumber,
            npnNumber: data.npnNumber,
            states: data.states ?? ([] as State[]),
          })
          .where(eq(profile.id, id))
          .returning();
      });
      if (!profileData) {
        return {
          success: false,
          error: {
            message: "Failed to update user profile",
            statusCode: 400,
            details: "An error occurred while updating the user profile.",
          },
        };
      }
      return { success: true, data: undefined };
    }
  } catch {
    // Clean up uploaded file if it exists
    if (uploadedFileName) {
      try {
        await supabase.storage
          .from("profile-images")
          .remove([uploadedFileName]);
      } catch {
        return {
          success: false,
          error: {
            message: "Failed to upload file",
            statusCode: 400,
            details: "An error occurred uploading the image.",
          },
        };
      }
    }

    // Clean up created user if it exists
    if (createdUser?.id) {
      try {
        await auth.admin.deleteUser(createdUser.id);
      } catch {
        return {
          success: false,
          error: {
            message: "Failed to update user",
            statusCode: 400,
            details: "An error occurred while updating the user.",
          },
        };
      }
    }

    return {
      success: false,
      error: {
        message: "Failed to update user",
        statusCode: 400,
        details: "An error occurred while updating the user.",
      },
    };
  }
  return { success: true, data: undefined };
}

export async function deleteAgent(id: string): Promise<ActionResult<void>> {
  const { auth } = createAdminClient();
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();

  // Get the user profile
  const [existingProfile] = await db.admin
    .select()
    .from(profile)
    .where(eq(profile.id, id));

  const {
    data: { user: currentUser },
    error: currentUserError,
  } = await supabase.auth.getUser();

  if (currentUserError) {
    return {
      success: false,
      error: {
        message: "Not Authorized",
        statusCode: 401,
        details: "You must be authorized to perform this action.",
      },
    };
  }

  if (!existingProfile) {
    return {
      success: false,
      error: {
        message: "User not found",
        statusCode: 404,
        details: "The user you are trying to delete does not exist.",
      },
    };
  }

  if (currentUser?.id === existingProfile.userId) {
    return {
      success: false,
      error: {
        message: "Cannot delete current user",
        statusCode: 400,
        details: "You cannot delete your own account.",
      },
    };
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

  return { success: true, data: undefined };
}

export async function addImportedUsers(importedData: Partial<User>[]) {
  const createdUsers: { id: string }[] = [];

  try {
    // const { auth } = createAdminClient();
    const db = await createDrizzleSupabaseClient();
    const supabase = await createClient();

    const currentUser = await supabase.auth.getUser();

    if (!currentUser.data.user?.id) {
      return {
        success: false,
        error: {
          message: "You are unauthenticated",
          statusCode: 401,
          details: "You must be authorized to perform this action.",
        },
      };
    }

    // for (const singleUser of importedData) {
    //   console.log("Processing user:", singleUser);
    //   // Check if username already exists

    //   if (!singleUser.username) {
    //     return {
    //       success: false,
    //       error: {
    //         message: "Username is required for each user:",
    //         statusCode: 400,
    //         details: "Username is required for each user.",
    //       },
    //     };
    //   }
    //   const existingProfile = await db.admin
    //     .select()
    //     .from(profile)
    //     .where(eq(profile.username, singleUser.username ?? ""));

    //   if (existingProfile.length > 0) {
    //     return {
    //       success: false,
    //       error: {
    //         message: "Username already exists",
    //         statusCode: 400,
    //         details: "Username already exists.",
    //       },
    //     };
    //   }

    //   const {
    //     data: { user },
    //     error: userError,
    //   } = await auth.admin.createUser({
    //     email: singleUser.email ?? "",
    //     email_confirm: true,
    //     password: env.AUTOMATIC_LOGIN_PASSWORD,
    //   });

    //   if (userError || !user) {
    //     return {
    //       success: false,
    //       error: {
    //         message: "Failed to create user",
    //         statusCode: 400,
    //         details: "An error occurred while creating the user.",
    //       },
    //     };
    //   }

    //   createdUsers.push(user);
    // }

    const ids = await createUsersBulk(
      importedData.map((user) => ({
        email: user.email!,
        password: env.AUTOMATIC_LOGIN_PASSWORD,
        user_meta_data: { must_update_password: true },
      })),
    );

    createdUsers.push(...ids.map((id) => ({ id })));

    console.log("createdUsers", createdUsers);

   const result = await db.admin.transaction(async (tx) => {
      const profileValues = importedData.map((singleUser, index) => ({
        name: singleUser.name ?? "",
        username: singleUser.username ?? "",
        office: singleUser.office ?? null,
        dob: singleUser.dob ? new Date(singleUser.dob) : new Date("MM/DD/YYYY"),
        phoneNumber: singleUser.phoneNumber ?? "",
        npnNumber: singleUser.npnNumber ?? "",
        states: [],
        userId: createdUsers[index]?.id ?? "",
        status: "active" as const,
      }));

      console.log("profileValues", profileValues);

      const userRoleValues = importedData.map((singleUser, index) => ({
        roleId: singleUser.role?.id ?? "",
        userId: createdUsers[index]?.id ?? "",
        assignedBy: currentUser.data.user?.id,
      }));

      console.log("userRoleValues", userRoleValues);

      await tx.transaction(async (tx) => {
        await tx.insert(profile).values(profileValues);
        await tx.insert(userRoles).values(userRoleValues);
      });
      return 1
    });

    if (result !== 1) {
      throw new Error("Failed to import users");
    }

    return { success: true, message: "Users imported successfully" };
  } catch (error) {
    console.error("Error in addImportedUsers:", error);
    // print stack trace
    console.error(error instanceof Error ? error.stack : "Unknown error");
    // delete all created users
    const { auth } = createAdminClient();
    for (const user of createdUsers) {
      await auth.admin.deleteUser(user.id);
    }
    return {
      success: false,
      error: {
        message: "Failed to import users",
        statusCode: 400,
        details: "An error occurred while importing the users.",
      },
    };
  }
}

async function createUsersBulk(
  users: Array<{
    email: string;
    password: string;
    user_meta_data?: Record<string, unknown>;
  }>,
) {
  // Convert users array to JSONB array format
  const userJsonArray = users.map((user) =>
    JSON.stringify({
      email: user.email,
      password: user.password,
      user_meta_data: user.user_meta_data ?? {},
    }),
  );

  const db = await createDrizzleSupabaseClient();

  const ids = await db.admin.execute(
    sql`SELECT create_users_bulk_optimized(ARRAY[${sql.join(
      userJsonArray.map((userJson) => sql`${userJson}::jsonb`),
      sql`, `,
    )}])`,
  );
  console.log("ids", ids);
  const firstRow = ids[0];
  if (firstRow?.create_users_bulk_optimized) {
    const results = firstRow.create_users_bulk_optimized as string[];
    return results;
  }

  return [];
}
