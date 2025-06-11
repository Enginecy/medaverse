"use client";

import { createContext, useContext } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";
import type { Database } from "@/database.types";

const Context = createContext<SupabaseClient<Database> | undefined>(undefined);

const supabase = createBrowserClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function SupabaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Context.Provider value={supabase}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
