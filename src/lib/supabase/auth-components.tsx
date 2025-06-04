"use client";

import { useAuth } from "@/hooks/auth";

/**
 * Renders children if the client is authenticated.
 *
 * @public
 */
export function Authenticated({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  return <>{children}</>;
}

/**
 * Renders children if the client is using authentication but is not authenticated.
 *
 * @public
 */
export function Unauthenticated({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  if (user) {
    return null;
  }
  return <>{children}</>;
}
