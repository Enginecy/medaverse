"use client";

import { useSupabase } from "@/lib/supabase/provider";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import type { Tables } from "database.types";

type AuthUser = {
  user: User;
  profile?: Tables<"profile"> | null;
};

export function useAuth() {
  const supabase = useSupabase();
  const auth = supabase.auth;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await auth.getSession();
    setIsLoading(false);
    return { user: session?.user, error };
  }, [auth]);

  const getProfile = useCallback(
    async (user: User) => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.id);
      return { data, error };
    },
    [supabase],
  );

  useEffect(() => {
    const loadData = async () => {
      const { user, error } = await getUser();
      if (error) {
        console.error(error);
        setUser(null);
        setIsLoading(false);
        return;
      }
      if (!user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await getProfile(user);
      if (profileError) console.error(profileError);

      setUser({
        user,
        profile: profile?.[0] ?? null,
      });
    };
    loadData();
  }, [getUser, getProfile]);

  return { user, isLoading };
}
