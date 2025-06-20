import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/env";
import type { Database } from "database.types";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createDrizzleSupabaseClient } from "@/db/db";
import { eq } from "drizzle-orm";
import { profile } from "@/db/schema";
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

export function createAdminClient() {
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
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
