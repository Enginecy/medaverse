import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export function createAdminClient() {
    return createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL!,
      env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  