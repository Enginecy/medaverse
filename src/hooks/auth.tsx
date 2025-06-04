"use client";

import { useSupabase } from "@/lib/supabase/provider";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
  const { auth } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getUser = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await auth.getUser();
    setIsLoading(false);
    return { user, error };
  }, [auth]);

  useEffect(() => {
    getUser().then(({ user, error }) => {
      if (user) {
        setUser(user);
      }
      if (error) {
        console.error(error);
        setUser(null);
      }
    });
  }, [getUser]);

  return { user, isLoading };
}
