"use client";

import { useSupabase } from "@/lib/supabase/provider";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import type { Tables } from "../../database.types";

type AuthUser = {
  user: User;
  profile?: Tables<"profile"> | null;
};

export function useAuth() {
  const { auth, from } = useSupabase();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getUser = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await auth.getUser();
    setIsLoading(false);
    return { user, error };
  }, [auth]);

  const getProfile = useCallback(
    async (user: User) => {
      const { data, error } = await from("profile")
        .select("*")
        .eq("user_id", user.id)
        .single();
      return { data, error };
    },
    [from],
  );

  useEffect(() => {
    getUser().then(({ user, error }) => {
      if (user) {
        getProfile(user).then(({ data, error }) => {
          if (data) {
            setUser({
              user,
              profile: data,
            });
          }
          if (error) {
            console.error(error);
          }
        });
      }
      if (error) {
        console.error(error);
        setUser(null);
      }
    });
  }, [getUser, getProfile]);

  return { user, isLoading };
}
