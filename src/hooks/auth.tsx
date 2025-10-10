"use client";

import { useSupabase } from "@/lib/supabase/provider";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import type { Tables } from "database.types";

type AuthUser = {
  user: User;
  profile?: Tables<"profile"> | null;
};

// Global cache to store user data and avoid redundant API calls
let cachedUser: AuthUser | null = null;
let isFetching = false;
let fetchPromise: Promise<AuthUser | null> | null = null;

export function useAuth() {
  const supabase = useSupabase();
  const auth = supabase.auth;

  const [user, setUser] = useState<AuthUser | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(!cachedUser);

  const getUser = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await auth.getSession();
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
    // If we already have cached user data, use it
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
      return;
    }

    // If already fetching, wait for that promise
    if (isFetching && fetchPromise) {
      fetchPromise.then((userData) => {
        setUser(userData);
        setIsLoading(false);
      });
      return;
    }

    const loadData = async () => {
      isFetching = true;
      
      const { user, error } = await getUser();
      if (error) {
        console.error(error);
        cachedUser = null;
        setUser(null);
        setIsLoading(false);
        isFetching = false;
        return null;
      }
      if (!user) {
        cachedUser = null;
        setUser(null);
        setIsLoading(false);
        isFetching = false;
        return null;
      }

      const { data: profile, error: profileError } = await getProfile(user);
      if (profileError) console.error(profileError);

      const userData = {
        user,
        profile: profile?.[0] ?? null,
      };
      
      cachedUser = userData;
      setUser(userData);
      setIsLoading(false);
      isFetching = false;
      
      return userData;
    };

    fetchPromise = loadData();
  }, [getUser, getProfile]);

  // Listen for auth state changes to invalidate cache
  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        cachedUser = null;
        setUser(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Invalidate cache to refetch on next mount
        cachedUser = null;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth]);

  return { user, isLoading };
}
