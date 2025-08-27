"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/env";
import type { Database } from "database.types";
import { createDrizzleSupabaseClient } from "@/db/db";
import { eq, sql } from "drizzle-orm";
import { 
  profile, 
  permissions, 
  rolePermissions as rolePermissionsTable, 
  roles, 
  userPermissionsEnhanced, 
  userRoles 
} from "@/db/schema";
import { tryCatch } from "@/lib/utils";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { session },
    error: userError,
  } = await supabase.auth.getSession();
  if (userError) {
    throw { message: "Error fetching user", error: userError };
  }
  if (!session?.user) {
    throw { message: "User not found" };
  }

  const drizzle = await createDrizzleSupabaseClient();
  const { data: userProfile, error } = await tryCatch(
    drizzle.rls((tx) => {
      return tx
        .select()
        .from(profile)
        .where(eq(profile.userId, session.user.id))
        .limit(1);
    }),
  );
  if (error) {
    throw { message: "Error fetching profile", error };
  }
  if (!userProfile) {
    throw { message: "User profile not found" };
  }

  return { user: session.user, profile: userProfile[0] };
}

export async function getCurrentUserPermissions(): Promise<string[]> {
  const { user } = await getUser();
  const drizzle = await createDrizzleSupabaseClient();

  const { data, error } = await tryCatch(
    drizzle.rls(async (tx) => {
      // Get permissions from roles
      const rolePermissionsQuery = tx
        .select({
          permissionName: permissions.name,
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .innerJoin(rolePermissionsTable, eq(roles.id, rolePermissionsTable.roleId))
        .innerJoin(permissions, eq(rolePermissionsTable.permissionId, permissions.id))
        .where(
          sql`${userRoles.userId} = ${user.id} 
              AND ${userRoles.status} = 'active' 
              AND ${roles.status} = 'active'
              AND (${userRoles.expiresAt} IS NULL OR ${userRoles.expiresAt} > NOW())
              AND ${userRoles.deletedAt} IS NULL
              AND ${roles.deletedAt} IS NULL
              AND ${rolePermissionsTable.deletedAt} IS NULL
              AND ${permissions.deletedAt} IS NULL`
        );

      // Get direct permissions
      const directPermissionsQuery = tx
        .select({
          permissionName: permissions.name,
        })
        .from(userPermissionsEnhanced)
        .innerJoin(permissions, eq(userPermissionsEnhanced.permissionId, permissions.id))
        .where(
          sql`${userPermissionsEnhanced.userId} = ${user.id} 
              AND ${userPermissionsEnhanced.status} = 'active'
              AND (${userPermissionsEnhanced.expiresAt} IS NULL OR ${userPermissionsEnhanced.expiresAt} > NOW())
              AND ${userPermissionsEnhanced.deletedAt} IS NULL
              AND ${permissions.deletedAt} IS NULL`
        );

      // Execute both queries
      const [rolePerms, directPerms] = await Promise.all([
        rolePermissionsQuery,
        directPermissionsQuery,
      ]);

      // Combine and deduplicate permissions
      const allPermissions = new Set<string>();
      
      rolePerms.forEach((p: { permissionName: string }) => allPermissions.add(p.permissionName));
      directPerms.forEach((p: { permissionName: string }) => allPermissions.add(p.permissionName));

      return Array.from(allPermissions);
    })
  );

  if (error) {
    console.error("Error fetching user permissions:", error);
    throw new Error("Failed to fetch user permissions");
  }

  return data || [];
}
