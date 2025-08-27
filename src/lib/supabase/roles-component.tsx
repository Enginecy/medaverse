
"use client";

import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { getCurrentUserPermissions } from "./server";

export function AllowPermissions({
  permissions,
  children,
  fallback = null,
}: {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      try {
        const permissions = await getCurrentUserPermissions();
        setUserPermissions(permissions);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setUserPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user?.user?.id]);

  if (isLoading) {
    return fallback;
  }

  // Check if user has at least one of the required permissions
  const hasPermission = permissions.some(permission => 
    userPermissions.includes(permission)
  );

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

export function usePermissions() {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      try {
        const permissions = await getCurrentUserPermissions();
        setUserPermissions(permissions);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setUserPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user?.user?.id]);

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(permission => userPermissions.includes(permission));
  };

  return {
    permissions: userPermissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
